#!/usr/bin/env node
var U=Object.defineProperty;var b=Object.getOwnPropertySymbols;var F=Object.prototype.hasOwnProperty,A=Object.prototype.propertyIsEnumerable;var E=(t,n,e)=>n in t?U(t,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[n]=e,f=(t,n)=>{for(var e in n||(n={}))F.call(n,e)&&E(t,e,n[e]);if(b)for(var e of b(n))A.call(n,e)&&E(t,e,n[e]);return t};var C=(t,n)=>{var e={};for(var r in t)F.call(t,r)&&n.indexOf(r)<0&&(e[r]=t[r]);if(t!=null&&b)for(var r of b(t))n.indexOf(r)<0&&A.call(t,r)&&(e[r]=t[r]);return e};var I={RELEASE_BUMP_VERSION:"3.0.0-alpha.21"},p={env:I};import{readFileSync as V}from"fs";import{readdir as j,stat as L}from"fs/promises";import{join as z}from"path";var v=[{description:"Path to changelog.",name:"changelogPath",type:"string"},{description:"Release date.",name:"date",type:"string"},{alias:"d",description:"Dry run.",name:"dryRun",type:"boolean"},{alias:"e",description:"Fail on error.",name:"failOnError",type:"boolean"},{description:"Path to directory of files to bump.",name:"filesPath",type:"string"},{description:"Directories to ignore.",name:"ignore",type:"string[]"},{alias:"h",description:"Log CLI usage text.",name:"help",type:"boolean"},{alias:"p",description:"Prefix release version with a 'v'.",name:"prefix",type:"boolean"},{alias:"q",description:"Quiet, no logs.",name:"quiet",type:"boolean"},{description:"Release version.",name:"release",type:"string"},{description:"Remote git repository URL.",name:"repository",type:"string"},{alias:"v",description:"Log Release Bump version.",name:"version",type:"boolean"}];function k(t,n){return t.filter(e=>!n.some(r=>e.includes(r)))}function Z(t){return/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&/=]*)/.test(t)?t:/^[-a-zA-Z0-9()!@:%_+~#?&=]+\/[-a-zA-Z0-9()!@:%_+~#?&=]+$/.test(t)?`https://github.com/${t}`:""}async function T(t,n){var h,d;let{date:e,isChangelog:r,prefix:o,quiet:a,release:s,repository:i}=n;if(!/^\d+\.\d+\.\d+$/.test(s))return a!==!0&&console.info(`not formatting text for prerelease ${s}`),t;let c=(d=(h=/\d+\.\d+\.\d+/.exec(s))==null?void 0:h[0])!=null?d:s;if(r===!1)return t.replace(/@([Ss]ince|[Vv]ersion)(:?\s+)unreleased/g,`@$1$2${c}`);let m=i.includes("bitbucket.org")?"bitbucket":"github",y=`${i}/${m==="bitbucket"?"commits":"releases"}/tag/${o?"v":""}${c}`,g=`## [${o?"v":""}${c}]`+(i!==""?`(${y})`:"")+(e?` - ${e}`:"");if(t.includes(g))return a!==!0&&console.info("changelog is already formatted"),t;let P=`(${i}/${m==="bitbucket"?"branches/":""}compare/HEAD..${o?"v":""}${c})`,x=`## [Unreleased]${i?P:""}

### `+["Added","Changed","Deprecated","Removed","Fixed","Security"].join(`

### `);return t.replace(/## \[Unreleased\](\(.*\))?/,g).replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n\n/g,"").replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n$/g,"").replace(/\n\n$/g,`
`).replace(g,x+`

`+g)}function B(t){return[`Usage
	$ release-bump <options>`,"Options"+t.reduce((n,e)=>{let r=e.alias?(e.name.length<6?"	":"")+`	-${e.alias}`:"		",o=e.alias?`	${e.description}`:(e.name.length<6?"	":"")+e.description;return n+`
	--${e.name}${r}${o}`},""),`Examples
	$ release-bump -pq --files=src`].join(`

`)}async function R(t){let{directoriesToIgnore:n,failOnError:e,filesPath:r,paths:o}=t;if(n.some(i=>r.includes(i)))return o!=null?o:[];let a=[];try{a=await j(r)}catch(i){if(i.code!=="ENOENT"){if(e)throw p.exitCode=1,i;console.warn(`could not read files in ${r}`)}a=[]}let s=(await Promise.all(a.map(async i=>(await L(`${r}/${i}`)).isDirectory()===!0?await R({directoriesToIgnore:n,failOnError:e,filesPath:`${r}/${i}`,paths:o}):z(`${r}/${i}`)))).flat();return[...o,...s]}async function D(){return p.env.RELEASE_BUMP_VERSION?"v"+p.env.RELEASE_BUMP_VERSION:"no version found"}function N(t,n){return t.reduce((e,r,o)=>{let a={};if(r.indexOf("--")===0){let[s,i]=r.substr(2).split("="),l=n.find(c=>c.name===s);if(l)switch(l.type){case"boolean":a[s]=!0;break;case"string[]":a[s]=i==null?void 0:i.split(",");break;default:a[s]=i;break}}else if(r.indexOf("-")===0)[...r.substr(1)].forEach(s=>{let i=n.find(l=>l.alias===s);i&&(a[i.name]=!0)});else{let s=Object.keys(e),i=s[s.length-1],l=n.find(c=>c.name===i);l&&(e[i]===`$${o-1}`||typeof e[i]>"u")&&(a[i]=l.type==="string[]"?r.split(","):r)}return f(f({},e),a)},{})}function _(t){var a;let n={repository:"",version:"0.0.0"};try{n=JSON.parse(V("package.json","utf8"))}catch(s){p.env.NODE_ENV!=="test"&&t.quiet!==!0&&console.warn("could not read package.json")}let e=[".git",".github","coverage","dist","node_modules","tests/fixtures"],r={changelogPath:"CHANGELOG.md",date:(a=new Date().toISOString().split("T"))==null?void 0:a[0],dryRun:!1,failOnError:!1,filesPath:".",ignore:e,prefix:!1,quiet:p.env.NODE_ENV==="test"||!1,release:n.version,repository:Z(n.repository)};return f(f({},r),t)}import{readFile as G,writeFile as H}from"fs/promises";async function q(t){let{changelogPath:n,date:e,dryRun:r,failOnError:o,filesPath:a,ignore:s,prefix:i,quiet:l,release:c,repository:m}=_(t),y=p.env.NODE_ENV==="test"||r===!0,g=s,x=await R({directoriesToIgnore:g,failOnError:o,filesPath:a,paths:[n]}),h=k(x,g),d=[];return await Promise.all(h.map(async u=>{let $="";try{$=await G(u,"utf8")}catch(O){if(o)throw p.exitCode=1,O;l!==!0&&console.warn(`could not read ${u}`)}let w=await T($,{date:e,isChangelog:n===u,prefix:i,quiet:l,release:c,repository:m});if($!==w&&(d.push(u),y!==!0))try{await H(u,w,"utf8")}catch(O){if(o)throw p.exitCode=1,O;l!==!0&&console.warn(`could not write ${u}`)}})),d.length>0&&l!==!0&&console.info((y?"would have ":"")+`bumped ${d.join(", ")}`),r?[]:d}(async function(){var o,a;let t=(a=(o=p.argv)==null?void 0:o.slice(2))!=null?a:[],s=N(t,v),{help:n,version:e}=s,r=C(s,["help","version"]);if(n===!0)return console.info(B(v));if(e===!0)return console.info(await D());await q(r)})();
