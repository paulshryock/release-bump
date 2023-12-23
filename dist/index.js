#!/usr/bin/env node

import{argv,exit}from"node:process";import{readFile,writeFile}from"node:fs/promises";var DEFAULT_CHANGELOG=`# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security
`,Changelog=class{#content;constructor(content=DEFAULT_CHANGELOG,version2="Unreleased",date=new Date){this.#content=version2==="Unreleased"?content:this.#bump(content,version2,this.#formatDate(date))}toString(){return this.#content}#bump(content,version2,date){return content.replaceAll(/### [A-Z][a-z]+\n{2,}(?!-)/gu,"").replace(/## \[Unreleased\]/u,`## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security

## [${version2}] - ${date}`)}#formatDate(date){let[month,day,year]=date.toLocaleString("en-US",{day:"2-digit",month:"2-digit",timeZone:"utc",year:"numeric"}).split("/");return[year,month,day].join("-")}};import{resolve}from"node:path";import{spawn}from"node:child_process";var[,,version]=argv,helpText=`
  Usage: release-bump [version]

  Bumps changelog and docblock @since versions from unreleased to new version.

  From command line: \`npm exec release-bump -- 2.0.0\`
  package.json.scripts.version: "release-bump $npm_package_version && git add ."
`;version||(console.log(helpText),exit(0));/$\d+\.\d+\.\d+^/u.test(version)||exit(0);var shellScriptPath=resolve("./dist/index.sh");console.debug({shellScriptPath});var command=spawn(shellScriptPath,[version]);command.stdout.on("data",output=>{console.log(`${output}`)});command.stderr.on("data",output=>{console.error(`${output}`)});command.on("close",code=>{code!==0&&console.log(`./dist/index.sh exited with code ${code}`)});var filePath=resolve("./CHANGELOG.md"),currentChangelog=await readFile(filePath,"utf8")??"",changelog=new Changelog(currentChangelog,version??"Unreleased");await writeFile(filePath,changelog.toString(),"utf8");
