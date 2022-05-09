var V=Object.create;var u=Object.defineProperty;var z=Object.getOwnPropertyDescriptor;var Z=Object.getOwnPropertyNames,C=Object.getOwnPropertySymbols,G=Object.getPrototypeOf,j=Object.prototype.hasOwnProperty,H=Object.prototype.propertyIsEnumerable;var S=(e,t,n)=>t in e?u(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,b=(e,t)=>{for(var n in t||(t={}))j.call(t,n)&&S(e,n,t[n]);if(C)for(var n of C(t))H.call(t,n)&&S(e,n,t[n]);return e};var J=(e,t)=>{for(var n in t)u(e,n,{get:t[n],enumerable:!0})},v=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of Z(t))!j.call(e,r)&&r!==n&&u(e,r,{get:()=>t[r],enumerable:!(o=z(t,r))||o.enumerable});return e};var B=(e,t,n)=>(n=e!=null?V(G(e)):{},v(t||!e||!e.__esModule?u(n,"default",{value:e,enumerable:!0}):n,e)),M=e=>v(u({},"__esModule",{value:!0}),e);var X={};J(X,{releaseBump:()=>K});module.exports=M(X);var Q="3.0.0-alpha.49",R={RELEASE_BUMP_VERSION:Q};var D=require("console"),w=require("fs"),p=require("fs/promises"),T=require("path");function I(e,t){return e.filter(n=>!t.some(o=>n.includes(o)))}function L(e){let t=[];return e.forEach(n=>{Array.isArray(n)?t.push(...L(n)):t.push(n)}),t}function q(e){if(typeof e=="string"){if(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&/=]*)/.test(e))return e;if(/^[-a-zA-Z0-9()!@:%_+~#?&=]+\/[-a-zA-Z0-9()!@:%_+~#?&=]+$/.test(e))return`https://github.com/${e}`}else return typeof(e==null?void 0:e.url)>"u"?"":q(e.url.replace(/(^git\+|\.git$)/,""));return""}async function _(e,t){var m,h;let{date:n,isChangelog:o,prefix:r,release:a,repository:i}=t;if(/^\d+\.\d+\.\d+$/.test(a)===!1)return e;let l=(h=(m=/\d+\.\d+\.\d+/.exec(a))==null?void 0:m[0])!=null?h:a;if(o===!1)return e.replace(/(\* @?)([Ss]ince|[Vv]ersion)(:?\s+)unreleased/g,`$1$2$3${l}`).replace(/(\/\*+\n)((.+\n)+?)?(^(( |\t)*\**( |\t)*)?([Tt]heme|[Pp]lugin) [Nn]ame.+\n)((.+\n)+?)(^(( |\t)*\**( |\t)*)?([Ss]ince|[Vv]ersion)(:?\s+)(\d+\.\d+(\.\d+)?)\n)((.+\n)+?)(\s*\*+\/)/m,`$1$2$4$9$12$15$16${l}
$19$21`);let g=i.includes("bitbucket.org")?"bitbucket":"github",O=`${i}/${g==="bitbucket"?"commits":"releases"}/tag/${r?"v":""}${l}`,c=`## [${r?"v":""}${l}]`+(i!==""?`(${O})`:"")+(n?` - ${n}`:"");if(e.includes(c))return e;let d=`(${i}/${g==="bitbucket"?"branches/":""}compare/HEAD..${r?"v":""}${l})`,F=`## [Unreleased]${i?d:""}

### `+["Added","Changed","Deprecated","Removed","Fixed","Security"].join(`

### `);return e.replace(/## \[Unreleased\](\(.*\))?/,c).replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n\n/g,"").replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n$/g,"").replace(/\n\n$/g,`
`).replace(c,F+`

`+c)}async function W(e){var r,a;let t=e!=null?e:"";switch((r=["js","mjs","cjs","json"].find(i=>t.indexOf(`.${i}`)===t.length-`.${i}`.length))!=null?r:""){case"js":case"mjs":case"cjs":{let i=await Promise.resolve().then(()=>B(require(t))).catch(()=>({}));if(typeof i=="function"){let s=await i();if(typeof s!="object"||Object.keys(s).length<1)break;return s}else if(typeof i.default=="function"){let s=await i.default();if(typeof s!="object"||Object.keys(s).length<1)break;return s}if(Object.keys(i).length>0)return(a=i.default)!=null?a:i;break}case"json":try{return JSON.parse(await(0,p.readFile)(t,"utf8"))}catch(i){}break;default:break}return{}}async function k(e){let{directoriesToIgnore:t,failOnError:n,filesPath:o,paths:r}=e;if(t.some(s=>o.includes(s)))return r!=null?r:[];let a=[];try{a=await(0,p.readdir)(o)}catch(s){if(n)throw process.exitCode=1,s;a=[]}let i=await Promise.all(a.map(async s=>(await(0,p.stat)(`${o}/${s}`)).isDirectory()===!0?await k({directoriesToIgnore:t,failOnError:n,filesPath:`${o}/${s}`,paths:r}):(0,T.join)(`${o}/${s}`)));return[...new Set(L([...r,...i]))]}function U({quiet:e}){return e===!0?new D.Console({stdout:(0,w.createWriteStream)("/dev/null"),stderr:(0,w.createWriteStream)("/dev/null")}):console}async function N(e){var s,l;let t,n=R.NODE_ENV==="test"||!1;try{t=JSON.parse(await(0,p.readFile)("package.json","utf8"))}catch(g){t={repository:"",version:"0.0.0"}}let o=[".git",".github","coverage","dist","node_modules","tests/fixtures"],r={changelogPath:"CHANGELOG.md",configPath:"release-bump.config.js",date:(s=new Date().toISOString().split("T"))==null?void 0:s[0],dryRun:!1,failOnError:!1,filesPath:".",ignore:o,prefix:!1,quiet:n,release:t.version,repository:q(t.repository)},a=await W((l=e==null?void 0:e.configPath)!=null?l:r.configPath);return b(b(b({},r),a),e)}var x=require("fs/promises");async function K(e){let{changelogPath:t,date:n,dryRun:o,failOnError:r,filesPath:a,ignore:i,prefix:s,quiet:l,release:g,repository:O}=await N(e),c=U({quiet:l}),d=i,m=await k({directoriesToIgnore:d,failOnError:r,filesPath:a,paths:[t]}),h=I(m,d),y=[];return await Promise.all(h.map(async f=>{let P="";try{P=await(0,x.readFile)(f,"utf8")}catch($){if(r)throw process.exitCode=1,$;c.warn(`could not read ${f}`)}let E=await _(P,{date:n,isChangelog:t===f,prefix:s,quiet:l,release:g,repository:O});if(P!==E&&(y.push(f),!o))try{await(0,x.writeFile)(f,E,"utf8")}catch($){if(r)throw process.exitCode=1,$;c.warn(`could not write ${f}`,$)}})),y.length>0&&c.info((o?"would have ":"")+`bumped ${y.join(", ")}`),y}0&&(module.exports={releaseBump});
