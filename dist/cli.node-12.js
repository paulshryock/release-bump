#!/usr/bin/env node
var V = Object.defineProperty
var h = Object.getOwnPropertySymbols
var w = Object.prototype.hasOwnProperty,
	P = Object.prototype.propertyIsEnumerable
var O = (r, e, t) =>
		e in r
			? V(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t })
			: (r[e] = t),
	d = (r, e) => {
		for (var t in e || (e = {})) w.call(e, t) && O(r, t, e[t])
		if (h) for (var t of h(e)) P.call(e, t) && O(r, t, e[t])
		return r
	}
var k = (r, e) => {
	var t = {}
	for (var o in r) w.call(r, o) && e.indexOf(o) < 0 && (t[o] = r[o])
	if (r != null && h)
		for (var o of h(r)) e.indexOf(o) < 0 && P.call(r, o) && (t[o] = r[o])
	return t
}
var E = (r, e, t) => {
	if (!e.has(r)) throw TypeError('Cannot ' + t)
}
var $ = (r, e, t) => (
		E(r, e, 'read from private field'), t ? t.call(r) : e.get(r)
	),
	C = (r, e, t) => {
		if (e.has(r))
			throw TypeError('Cannot add the same private member more than once')
		e instanceof WeakSet ? e.add(r) : e.set(r, t)
	},
	B = (r, e, t, o) => (
		E(r, e, 'write to private field'), o ? o.call(r, t) : e.set(r, t), t
	)
var j = { RELEASE_BUMP_VERSION: '3.0.0-alpha.17' },
	c = { env: j }
