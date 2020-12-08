
export interface Generation {
    installs: string[];
    requireFrom?: string[];
    babelOptions: import('@babel/core').TransformOptions;
}

const generations: Record<string, Generation> = {
    '3.0-preview': {
        installs: [
            "@cocos/babel-preset-cc",
            "@babel/preset-env"
        ],
        babelOptions: {
            presets: [
                ['@babel/preset-env'],
                ['@cocos/babel-preset-cc'],
            ],
        },
    },
    '3.1': {
        installs: [
            "@cocos/babel-preset-cc",
            "@babel/preset-env"
        ],
        babelOptions: {
            presets: [
                ['@babel/preset-env'],
                ['@cocos/babel-preset-cc'],
            ],
        },
    },
};

export default generations;
