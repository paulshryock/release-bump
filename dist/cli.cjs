#!/usr/bin/env node
var __defProp=Object.defineProperty;var __getOwnPropSymbols=Object.getOwnPropertySymbols;var __hasOwnProp=Object.prototype.hasOwnProperty,__propIsEnum=Object.prototype.propertyIsEnumerable;var __defNormalProp=(obj,key,value)=>key in obj?__defProp(obj,key,{enumerable:!0,configurable:!0,writable:!0,value}):obj[key]=value,__spreadValues=(a,b)=>{for(var prop in b||(b={}))__hasOwnProp.call(b,prop)&&__defNormalProp(a,prop,b[prop]);if(__getOwnPropSymbols)for(var prop of __getOwnPropSymbols(b))__propIsEnum.call(b,prop)&&__defNormalProp(a,prop,b[prop]);return a};var __objRest=(source,exclude)=>{var target={};for(var prop in source)__hasOwnProp.call(source,prop)&&exclude.indexOf(prop)<0&&(target[prop]=source[prop]);if(source!=null&&__getOwnPropSymbols)for(var prop of __getOwnPropSymbols(source))exclude.indexOf(prop)<0&&__propIsEnum.call(source,prop)&&(target[prop]=source[prop]);return target};var RELEASE_BUMP_VERSION="3.0.0-alpha.60",define_process_env_default={RELEASE_BUMP_VERSION};var import_index=require("./index.cjs");var availableArgs=[{alternates:["changelog-path","changelog"],description:"Path to changelog.",name:"changelogPath",type:"string"},{alias:"c",alternates:["config-path","config"],description:"Path to config file",name:"configPath",type:"string"},{description:"Release date.",name:"date",type:"string"},{alias:"d",alternates:["dry-run","dry"],description:"Dry run.",name:"dryRun",type:"boolean"},{alias:"e",alternates:["fail-on-error","fail"],description:"Fail on error.",name:"failOnError",type:"boolean"},{alternates:["files-path","files"],description:"Path to directory of files to bump.",name:"filesPath",type:"string"},{description:"Directories to ignore.",name:"ignore",type:"string[]"},{alias:"h",description:"Log CLI usage text.",name:"help",type:"boolean"},{alias:"p",description:"Prefix release version with a 'v'.",name:"prefix",type:"boolean"},{alias:"q",description:"Quiet, no logs.",name:"quiet",type:"boolean"},{description:"Release version.",name:"release",type:"string"},{alternates:["repo"],description:"Remote git repository URL.",name:"repository",type:"string"},{alias:"v",description:"Log Release Bump version.",name:"version",type:"boolean"}];function getHelpText(availableArgs2){return[`Usage
	$ release-bump <options>`,"Options"+availableArgs2.reduce((output,current)=>{let alias=current.alias?(current.name.length<6?"	":"")+`	-${current.alias}`:"		",description=current.alias?`	${current.description}`:(current.name.length<6?"	":"")+current.description;return output+`
	--${current.name}${alias}${description}`},""),`Examples
	$ release-bump -pq --files=src`].join(`

`)}function getVersionText(env){return env!=null&&env.RELEASE_BUMP_VERSION?"v"+env.RELEASE_BUMP_VERSION:"no version found"}function parseOptionsFromArgs(passedArgs,availableArgs2){return passedArgs.reduce((all,current,index)=>{let modified={};if(current.indexOf("--")===0){let[key,value]=current.substr(2).split("="),arg=availableArgs2.find(availableArg=>{var _a;return availableArg.name===key||((_a=availableArg==null?void 0:availableArg.alternates)!=null?_a:[]).includes(key)});if(arg)switch(arg.type){case"boolean":modified[arg.name]=!0;break;case"string[]":modified[arg.name]=value==null?void 0:value.split(",");break;default:modified[arg.name]=value;break}}else if(current.indexOf("-")===0)[...current.substr(1)].forEach(alias=>{let arg=availableArgs2.find(availableArg=>availableArg.alias===alias);arg&&(modified[arg.name]=!0)});else{let keys=Object.keys(all),key=keys[keys.length-1],arg=availableArgs2.find(availableArg=>availableArg.name===key);arg&&(all[key]===`$${index-1}`||typeof all[key]>"u")&&(modified[key]=arg.type==="string[]"?current.split(","):current)}return __spreadValues(__spreadValues({},all),modified)},{})}(async function(){var _a,_b;let passedArgs=(_b=(_a=process.argv)==null?void 0:_a.slice(2))!=null?_b:[],_c=parseOptionsFromArgs(passedArgs,availableArgs),{help,version}=_c,options=__objRest(_c,["help","version"]);if(help===!0)return console.info(getHelpText(availableArgs));if(version===!0)return console.info(getVersionText(define_process_env_default));await(0,import_index.releaseBump)(options)})();
