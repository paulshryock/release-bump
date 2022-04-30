#!/usr/bin/env node
var K=Object.create;var F=Object.defineProperty;var X=Object.getOwnPropertyDescriptor;var Y=Object.getOwnPropertyNames,O=Object.getOwnPropertySymbols,ee=Object.getPrototypeOf,k=Object.prototype.hasOwnProperty,B=Object.prototype.propertyIsEnumerable;var S=(e,t,n)=>t in e?F(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,p=(e,t)=>{for(var n in t||(t={}))k.call(t,n)&&S(e,n,t[n]);if(O)for(var n of O(t))B.call(t,n)&&S(e,n,t[n]);return e};var A=(e,t)=>{var n={};for(var r in e)k.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&O)for(var r of O(e))t.indexOf(r)<0&&B.call(e,r)&&(n[r]=e[r]);return n};var te=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Y(t))!k.call(e,o)&&o!==n&&F(e,o,{get:()=>t[o],enumerable:!(r=X(t,o))||r.enumerable});return e};var T=(e,t,n)=>(n=e!=null?K(ee(e)):{},te(t||!e||!e.__esModule?F(n,"default",{value:e,enumerable:!0}):n,e));var ne="3.0.0-alpha.43",y={RELEASE_BUMP_VERSION:ne};var I=require("console"),C=require("fs"),f=require("fs/promises"),L=require("path"),E=[{alternates:["changelog-path","changelog"],description:"Path to changelog.",name:"changelogPath",type:"string"},{alias:"c",alternates:["config-path","config"],description:"Path to config file",name:"configPath",type:"string"},{description:"Release date.",name:"date",type:"string"},{alias:"d",alternates:["dry-run","dry"],description:"Dry run.",name:"dryRun",type:"boolean"},{alias:"e",alternates:["fail-on-error","fail"],description:"Fail on error.",name:"failOnError",type:"boolean"},{alternates:["files-path","files"],description:"Path to directory of files to bump.",name:"filesPath",type:"string"},{description:"Directories to ignore.",name:"ignore",type:"string[]"},{alias:"h",description:"Log CLI usage text.",name:"help",type:"boolean"},{alias:"p",description:"Prefix release version with a 'v'.",name:"prefix",type:"boolean"},{alias:"q",description:"Quiet, no logs.",name:"quiet",type:"boolean"},{description:"Release version.",name:"release",type:"string"},{alternates:["repo"],description:"Remote git repository URL.",name:"repository",type:"string"},{alias:"v",description:"Log Release Bump version.",name:"version",type:"boolean"}];function q(e,t){return e.filter(n=>!t.some(r=>n.includes(r)))}function _(e){let t=[];return e.forEach(n=>{Array.isArray(n)?t.push(..._(n)):t.push(n)}),t}function U(e){if(typeof e=="string"){if(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&/=]*)/.test(e))return e;if(/^[-a-zA-Z0-9()!@:%_+~#?&=]+\/[-a-zA-Z0-9()!@:%_+~#?&=]+$/.test(e))return`https://github.com/${e}`}else return typeof(e==null?void 0:e.url)>"u"?"":U(e.url.replace(/(^git\+|\.git$)/,""));return""}async function N(e,t){var h,w;let{date:n,isChangelog:r,prefix:o,release:a,repository:s}=t;if(!/^\d+\.\d+\.\d+$/.test(a))return e;let l=(w=(h=/\d+\.\d+\.\d+/.exec(a))==null?void 0:h[0])!=null?w:a;if(r===!1)return e.replace(/@([Ss]ince|[Vv]ersion)(:?\s+)unreleased/g,`@$1$2${l}`);let c=s.includes("bitbucket.org")?"bitbucket":"github",g=`${s}/${c==="bitbucket"?"commits":"releases"}/tag/${o?"v":""}${l}`,u=`## [${o?"v":""}${l}]`+(s!==""?`(${g})`:"")+(n?` - ${n}`:"");if(e.includes(u))return e;let P=`(${s}/${c==="bitbucket"?"branches/":""}compare/HEAD..${o?"v":""}${l})`,m=`## [Unreleased]${s?P:""}

### `+["Added","Changed","Deprecated","Removed","Fixed","Security"].join(`

### `);return e.replace(/## \[Unreleased\](\(.*\))?/,u).replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n\n/g,"").replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n$/g,"").replace(/\n\n$/g,`
`).replace(u,m+`

`+u)}async function V(e){var o,a;let t=e!=null?e:"";switch((o=["js","mjs","cjs","json"].find(s=>t.indexOf(`.${s}`)===t.length-`.${s}`.length))!=null?o:""){case"js":case"mjs":case"cjs":{let s=await Promise.resolve().then(()=>T(require(t))).catch(()=>({}));if(typeof s=="function"){let i=await s();if(typeof i!="object"||Object.keys(i).length<1)break;return i}else if(typeof s.default=="function"){let i=await s.default();if(typeof i!="object"||Object.keys(i).length<1)break;return i}if(Object.keys(s).length>0)return(a=s.default)!=null?a:s;break}case"json":try{return JSON.parse(await(0,f.readFile)(t,"utf8"))}catch(s){}break;default:break}return{}}function z(e){return[`Usage
	$ release-bump <options>`,"Options"+e.reduce((t,n)=>{let r=n.alias?(n.name.length<6?"	":"")+`	-${n.alias}`:"		",o=n.alias?`	${n.description}`:(n.name.length<6?"	":"")+n.description;return t+`
	--${n.name}${r}${o}`},""),`Examples
	$ release-bump -pq --files=src`].join(`

`)}async function v(e){let{directoriesToIgnore:t,failOnError:n,filesPath:r,paths:o}=e;if(t.some(i=>r.includes(i)))return o!=null?o:[];let a=[];try{a=await(0,f.readdir)(r)}catch(i){if(n)throw process.exitCode=1,i;a=[]}let s=await Promise.all(a.map(async i=>(await(0,f.stat)(`${r}/${i}`)).isDirectory()===!0?await v({directoriesToIgnore:t,failOnError:n,filesPath:`${r}/${i}`,paths:o}):(0,L.join)(`${r}/${i}`)));return[...new Set(_([...o,...s]))]}function Z(e){return e!=null&&e.RELEASE_BUMP_VERSION?"v"+e.RELEASE_BUMP_VERSION:"no version found"}function G({quiet:e}){return e===!0?new I.Console({stdout:(0,C.createWriteStream)("/dev/null"),stderr:(0,C.createWriteStream)("/dev/null")}):console}function H(e,t){return e.reduce((n,r,o)=>{let a={};if(r.indexOf("--")===0){let[s,i]=r.substr(2).split("="),l=t.find(c=>{var g;return c.name===s||((g=c==null?void 0:c.alternates)!=null?g:[]).includes(s)});if(l)switch(l.type){case"boolean":a[l.name]=!0;break;case"string[]":a[l.name]=i==null?void 0:i.split(",");break;default:a[l.name]=i;break}}else if(r.indexOf("-")===0)[...r.substr(1)].forEach(s=>{let i=t.find(l=>l.alias===s);i&&(a[i.name]=!0)});else{let s=Object.keys(n),i=s[s.length-1],l=t.find(c=>c.name===i);l&&(n[i]===`$${o-1}`||typeof n[i]>"u")&&(a[i]=l.type==="string[]"?r.split(","):r)}return p(p({},n),a)},{})}async function J(e){var s;let t,n=y.NODE_ENV==="test"||!1;try{t=JSON.parse(await(0,f.readFile)("package.json","utf8"))}catch(i){t={repository:"",version:"0.0.0"}}let r=[".git",".github","coverage","dist","node_modules","tests/fixtures"],o={changelogPath:"CHANGELOG.md",configPath:"release-bump.config.js",date:(s=new Date().toISOString().split("T"))==null?void 0:s[0],dryRun:!1,failOnError:!1,filesPath:".",ignore:r,prefix:!1,quiet:n,release:t.version,repository:U(t.repository)};return p(p({},o),e)}var $=require("fs/promises");async function M(e){let t=await J(e),n=await V(t.configPath),{changelogPath:r,date:o,dryRun:a,failOnError:s,filesPath:i,ignore:l,prefix:c,quiet:g,release:u,repository:P}=p(p({},n),t),m=G({quiet:g}),h=l,Q=await v({directoriesToIgnore:h,failOnError:s,filesPath:i,paths:[r]}),W=q(Q,h),b=[];return await Promise.all(W.map(async d=>{let R="";try{R=await(0,$.readFile)(d,"utf8")}catch(x){if(s)throw process.exitCode=1,x;m.warn(`could not read ${d}`)}let j=await N(R,{date:o,isChangelog:r===d,prefix:c,quiet:g,release:u,repository:P});if(R!==j&&(b.push(d),!a))try{await(0,$.writeFile)(d,j,"utf8")}catch(x){if(s)throw process.exitCode=1,x;m.warn(`could not write ${d}`,x)}})),b.length>0&&m.info((a?"would have ":"")+`bumped ${b.join(", ")}`),b}(async function(){var o,a;let e=(a=(o=process.argv)==null?void 0:o.slice(2))!=null?a:[],s=H(e,E),{help:t,version:n}=s,r=A(s,["help","version"]);if(t===!0)return console.info(z(E));if(n===!0)return console.info(Z(y));await M(r)})();
