var z=Object.create;var b=Object.defineProperty;var V=Object.getOwnPropertyDescriptor;var Z=Object.getOwnPropertyNames,F=Object.getOwnPropertySymbols,G=Object.getPrototypeOf,C=Object.prototype.hasOwnProperty,H=Object.prototype.propertyIsEnumerable;var k=(e,t,n)=>t in e?b(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,g=(e,t)=>{for(var n in t||(t={}))C.call(t,n)&&k(e,n,t[n]);if(F)for(var n of F(t))H.call(t,n)&&k(e,n,t[n]);return e};var J=e=>b(e,"__esModule",{value:!0});var E=(e=>typeof require!="undefined"?require:typeof Proxy!="undefined"?new Proxy(e,{get:(t,n)=>(typeof require!="undefined"?require:t)[n]}):e)(function(e){if(typeof require!="undefined")return require.apply(this,arguments);throw new Error('Dynamic require of "'+e+'" is not supported')});var M=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Z(t))!C.call(e,i)&&(n||i!=="default")&&b(e,i,{get:()=>t[i],enumerable:!(o=V(t,i))||o.enumerable});return e},j=(e,t)=>M(J(b(e!=null?z(G(e)):{},"default",!t&&e&&e.__esModule?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);var Q="3.0.0-alpha.40",P={RELEASE_BUMP_VERSION:Q};import{Console as W}from"console";import{createWriteStream as v}from"fs";import{readdir as K,readFile as B,stat as X}from"fs/promises";import{join as Y}from"path";function A(e,t){return e.filter(n=>!t.some(o=>n.includes(o)))}function D(e){let t=[];return e.forEach(n=>{Array.isArray(n)?t.push(...D(n)):t.push(n)}),t}function T(e){if(typeof e=="string"){if(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&/=]*)/.test(e))return e;if(/^[-a-zA-Z0-9()!@:%_+~#?&=]+\/[-a-zA-Z0-9()!@:%_+~#?&=]+$/.test(e))return`https://github.com/${e}`}else return typeof(e==null?void 0:e.url)>"u"?"":T(e.url.replace(/(^git\+|\.git$)/,""));return""}async function I(e,t){var d,O;let{date:n,isChangelog:o,prefix:i,release:a,repository:r}=t;if(!/^\d+\.\d+\.\d+$/.test(a))return e;let l=(O=(d=/\d+\.\d+\.\d+/.exec(a))==null?void 0:d[0])!=null?O:a;if(o===!1)return e.replace(/@([Ss]ince|[Vv]ersion)(:?\s+)unreleased/g,`@$1$2${l}`);let f=r.includes("bitbucket.org")?"bitbucket":"github",m=`${r}/${f==="bitbucket"?"commits":"releases"}/tag/${i?"v":""}${l}`,c=`## [${i?"v":""}${l}]`+(r!==""?`(${m})`:"")+(n?` - ${n}`:"");if(e.includes(c))return e;let x=`(${r}/${f==="bitbucket"?"branches/":""}compare/HEAD..${i?"v":""}${l})`,u=`## [Unreleased]${r?x:""}

### `+["Added","Changed","Deprecated","Removed","Fixed","Security"].join(`

### `);return e.replace(/## \[Unreleased\](\(.*\))?/,c).replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n\n/g,"").replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n$/g,"").replace(/\n\n$/g,`
`).replace(c,u+`

`+c)}async function L(e){var i,a;let t=e!=null?e:"release-bump.config.js";switch((i=["js","mjs","cjs","json"].find(r=>t.indexOf(`.${r}`)===t.length-`.${r}`.length))!=null?i:""){case"js":case"mjs":case"cjs":{let r=await Promise.resolve().then(()=>j(E(t))).catch(()=>({}));if(typeof r=="function"){let s=await r();if(typeof s!="object"||Object.keys(s).length<1)break;return s}else if(typeof r.default=="function"){let s=await r.default();if(typeof s!="object"||Object.keys(s).length<1)break;return s}if(Object.keys(r).length>0)return(a=r.default)!=null?a:r;break}case"json":try{return JSON.parse(await B(t,"utf8"))}catch(r){}break;default:break}return{}}async function R(e){let{directoriesToIgnore:t,failOnError:n,filesPath:o,paths:i}=e;if(t.some(s=>o.includes(s)))return i!=null?i:[];let a=[];try{a=await K(o)}catch(s){if(n)throw process.exitCode=1,s;a=[]}let r=await Promise.all(a.map(async s=>(await X(`${o}/${s}`)).isDirectory()===!0?await R({directoriesToIgnore:t,failOnError:n,filesPath:`${o}/${s}`,paths:i}):Y(`${o}/${s}`)));return[...new Set(D([...i,...r]))]}function q({quiet:e}){return e===!0?new W({stdout:v("/dev/null"),stderr:v("/dev/null")}):console}async function _(e){var r;let t,n=P.NODE_ENV==="test"||!1;try{t=JSON.parse(await B("package.json","utf8"))}catch(s){t={repository:"",version:"0.0.0"}}let o=[".git",".github","coverage","dist","node_modules","tests/fixtures"],i={changelogPath:"CHANGELOG.md",configFilePath:"release-bump.config.js",date:(r=new Date().toISOString().split("T"))==null?void 0:r[0],dryRun:!1,failOnError:!1,filesPath:".",ignore:o,prefix:!1,quiet:n,release:t.version,repository:T(t.repository)};return g(g({},i),e)}import{readFile as ee,writeFile as te}from"fs/promises";async function ue(e){let t=await _(e),n=await L(t.configFilePath),{changelogPath:o,date:i,dryRun:a,failOnError:r,filesPath:s,ignore:l,prefix:f,quiet:m,release:c,repository:x}=g(g({},n),t),u=q({quiet:m}),d=l,U=await R({directoriesToIgnore:d,failOnError:r,filesPath:s,paths:[o]}),N=A(U,d),h=[];return await Promise.all(N.map(async p=>{let $="";try{$=await ee(p,"utf8")}catch(y){if(r)throw process.exitCode=1,y;u.warn(`could not read ${p}`)}let w=await I($,{date:i,isChangelog:o===p,prefix:f,quiet:m,release:c,repository:x});if($!==w&&(h.push(p),!a))try{await te(p,w,"utf8")}catch(y){if(r)throw process.exitCode=1,y;u.warn(`could not write ${p}`,y)}})),h.length>0&&u.info((a?"would have ":"")+`bumped ${h.join(", ")}`),h}export{ue as releaseBump};
