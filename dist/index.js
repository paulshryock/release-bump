var _=Object.create;var x=Object.defineProperty;var U=Object.getOwnPropertyDescriptor;var N=Object.getOwnPropertyNames,k=Object.getOwnPropertySymbols,V=Object.getPrototypeOf,E=Object.prototype.hasOwnProperty,z=Object.prototype.propertyIsEnumerable;var F=(e,t,n)=>t in e?x(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,y=(e,t)=>{for(var n in t||(t={}))E.call(t,n)&&F(e,n,t[n]);if(k)for(var n of k(t))z.call(t,n)&&F(e,n,t[n]);return e};var C=(e=>typeof require!="undefined"?require:typeof Proxy!="undefined"?new Proxy(e,{get:(t,n)=>(typeof require!="undefined"?require:t)[n]}):e)(function(e){if(typeof require!="undefined")return require.apply(this,arguments);throw new Error('Dynamic require of "'+e+'" is not supported')});var Z=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of N(t))!E.call(e,r)&&r!==n&&x(e,r,{get:()=>t[r],enumerable:!(o=U(t,r))||o.enumerable});return e};var S=(e,t,n)=>(n=e!=null?_(V(e)):{},Z(t||!e||!e.__esModule?x(n,"default",{value:e,enumerable:!0}):n,e));var G="3.0.0-alpha.49",O={RELEASE_BUMP_VERSION:G};import{Console as H}from"console";import{createWriteStream as v}from"fs";import{readdir as J,readFile as B,stat as M}from"fs/promises";import{join as Q}from"path";function A(e,t){return e.filter(n=>!t.some(o=>n.includes(o)))}function D(e){let t=[];return e.forEach(n=>{Array.isArray(n)?t.push(...D(n)):t.push(n)}),t}function T(e){if(typeof e=="string"){if(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&/=]*)/.test(e))return e;if(/^[-a-zA-Z0-9()!@:%_+~#?&=]+\/[-a-zA-Z0-9()!@:%_+~#?&=]+$/.test(e))return`https://github.com/${e}`}else return typeof(e==null?void 0:e.url)>"u"?"":T(e.url.replace(/(^git\+|\.git$)/,""));return""}async function I(e,t){var u,d;let{date:n,isChangelog:o,prefix:r,release:a,repository:i}=t;if(/^\d+\.\d+\.\d+$/.test(a)===!1)return e;let l=(d=(u=/\d+\.\d+\.\d+/.exec(a))==null?void 0:u[0])!=null?d:a;if(o===!1)return e.replace(/(\* @?)([Ss]ince|[Vv]ersion)(:?\s+)unreleased/g,`$1$2$3${l}`).replace(/(\/\*+\n)((.+\n)+?)?(^(( |\t)*\**( |\t)*)?([Tt]heme|[Pp]lugin) [Nn]ame.+\n)((.+\n)+?)(^(( |\t)*\**( |\t)*)?([Ss]ince|[Vv]ersion)(:?\s+)(\d+\.\d+(\.\d+)?)\n)((.+\n)+?)(\s*\*+\/)/m,`$1$2$4$9$12$15$16${l}
$19$21`);let p=i.includes("bitbucket.org")?"bitbucket":"github",$=`${i}/${p==="bitbucket"?"commits":"releases"}/tag/${r?"v":""}${l}`,c=`## [${r?"v":""}${l}]`+(i!==""?`(${$})`:"")+(n?` - ${n}`:"");if(e.includes(c))return e;let f=`(${i}/${p==="bitbucket"?"branches/":""}compare/HEAD..${r?"v":""}${l})`,R=`## [Unreleased]${i?f:""}

### `+["Added","Changed","Deprecated","Removed","Fixed","Security"].join(`

### `);return e.replace(/## \[Unreleased\](\(.*\))?/,c).replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n\n/g,"").replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n$/g,"").replace(/\n\n$/g,`
`).replace(c,R+`

`+c)}async function W(e){var r,a;let t=e!=null?e:"";switch((r=["js","mjs","cjs","json"].find(i=>t.indexOf(`.${i}`)===t.length-`.${i}`.length))!=null?r:""){case"js":case"mjs":case"cjs":{let i=await Promise.resolve().then(()=>S(C(t))).catch(()=>({}));if(typeof i=="function"){let s=await i();if(typeof s!="object"||Object.keys(s).length<1)break;return s}else if(typeof i.default=="function"){let s=await i.default();if(typeof s!="object"||Object.keys(s).length<1)break;return s}if(Object.keys(i).length>0)return(a=i.default)!=null?a:i;break}case"json":try{return JSON.parse(await B(t,"utf8"))}catch(i){}break;default:break}return{}}async function P(e){let{directoriesToIgnore:t,failOnError:n,filesPath:o,paths:r}=e;if(t.some(s=>o.includes(s)))return r!=null?r:[];let a=[];try{a=await J(o)}catch(s){if(n)throw process.exitCode=1,s;a=[]}let i=await Promise.all(a.map(async s=>(await M(`${o}/${s}`)).isDirectory()===!0?await P({directoriesToIgnore:t,failOnError:n,filesPath:`${o}/${s}`,paths:r}):Q(`${o}/${s}`)));return[...new Set(D([...r,...i]))]}function L({quiet:e}){return e===!0?new H({stdout:v("/dev/null"),stderr:v("/dev/null")}):console}async function q(e){var s,l;let t,n=O.NODE_ENV==="test"||!1;try{t=JSON.parse(await B("package.json","utf8"))}catch(p){t={repository:"",version:"0.0.0"}}let o=[".git",".github","coverage","dist","node_modules","tests/fixtures"],r={changelogPath:"CHANGELOG.md",configPath:"release-bump.config.js",date:(s=new Date().toISOString().split("T"))==null?void 0:s[0],dryRun:!1,failOnError:!1,filesPath:".",ignore:o,prefix:!1,quiet:n,release:t.version,repository:T(t.repository)},a=await W((l=e==null?void 0:e.configPath)!=null?l:r.configPath);return y(y(y({},r),a),e)}import{readFile as K,writeFile as X}from"fs/promises";async function pe(e){let{changelogPath:t,date:n,dryRun:o,failOnError:r,filesPath:a,ignore:i,prefix:s,quiet:l,release:p,repository:$}=await q(e),c=L({quiet:l}),f=i,u=await P({directoriesToIgnore:f,failOnError:r,filesPath:a,paths:[t]}),d=A(u,f),m=[];return await Promise.all(d.map(async g=>{let b="";try{b=await K(g,"utf8")}catch(h){if(r)throw process.exitCode=1,h;c.warn(`could not read ${g}`)}let w=await I(b,{date:n,isChangelog:t===g,prefix:s,quiet:l,release:p,repository:$});if(b!==w&&(m.push(g),!o))try{await X(g,w,"utf8")}catch(h){if(r)throw process.exitCode=1,h;c.warn(`could not write ${g}`,h)}})),m.length>0&&c.info((o?"would have ":"")+`bumped ${m.join(", ")}`),m}export{pe as releaseBump};
