#!/usr/bin/env node
var I = Object.defineProperty
var b = Object.getOwnPropertySymbols
var k = Object.prototype.hasOwnProperty,
	E = Object.prototype.propertyIsEnumerable
var P = (r, e, t) =>
		e in r
			? I(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t })
			: (r[e] = t),
	d = (r, e) => {
		for (var t in e || (e = {})) k.call(e, t) && P(r, t, e[t])
		if (b) for (var t of b(e)) E.call(e, t) && P(r, t, e[t])
		return r
	}
var C = (r, e) => {
	var t = {}
	for (var o in r) k.call(r, o) && e.indexOf(o) < 0 && (t[o] = r[o])
	if (r != null && b)
		for (var o of b(r)) e.indexOf(o) < 0 && E.call(r, o) && (t[o] = r[o])
	return t
}
var B = (r, e, t) => {
	if (!e.has(r)) throw TypeError('Cannot ' + t)
}
var v = (r, e, t) => (
		B(r, e, 'read from private field'), t ? t.call(r) : e.get(r)
	),
	D = (r, e, t) => {
		if (e.has(r))
			throw TypeError('Cannot add the same private member more than once')
		e instanceof WeakSet ? e.add(r) : e.set(r, t)
	},
	A = (r, e, t, o) => (
		B(r, e, 'write to private field'), o ? o.call(r, t) : e.set(r, t), t
	)
var z = { RELEASE_BUMP_VERSION: '3.0.0-alpha.17' },
	c = { env: z }
var $ = require('fs/promises'),
	T = require('path'),
	x = [
		{
			argument: 'changelogPath',
			description: 'Path to changelog.',
			type: 'string',
		},
		{ argument: 'date', description: 'Release date.', type: 'string' },
		{
			argument: 'dryRun',
			alias: 'd',
			description: 'Dry run.',
			type: 'boolean',
		},
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
function U(r, e) {
	return r.filter((t) => !e.some((o) => t.includes(o)))
}
function F(r, e) {
	var p, h
	let { date: t, prefix: o, release: i, repository: n } = e,
		s = n.includes('bitbucket.org') ? 'bitbucket' : 'github',
		a =
			(h = (p = /\d+\.\d+\.\d+/.exec(i)) == null ? void 0 : p[0]) != null
				? h
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
function _(r, e) {
	var i, n
	let { release: t } = e,
		o =
			(n = (i = /\d+\.\d+\.\d+/.exec(t)) == null ? void 0 : i[0]) != null
				? n
				: t
	return r.replace(/@([Ss]ince|[Vv]ersion)(:?\s+)unreleased/g, `@$1$2${o}`)
}
function q(r, e = {}) {
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
async function O(r, e = []) {
	return (
		(await (0, $.readdir)(r)).forEach(async (t) => {
			;(await (0, $.stat)(r + '/' + t)).isDirectory()
				? (e = await O(`${r}/${t}`, e))
				: typeof e < 'u' && e.push((0, T.join)(r, '/', t))
		}),
		e
	)
}
function N() {
	return (
		`
Usage
	$ release-bump <options>

Options` +
		x.reduce((r, e) => {
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
async function L() {
	return c.env.RELEASE_BUMP_VERSION
		? 'v' + c.env.RELEASE_BUMP_VERSION
		: 'no version found'
}
function V(r) {
	return r.reduce((e, t, o) => {
		let i = {}
		if (t.indexOf('--') === 0) {
			let [n, s] = t.substr(2).split('='),
				a = x.find((u) => u.argument === n)
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
				let s = x.find((a) => a.alias === n)
				s && (i[s.argument] = !0)
			})
		else {
			let n = Object.keys(e),
				s = n[n.length - 1],
				a = x.find((u) => u.argument === s)
			a &&
				(e[s] === `$${o - 1}` || typeof e[s] > 'u') &&
				(i[s] = a.type === 'string[]' ? t.split(',') : t)
		}
		return d(d({}, e), i)
	}, {})
}
var j = require('fs'),
	y = require('fs/promises'),
	m,
	w = class {
		constructor(e) {
			D(this, m, void 0)
			var i
			let t = { repository: '', version: '0.0.0' }
			try {
				t = JSON.parse((0, j.readFileSync)('package.json', 'utf8'))
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
				repository: q(t.repository),
			}
			A(this, m, d(d({}, o), e))
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
				} = v(this, m),
				l = e,
				f = ''
			try {
				f = await (0, y.readFile)(l, 'utf8')
			} catch (p) {
				if (i) throw ((c.exitCode = 1), p)
				console.warn(`could not read ${l}`)
			}
			let g = F(f, { date: t, prefix: n, release: a, repository: u })
			if (o !== !0)
				try {
					await (0, y.writeFile)(l, g, 'utf8')
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
				} = v(this, m),
				a = await O(o),
				l = U(a, i),
				f = []
			if (l.length < 1) {
				n !== !0 && console.info('no files to bump')
				return
			}
			await Promise.all(
				l.map(async (g) => {
					let p = ''
					try {
						p = await (0, y.readFile)(g, 'utf8')
					} catch (R) {
						if (t) throw ((c.exitCode = 1), R)
						console.warn(`could not read ${g}`)
					}
					let h = _(p, { release: s })
					if (p !== h && (f.push(g), e !== !0))
						try {
							await (0, y.writeFile)(g, h, 'utf8')
						} catch (R) {
							if (t) throw ((c.exitCode = 1), R)
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
	let n = V(c.argv.slice(2)),
		{ help: r, version: e } = n,
		t = C(n, ['help', 'version'])
	if (r === !0) return console.info(N())
	if (e === !0) return console.info(await L())
	let o = d({}, t)
	await new w(o).init()
})()
