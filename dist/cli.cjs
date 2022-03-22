#!/usr/bin/env node
var L=Object.defineProperty;var b=Object.getOwnPropertySymbols;var C=Object.prototype.hasOwnProperty,S=Object.prototype.propertyIsEnumerable;var A=(t,n,e)=>n in t?L(t,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[n]=e,f=(t,n)=>{for(var e in n||(n={}))C.call(n,e)&&A(t,e,n[e]);if(b)for(var e of b(n))S.call(n,e)&&A(t,e,n[e]);return t};var k=(t,n)=>{var e={};for(var r in t)C.call(t,r)&&n.indexOf(r)<0&&(e[r]=t[r]);if(t!=null&&b)for(var r of b(t))n.indexOf(r)<0&&S.call(t,r)&&(e[r]=t[r]);return e};var z={RELEASE_BUMP_VERSION:"3.0.0-alpha.21"},p={env:z};var B=require("fs"),x=require("fs/promises"),D=require("path"),P=[{description:"Path to changelog.",name:"changelogPath",type:"string"},{description:"Release date.",name:"date",type:"string"},{alias:"d",description:"Dry run.",name:"dryRun",type:"boolean"},{alias:"e",description:"Fail on error.",name:"failOnError",type:"boolean"},{description:"Path to directory of files to bump.",name:"filesPath",type:"string"},{description:"Directories to ignore.",name:"ignore",type:"string[]"},{alias:"h",description:"Log CLI usage text.",name:"help",type:"boolean"},{alias:"p",description:"Prefix release version with a 'v'.",name:"prefix",type:"boolean"},{alias:"q",description:"Quiet, no logs.",name:"quiet",type:"boolean"},{description:"Release version.",name:"release",type:"string"},{description:"Remote git repository URL.",name:"repository",type:"string"},{alias:"v",description:"Log Release Bump version.",name:"version",type:"boolean"}];function N(t,n){return t.filter(e=>!n.some(r=>e.includes(r)))}function Z(t){return/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&/=]*)/.test(t)?t:/^[-a-zA-Z0-9()!@:%_+~#?&=]+\/[-a-zA-Z0-9()!@:%_+~#?&=]+$/.test(t)?`https://github.com/${t}`:""}async function _(t,n){var h,d;let{date:e,isChangelog:r,prefix:o,quiet:a,release:s,repository:i}=n;if(!/^\d+\.\d+\.\d+$/.test(s))return a!==!0&&console.info(`not formatting text for prerelease ${s}`),t;let c=(d=(h=/\d+\.\d+\.\d+/.exec(s))==null?void 0:h[0])!=null?d:s;if(r===!1)return t.replace(/@([Ss]ince|[Vv]ersion)(:?\s+)unreleased/g,`@$1$2${c}`);let m=i.includes("bitbucket.org")?"bitbucket":"github",y=`${i}/${m==="bitbucket"?"commits":"releases"}/tag/${o?"v":""}${c}`,g=`## [${o?"v":""}${c}]`+(i!==""?`(${y})`:"")+(e?` - ${e}`:"");if(t.includes(g))return a!==!0&&console.info("changelog is already formatted"),t;let E=`(${i}/${m==="bitbucket"?"branches/":""}compare/HEAD..${o?"v":""}${c})`,O=`## [Unreleased]${i?E:""}

### `+["Added","Changed","Deprecated","Removed","Fixed","Security"].join(`

### `);return t.replace(/## \[Unreleased\](\(.*\))?/,g).replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n\n/g,"").replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n$/g,"").replace(/\n\n$/g,`
`).replace(g,O+`

`+g)}function q(t){return[`Usage
	$ release-bump <options>`,"Options"+t.reduce((n,e)=>{let r=e.alias?(e.name.length<6?"	":"")+`	-${e.alias}`:"		",o=e.alias?`	${e.description}`:(e.name.length<6?"	":"")+e.description;return n+`
	--${e.name}${r}${o}`},""),`Examples
	$ release-bump -pq --files=src`].join(`

`)}async function w(t){let{directoriesToIgnore:n,failOnError:e,filesPath:r,paths:o}=t;if(n.some(i=>r.includes(i)))return o!=null?o:[];let a=[];try{a=await(0,x.readdir)(r)}catch(i){if(i.code!=="ENOENT"){if(e)throw p.exitCode=1,i;console.warn(`could not read files in ${r}`)}a=[]}let s=(await Promise.all(a.map(async i=>(await(0,x.stat)(`${r}/${i}`)).isDirectory()===!0?await w({directoriesToIgnore:n,failOnError:e,filesPath:`${r}/${i}`,paths:o}):(0,D.join)(`${r}/${i}`)))).flat();return[...o,...s]}async function U(){return p.env.RELEASE_BUMP_VERSION?"v"+p.env.RELEASE_BUMP_VERSION:"no version found"}function I(t,n){return t.reduce((e,r,o)=>{let a={};if(r.indexOf("--")===0){let[s,i]=r.substr(2).split("="),l=n.find(c=>c.name===s);if(l)switch(l.type){case"boolean":a[s]=!0;break;case"string[]":a[s]=i==null?void 0:i.split(",");break;default:a[s]=i;break}}else if(r.indexOf("-")===0)[...r.substr(1)].forEach(s=>{let i=n.find(l=>l.alias===s);i&&(a[i.name]=!0)});else{let s=Object.keys(e),i=s[s.length-1],l=n.find(c=>c.name===i);l&&(e[i]===`$${o-1}`||typeof e[i]>"u")&&(a[i]=l.type==="string[]"?r.split(","):r)}return f(f({},e),a)},{})}function V(t){var a;let n={repository:"",version:"0.0.0"};try{n=JSON.parse((0,B.readFileSync)("package.json","utf8"))}catch(s){p.env.NODE_ENV!=="test"&&t.quiet!==!0&&console.warn("could not read package.json")}let e=[".git",".github","coverage","dist","node_modules","tests/fixtures"],r={changelogPath:"CHANGELOG.md",date:(a=new Date().toISOString().split("T"))==null?void 0:a[0],dryRun:!1,failOnError:!1,filesPath:".",ignore:e,prefix:!1,quiet:p.env.NODE_ENV==="test"||!1,release:n.version,repository:Z(n.repository)};return f(f({},r),t)}var $=require("fs/promises");async function j(t){let{changelogPath:n,date:e,dryRun:r,failOnError:o,filesPath:a,ignore:s,prefix:i,quiet:l,release:c,repository:m}=V(t),y=p.env.NODE_ENV==="test"||r===!0,g=s,O=await w({directoriesToIgnore:g,failOnError:o,filesPath:a,paths:[n]}),h=N(O,g),d=[];return await Promise.all(h.map(async u=>{let v="";try{v=await(0,$.readFile)(u,"utf8")}catch(R){if(o)throw p.exitCode=1,R;l!==!0&&console.warn(`could not read ${u}`)}let F=await _(v,{date:e,isChangelog:n===u,prefix:i,quiet:l,release:c,repository:m});if(v!==F&&(d.push(u),y!==!0))try{await(0,$.writeFile)(u,F,"utf8")}catch(R){if(o)throw p.exitCode=1,R;l!==!0&&console.warn(`could not write ${u}`)}})),d.length>0&&l!==!0&&console.info((y?"would have ":"")+`bumped ${d.join(", ")}`),r?[]:d}(async function(){var o,a;let t=(a=(o=p.argv)==null?void 0:o.slice(2))!=null?a:[],s=I(t,P),{help:n,version:e}=s,r=k(s,["help","version"]);if(n===!0)return console.info(q(P));if(e===!0)return console.info(await U());await j(r)})();
