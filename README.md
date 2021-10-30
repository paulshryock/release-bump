# Release Bump

Handle version bump tasks for a code release.

## Getting started

Fork this repo, find and replace `Project Name`, `Project Description`, and `project-name`, and remove this paragraph.

## Pre-requisites

| Tool    | Min. version | Install command      | Tested up to | Test date  |
| :---    | :---         | :---                 | :---         | :---       |
| Node.js | 17           | `nvm use 17`, `n 17` | `v17.0.1`    | 2021/10/30 |
| npm     | 8            | `npm i -g npm@8`     | `8.1.1`      | 2021/10/30 |

## Tool chain

| Purpose              | Tool                    |
| :---                 | :---                    |
| Formatting           | EditorConfig & Prettier |
| Linting              | ESLint                  |
| Type-checking        | TypeScript              |
| Unit testing         | Ava                     |
| Bundling & Compiling | Esbuild                 |
| Legacy transpiling   | swc                     |
| Git hooks            | Husky                   |

## Features

- Bump Changelog
- Bump JSDoc and DocBlock comments
- Bump WordPress theme or plugin

[View roadmap](https://github.com/paulshryock/release-bump/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)