import { readdir as I, stat as z } from 'fs/promises'
import { join as Z } from 'path'
var b = [
	{
		argument: 'changelogPath',
		description: 'Path to changelog.',
		type: 'string',
	},
	{ argument: 'date', description: 'Release date.', type: 'string' },
	{ argument: 'dryRun', alias: 'd', description: 'Dry run.', type: 'boolean' },
	{
		argument: 'failOnError',
		alias: 'e',
		description: 'Fail on error.',
		type: 'boolean',
	},
	{
		argument: 'filesPath',
		description: 'Path to directory of files to bump.',
		type: 'string',
	},
	{
		argument: 'ignore',
		description: 'Directories to ignore.',
		type: 'string[]',
	},
	{
		argument: 'help',
		alias: 'h',
		description: 'Log CLI usage text.',
		type: 'boolean',
	},
	{
		argument: 'prefix',
		alias: 'p',
		description: "Prefix release version with a 'v'.",
		type: 'boolean',
	},
	{
		argument: 'quiet',
		alias: 'q',
		description: 'Quiet, no logs.',
		type: 'boolean',
	},
	{ argument: 'release', description: 'Release version.', type: 'string' },
	{
		argument: 'repository',
		description: 'Remote git repository URL.',
		type: 'string',
	},
	{
		argument: 'version',
		alias: 'v',
		description: 'Log Release Bump version.',
		type: 'boolean',
	},
]
function A(r, e) {
	return r.filter((t) => !e.some((o) => t.includes(o)))
}
function S(r, e) {
	var p, y
	let { date: t, prefix: o, release: i, repository: n } = e,
		s = n.includes('bitbucket.org') ? 'bitbucket' : 'github',
		a =
			(y = (p = /\d+\.\d+\.\d+/.exec(i)) == null ? void 0 : p[0]) != null
				? y
				: i,
		u = `${n}/${s === 'bitbucket' ? 'commits' : 'releases'}/tag/${
			o ? 'v' : ''
		}${a}`,
		l =
			`## [${o ? 'v' : ''}${a}]` +
			(n !== '' ? `(${u})` : '') +
			(t ? ` - ${t}` : ''),
		f = `(${n}/${s === 'bitbucket' ? 'branches/' : ''}compare/HEAD..${
			o ? 'v' : ''
		}${a})`,
		g =
			`## [Unreleased]${n ? f : ''}

### ` +
			['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security'].join(`

### `)
	return r
		.replace(/## \[Unreleased\](\(.*\))?/, l)
		.replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n\n/g, '')
		.replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n$/g, '')
		.replace(
			/\n\n$/g,
			`
`,
		)
		.replace(
			l,
			g +
				`

` +
				l,
		)
}
function T(r, e) {
	var i, n
	let { release: t } = e,
		o =
			(n = (i = /\d+\.\d+\.\d+/.exec(t)) == null ? void 0 : i[0]) != null
				? n
				: t
	return r.replace(/@([Ss]ince|[Vv]ersion)(:?\s+)unreleased/g, `@$1$2${o}`)
}
function U(r, e = {}) {
	return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&/=]*)/.test(
		r,
	)
		? r
		: /^[-a-zA-Z0-9()!@:%_+~#?&=]+\/[-a-zA-Z0-9()!@:%_+~#?&=]+$/.test(r)
		? `https://${
				e.remote === 'bitbucket' ? 'bitbucket.org' : 'github.com'
		  }/${r}`
		: ''
}
async function R(r, e = []) {
	return (
		(await I(r)).forEach(async (t) => {
			;(await z(r + '/' + t)).isDirectory()
				? (e = await R(`${r}/${t}`, e))
				: typeof e < 'u' && e.push(Z(r, '/', t))
		}),
		e
	)
}
function F() {
	return (
		`
Usage
	$ release-bump <options>

Options` +
		b.reduce((r, e) => {
			let t = e.alias ? (e.argument.length < 6 ? '	' : '') + `	-${e.alias}` : '		',
				o = e.alias
					? `	${e.description}`
					: (e.argument.length < 6 ? '	' : '') + e.description
			return (
				r +
				`
	--${e.argument}${t}${o}`
			)
		}, '') +
		`
Examples
	$ release-bump -pq --files=src
`
	)
}
async function _() {
	return c.env.RELEASE_BUMP_VERSION
		? 'v' + c.env.RELEASE_BUMP_VERSION
		: 'no version found'
}
function q(r) {
	return r.reduce((e, t, o) => {
		let i = {}
		if (t.indexOf('--') === 0) {
			let [n, s] = t.substr(2).split('='),
				a = b.find((u) => u.argument === n)
			if (a)
				switch (a.type) {
					case 'boolean':
						i[n] = !0
						break
					case 'string[]':
						i[n] = s == null ? void 0 : s.split(',')
						break
					default:
						i[n] = s
						break
				}
		} else if (t.indexOf('-') === 0)
			[...t.substr(1)].forEach((n) => {
				let s = b.find((a) => a.alias === n)
				s && (i[s.argument] = !0)
			})
		else {
			let n = Object.keys(e),
				s = n[n.length - 1],
				a = b.find((u) => u.argument === s)
			a &&
				(e[s] === `$${o - 1}` || typeof e[s] > 'u') &&
				(i[s] = a.type === 'string[]' ? t.split(',') : t)
		}
		return d(d({}, e), i)
	}, {})
}
import { readFileSync as G } from 'fs'
import { readFile as N, writeFile as L } from 'fs/promises'
var m,
	v = class {
		constructor(e) {
			C(this, m, void 0)
			var i
			let t = { repository: '', version: '0.0.0' }
			try {
				t = JSON.parse(G('package.json', 'utf8'))
			} catch (n) {
				c.env.NODE_ENV !== 'test' &&
					e.quiet !== !0 &&
					console.warn('could not read package.json')
			}
			let o = {
				changelogPath: 'CHANGELOG.md',
				date: (i = new Date().toISOString().split('T')) == null ? void 0 : i[0],
				dryRun: !1,
				failOnError: !1,
				filesPath: '.',
				ignore: ['node_modules', 'tests/fixtures'],
				prefix: !1,
				quiet: c.env.NODE_ENV === 'test' || !1,
				release: t.version,
				repository: U(t.repository),
			}
			B(this, m, d(d({}, o), e))
		}
		async bumpChangelog() {
			let {
					changelogPath: e,
					date: t,
					dryRun: o,
					failOnError: i,
					prefix: n,
					quiet: s,
					release: a,
					repository: u,
				} = $(this, m),
				l = e,
				f = ''
			try {
				f = await N(l, 'utf8')
			} catch (p) {
				if (i) throw ((c.exitCode = 1), p)
				console.warn(`could not read ${l}`)
			}
			let g = S(f, { date: t, prefix: n, release: a, repository: u })
			if (o !== !0)
				try {
					await L(l, g, 'utf8')
				} catch (p) {
					if (i) throw ((c.exitCode = 1), p)
					console.warn(`could not write ${l}`)
				}
			s !== !0 && console.info((o ? 'would have ' : '') + `bumped ${l}`)
		}
		async bumpDocblock() {
			let {
					dryRun: e,
					failOnError: t,
					filesPath: o,
					ignore: i,
					quiet: n,
					release: s,
				} = $(this, m),
				a = await R(o),
				l = A(a, i),
				f = []
			if (l.length < 1) {
				n !== !0 && console.info('no files to bump')
				return
			}
			await Promise.all(
				l.map(async (g) => {
					let p = ''
					try {
						p = await N(g, 'utf8')
					} catch (x) {
						if (t) throw ((c.exitCode = 1), x)
						console.warn(`could not read ${g}`)
					}
					let y = T(p, { release: s })
					if (p !== y && (f.push(g), e !== !0))
						try {
							await L(g, y, 'utf8')
						} catch (x) {
							if (t) throw ((c.exitCode = 1), x)
							console.warn(`could not write ${g}`)
						}
				}),
			),
				f.length > 0 &&
					n !== !0 &&
					console.info((e ? 'would have ' : '') + `bumped ${f.join(', ')}`)
		}
		async init() {
			await Promise.all([this.bumpChangelog(), this.bumpDocblock()])
		}
	}
m = new WeakMap()
;(async function () {
	let n = q(c.argv.slice(2)),
		{ help: r, version: e } = n,
		t = k(n, ['help', 'version'])
	if (r === !0) return console.info(F())
	if (e === !0) return console.info(await _())
	let o = d({}, t)
	await new v(o).init()
})()
