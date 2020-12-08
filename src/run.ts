
import yargs from 'yargs';
import generations, { Generation } from './generations';
import fs from 'fs-extra';
import ps from 'path';
import { createRequire } from 'module';
import cp from 'child_process';
import { ReportPage } from './report-page';

(async () => {
    await run({
        namesToCompare: process.argv.slice(2),
    });
})();

async function run({
    namesToCompare,
}: {
    namesToCompare: string[];
}) {
    const samples = await getSamples();

    const rootInstallDir = 'installs';

    const generators = await Promise.all(namesToCompare.map(async (name): Promise<Generator> => {
        const generation = generations[name];
        if (!generation) {
            throw new Error(`Generation '${name}' not found`);
        }
        const generationInstallDir = ps.join(rootInstallDir, name);
        // await installGeneration(generation, name, generationInstallDir);
        const babel = createRequire(ps.resolve(generationInstallDir, 'index.js'))('@babel/core');
        return {
            name,
            babel,
            options: generation.babelOptions,
            cwd: generationInstallDir,
        };
    }));

    const reportPage = new ReportPage(
        samples.map((sample) => sample.name),
        generators.map((generator) => generator.name),
    );

    for (const generator of generators) {
        for (const sample of samples) {
            const code = await generateSample(sample, generator);
            reportPage.add(generator.name, sample.name, code);
        }
    }

    const renderedPage = reportPage.render();
    await fs.writeFile(ps.join(rootInstallDir, 'report.html'), renderedPage, { encoding: 'utf8' });
}

async function getSamples() {
    const sampleFiles: string[] = [];
    await readRecursive(ps.join(__dirname, '..', 'samples'), (file) => {
        sampleFiles.push(file);
    });
    return await Promise.all(sampleFiles.map(async (sampleFile): Promise<Sample> => {
        const code = await fs.readFile(sampleFile, 'utf8');
        return {
            name: sampleFile,
            code,
        };
    }));
}

async function readRecursive(root: string, visit: (file: string) => void) {
    for (const name of await fs.readdir(root)) {
        const file = ps.join(root, name);
        const stat = await fs.stat(file);
        if (stat.isFile()) {
            visit(file);
        } else if (stat.isDirectory()) {
            readRecursive(file, visit);
        }
    }
}

async function generateSample(sample: Sample, generator: Generator) {
    const result = await generator.babel.transformAsync(sample.code, {
        cwd: generator.cwd,
        ...generator.options,
    });
    return result!.code!;
}

async function installGeneration(generation: Generation, generationName: string, installDir: string) {
    const lockFile = ps.join(__dirname, '..', 'generation-locks', `${generationName}.package-lock.json`);
    const lock: PackageLock = await fs.readJson(lockFile);
    const npmPackage: {
        name: string;
        version: string;
        dependencies: Record<string, string>,
    } = {
        name: lock.name,
        version: lock.version,
        dependencies: {},
    };
    const lockDeps: Record<string, PackageLockDependency> = {};
    for (const depName of generation.installs.concat('@babel/core', '@babel/generator')) {
        const lockDep = lock.dependencies[depName];
        if (lockDep) {
            lockDeps[depName] = lockDep;
            npmPackage.dependencies[depName] = lockDep.version;
        }
    }
    const extractedLock: PackageLock = {
        ...lock,
        // dependencies: lockDeps,
    };
    await fs.outputJson(ps.join(installDir, 'package.json'), npmPackage, { spaces: 2 });
    await fs.outputJson(ps.join(installDir, 'package-lock.json'), extractedLock, { spaces: 2 });

    await cp.execSync('npm ci', {
        cwd: installDir,
    });
}

interface Generator {
    name: string;
    babel: typeof import('@babel/core');
    options: import('@babel/core').TransformOptions;
    cwd: string;
}

interface Sample {
    name: string;
    code: string;
}


interface PackageLock {
    name: string;
    version: string;
    dependencies: Record<string, PackageLockDependency>;
}

interface PackageLockDependency {
    version: string;
    dependencies: Record<string, PackageLockDependency>;
}