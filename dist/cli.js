#!/usr/bin/env node
var I=Object.defineProperty;var b=Object.getOwnPropertySymbols;var F=Object.prototype.hasOwnProperty,A=Object.prototype.propertyIsEnumerable;var E=(e,n,t)=>n in e?I(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t,f=(e,n)=>{for(var t in n||(n={}))F.call(n,t)&&E(e,t,n[t]);if(b)for(var t of b(n))A.call(n,t)&&E(e,t,n[t]);return e};var k=(e,n)=>{var t={};for(var r in e)F.call(e,r)&&n.indexOf(r)<0&&(t[r]=e[r]);if(e!=null&&b)for(var r of b(e))n.indexOf(r)<0&&A.call(e,r)&&(t[r]=e[r]);return t};var V={RELEASE_BUMP_VERSION:"3.0.0-alpha.25"},p={env:V};import{readFileSync as j}from"fs";import{readdir as L,stat as z}from"fs/promises";import{join as Z}from"path";var R=[{description:"Path to changelog.",name:"changelogPath",type:"string"},{description:"Release date.",name:"date",type:"string"},{alias:"d",description:"Dry run.",name:"dryRun",type:"boolean"},{alias:"e",description:"Fail on error.",name:"failOnError",type:"boolean"},{description:"Path to directory of files to bump.",name:"filesPath",type:"string"},{description:"Directories to ignore.",name:"ignore",type:"string[]"},{alias:"h",description:"Log CLI usage text.",name:"help",type:"boolean"},{alias:"p",description:"Prefix release version with a 'v'.",name:"prefix",type:"boolean"},{alias:"q",description:"Quiet, no logs.",name:"quiet",type:"boolean"},{description:"Release version.",name:"release",type:"string"},{description:"Remote git repository URL.",name:"repository",type:"string"},{alias:"v",description:"Log Release Bump version.",name:"version",type:"boolean"}];function S(e,n){return e.filter(t=>!n.some(r=>t.includes(r)))}function T(e){if(typeof e=="string"){if(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&/=]*)/.test(e))return e;if(/^[-a-zA-Z0-9()!@:%_+~#?&=]+\/[-a-zA-Z0-9()!@:%_+~#?&=]+$/.test(e))return`https://github.com/${e}`}else return typeof e.url>"u"?"":T(e.url.replace(/(^git\+|\.git$)/,""));return""}async function B(e,n){var h,u;let{date:t,isChangelog:r,prefix:s,quiet:a,release:o,repository:i}=n;if(!/^\d+\.\d+\.\d+$/.test(o))return e;let c=(u=(h=/\d+\.\d+\.\d+/.exec(o))==null?void 0:h[0])!=null?u:o;if(r===!1)return e.replace(/@([Ss]ince|[Vv]ersion)(:?\s+)unreleased/g,`@$1$2${c}`);let m=i.includes("bitbucket.org")?"bitbucket":"github",y=`${i}/${m==="bitbucket"?"commits":"releases"}/tag/${s?"v":""}${c}`,g=`## [${s?"v":""}${c}]`+(i!==""?`(${y})`:"")+(t?` - ${t}`:"");if(e.includes(g))return a!==!0&&console.info("changelog is already formatted"),e;let P=`(${i}/${m==="bitbucket"?"branches/":""}compare/HEAD..${s?"v":""}${c})`,x=`## [Unreleased]${i?P:""}

### `+["Added","Changed","Deprecated","Removed","Fixed","Security"].join(`

### `);return e.replace(/## \[Unreleased\](\(.*\))?/,g).replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n\n/g,"").replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n$/g,"").replace(/\n\n$/g,`
`).replace(g,x+`

`+g)}function D(e){return[`Usage
	$ release-bump <options>`,"Options"+e.reduce((n,t)=>{let r=t.alias?(t.name.length<6?"	":"")+`	-${t.alias}`:"		",s=t.alias?`	${t.description}`:(t.name.length<6?"	":"")+t.description;return n+`
	--${t.name}${r}${s}`},""),`Examples
	$ release-bump -pq --files=src`].join(`

`)}async function v(e){let{directoriesToIgnore:n,failOnError:t,filesPath:r,paths:s}=e;if(n.some(i=>r.includes(i)))return s!=null?s:[];let a=[];try{a=await L(r)}catch(i){if(i.code!=="ENOENT"){if(t)throw p.exitCode=1,i;console.warn(`could not read files in ${r}`)}a=[]}let o=(await Promise.all(a.map(async i=>(await z(`${r}/${i}`)).isDirectory()===!0?await v({directoriesToIgnore:n,failOnError:t,filesPath:`${r}/${i}`,paths:s}):Z(`${r}/${i}`)))).flat();return[...s,...o]}async function N(){return p.env.RELEASE_BUMP_VERSION?"v"+p.env.RELEASE_BUMP_VERSION:"no version found"}function _(e,n){return e.reduce((t,r,s)=>{let a={};if(r.indexOf("--")===0){let[o,i]=r.substr(2).split("="),l=n.find(c=>c.name===o);if(l)switch(l.type){case"boolean":a[o]=!0;break;case"string[]":a[o]=i==null?void 0:i.split(",");break;default:a[o]=i;break}}else if(r.indexOf("-")===0)[...r.substr(1)].forEach(o=>{let i=n.find(l=>l.alias===o);i&&(a[i.name]=!0)});else{let o=Object.keys(t),i=o[o.length-1],l=n.find(c=>c.name===i);l&&(t[i]===`$${s-1}`||typeof t[i]>"u")&&(a[i]=l.type==="string[]"?r.split(","):r)}return f(f({},t),a)},{})}function q(e){var a;let n={repository:"",version:"0.0.0"};try{n=JSON.parse(j("package.json","utf8"))}catch(o){p.env.NODE_ENV!=="test"&&e.quiet!==!0&&console.warn("could not read package.json")}let t=[".git",".github","coverage","dist","node_modules","tests/fixtures"],r={changelogPath:"CHANGELOG.md",date:(a=new Date().toISOString().split("T"))==null?void 0:a[0],dryRun:!1,failOnError:!1,filesPath:".",ignore:t,prefix:!1,quiet:p.env.NODE_ENV==="test"||!1,release:n.version,repository:T(n.repository)};return f(f({},r),e)}import{readFile as G,writeFile as H}from"fs/promises";async function U(e){let{changelogPath:n,date:t,dryRun:r,failOnError:s,filesPath:a,ignore:o,prefix:i,quiet:l,release:c,repository:m}=q(e),y=p.env.NODE_ENV==="test"||r===!0,g=o,x=await v({directoriesToIgnore:g,failOnError:s,filesPath:a,paths:[n]}),h=S(x,g),u=[];return await Promise.all(h.map(async d=>{let $="";try{$=await G(d,"utf8")}catch(O){if(s)throw p.exitCode=1,O;l!==!0&&console.warn(`could not read ${d}`)}let w=await B($,{date:t,isChangelog:n===d,prefix:i,quiet:l,release:c,repository:m});if($!==w&&(u.push(d),y!==!0))try{await H(d,w,"utf8")}catch(O){if(s)throw p.exitCode=1,O;l!==!0&&console.warn(`could not write ${d}`)}})),u.length>0&&l!==!0&&console.info((y?"would have ":"")+`bumped ${u.join(", ")}`),r?[]:u}(async function(){var s,a;let e=(a=(s=p.argv)==null?void 0:s.slice(2))!=null?a:[],o=_(e,R),{help:n,version:t}=o,r=k(o,["help","version"]);if(n===!0)return console.info(D(R));if(t===!0)return console.info(await N());await U(r)})();
