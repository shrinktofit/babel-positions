# Cocos Creator's Positions on switching babel version

## Why comes this repository?

Cocos Creator(3D) uses the excellent [babel](https://github.com/babel/babel) as its compiler to transform source, mainly written in TypeScript, of engine and project scripts.

When Creator expects a new language feature, it needs to upgrade babel. For code quality, Creator wish to know babel's stuff as possible to ensure that every upgrade decision should not implicitly break code's performance and compatibility.

There is a story. Creator tried to bump babel to version 7.9.x during development of Cocos Creator v1.0. Cocos team found that babel 7.9.x has a performance issue when transform language feature super classes. Even, from some aspect, it's not a issue of babel. For detail, see https://github.com/babel/babel/issues/11356 .

## Contents

This repository contains a specified version of Cocos Creator engine source and two transform environments called **old**(at `./old`) and **new**(at `./new`). Both they are used to transform the same engine source.

When an upgrade decision is made. You should take the following steps:

1. Update the engine sub-module code if necessary.
2. Mark the existing **new** environment as **old** and then create a new environment.
3. Modify the new environment to satisfy your requirements.
4. Then you run the script `generate.ps1` to do the transform. You will see the transform result at `new-out` and `old out`.
5. Compare the transform result use a diff compare tool, such as [Beyond Compare](https://www.scootersoftware.com/). It would be better if your tool has directory comparison feature.
6. Repeat step 3-4 till the changes are acceptable.
7. Apply the new environment to Cocos Creator. Emplace a `version` file in new environment to record the Cocos Creator version.

## Change log

#### < 1.2(Cocos Creator(3D) version)

#### 1.2

Engine source: 

Changes:
* Add support of logical assignment operators

Diffs:

* 

Notes:

*

PRs:
* [@cocos/babel-preset-cc](https://github.com/cocos-creator/babel-preset-cc/pull/3)