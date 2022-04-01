#!/usr/bin/env node
var z=Object.defineProperty;var b=Object.getOwnPropertySymbols;var k=Object.prototype.hasOwnProperty,C=Object.prototype.propertyIsEnumerable;var A=(e,n,t)=>n in e?z(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t,f=(e,n)=>{for(var t in n||(n={}))k.call(n,t)&&A(e,t,n[t]);if(b)for(var t of b(n))C.call(n,t)&&A(e,t,n[t]);return e};var S=(e,n)=>{var t={};for(var r in e)k.call(e,r)&&n.indexOf(r)<0&&(t[r]=e[r]);if(e!=null&&b)for(var r of b(e))n.indexOf(r)<0&&C.call(e,r)&&(t[r]=e[r]);return t};var Z={RELEASE_BUMP_VERSION:"3.0.0-alpha.27"},c={env:Z};var B=require("fs"),x=require("fs/promises"),D=require("path"),P=[{description:"Path to changelog.",name:"changelogPath",type:"string"},{description:"Release date.",name:"date",type:"string"},{alias:"d",description:"Dry run.",name:"dryRun",type:"boolean"},{alias:"e",description:"Fail on error.",name:"failOnError",type:"boolean"},{description:"Path to directory of files to bump.",name:"filesPath",type:"string"},{description:"Directories to ignore.",name:"ignore",type:"string[]"},{alias:"h",description:"Log CLI usage text.",name:"help",type:"boolean"},{alias:"p",description:"Prefix release version with a 'v'.",name:"prefix",type:"boolean"},{alias:"q",description:"Quiet, no logs.",name:"quiet",type:"boolean"},{description:"Release version.",name:"release",type:"string"},{description:"Remote git repository URL.",name:"repository",type:"string"},{alias:"v",description:"Log Release Bump version.",name:"version",type:"boolean"}];function N(e,n){return e.filter(t=>!n.some(r=>t.includes(r)))}function _(e){if(typeof e=="string"){if(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&/=]*)/.test(e))return e;if(/^[-a-zA-Z0-9()!@:%_+~#?&=]+\/[-a-zA-Z0-9()!@:%_+~#?&=]+$/.test(e))return`https://github.com/${e}`}else return typeof(e==null?void 0:e.url)>"u"?"":_(e.url.replace(/(^git\+|\.git$)/,""));return""}async function q(e,n){var y,u;let{date:t,isChangelog:r,prefix:s,quiet:a,release:o,repository:i}=n;if(!/^\d+\.\d+\.\d+$/.test(o))return e;let p=(u=(y=/\d+\.\d+\.\d+/.exec(o))==null?void 0:y[0])!=null?u:o;if(r===!1)return e.replace(/@([Ss]ince|[Vv]ersion)(:?\s+)unreleased/g,`@$1$2${p}`);let m=i.includes("bitbucket.org")?"bitbucket":"github",h=`${i}/${m==="bitbucket"?"commits":"releases"}/tag/${s?"v":""}${p}`,g=`## [${s?"v":""}${p}]`+(i!==""?`(${h})`:"")+(t?` - ${t}`:"");if(e.includes(g))return a!==!0&&console.info("changelog is already formatted"),e;let E=`(${i}/${m==="bitbucket"?"branches/":""}compare/HEAD..${s?"v":""}${p})`,O=`## [Unreleased]${i?E:""}

### `+["Added","Changed","Deprecated","Removed","Fixed","Security"].join(`

### `);return e.replace(/## \[Unreleased\](\(.*\))?/,g).replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n\n/g,"").replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n$/g,"").replace(/\n\n$/g,`
`).replace(g,O+`

`+g)}function U(e){return[`Usage
	$ release-bump <options>`,"Options"+e.reduce((n,t)=>{let r=t.alias?(t.name.length<6?"	":"")+`	-${t.alias}`:"		",s=t.alias?`	${t.description}`:(t.name.length<6?"	":"")+t.description;return n+`
	--${t.name}${r}${s}`},""),`Examples
	$ release-bump -pq --files=src`].join(`

`)}async function w(e){let{directoriesToIgnore:n,failOnError:t,filesPath:r,paths:s}=e;if(n.some(i=>r.includes(i)))return s!=null?s:[];let a=[];try{a=await(0,x.readdir)(r)}catch(i){if(i.code!=="ENOENT"){if(t)throw c.exitCode=1,i;console.warn(`could not read files in ${r}`)}a=[]}let o=(await Promise.all(a.map(async i=>(await(0,x.stat)(`${r}/${i}`)).isDirectory()===!0?await w({directoriesToIgnore:n,failOnError:t,filesPath:`${r}/${i}`,paths:s}):(0,D.join)(`${r}/${i}`)))).flat();return[...s,...o]}async function I(){return c.env.RELEASE_BUMP_VERSION?"v"+c.env.RELEASE_BUMP_VERSION:"no version found"}function V(e,n){return e.reduce((t,r,s)=>{let a={};if(r.indexOf("--")===0){let[o,i]=r.substr(2).split("="),l=n.find(p=>p.name===o);if(l)switch(l.type){case"boolean":a[o]=!0;break;case"string[]":a[o]=i==null?void 0:i.split(",");break;default:a[o]=i;break}}else if(r.indexOf("-")===0)[...r.substr(1)].forEach(o=>{let i=n.find(l=>l.alias===o);i&&(a[i.name]=!0)});else{let o=Object.keys(t),i=o[o.length-1],l=n.find(p=>p.name===i);l&&(t[i]===`$${s-1}`||typeof t[i]>"u")&&(a[i]=l.type==="string[]"?r.split(","):r)}return f(f({},t),a)},{})}function j(e){var a;let n={repository:"",version:"0.0.0"};try{n=JSON.parse((0,B.readFileSync)("package.json","utf8"))}catch(o){c.env.NODE_ENV!=="test"&&e.quiet!==!0&&console.warn("could not read package.json")}let t=[".git",".github","coverage","dist","node_modules","tests/fixtures"],r={changelogPath:"CHANGELOG.md",date:(a=new Date().toISOString().split("T"))==null?void 0:a[0],dryRun:!1,failOnError:!1,filesPath:".",ignore:t,prefix:!1,quiet:c.env.NODE_ENV==="test"||!1,release:n.version,repository:_(n.repository)};return f(f({},r),e)}var $=require("fs/promises");async function L(e){let{changelogPath:n,date:t,dryRun:r,failOnError:s,filesPath:a,ignore:o,prefix:i,quiet:l,release:p,repository:m}=j(e),h=c.env.NODE_ENV==="test"||r===!0,g=o,O=await w({directoriesToIgnore:g,failOnError:s,filesPath:a,paths:[n]}),y=N(O,g),u=[];return await Promise.all(y.map(async d=>{let R="";try{R=await(0,$.readFile)(d,"utf8")}catch(v){if(s)throw c.exitCode=1,v;l!==!0&&console.warn(`could not read ${d}`)}let F=await q(R,{date:t,isChangelog:n===d,prefix:i,quiet:l,release:p,repository:m});if(R!==F&&(u.push(d),h!==!0))try{await(0,$.writeFile)(d,F,"utf8")}catch(v){if(s)throw c.exitCode=1,v;l!==!0&&console.warn(`could not write ${d}`)}})),u.length>0&&l!==!0&&console.info((h?"would have ":"")+`bumped ${u.join(", ")}`),r?[]:u}(async function(){var s,a;let e=(a=(s=c.argv)==null?void 0:s.slice(2))!=null?a:[],o=V(e,P),{help:n,version:t}=o,r=S(o,["help","version"]);if(n===!0)return console.info(U(P));if(t===!0)return console.info(await I());await L(r)})();
