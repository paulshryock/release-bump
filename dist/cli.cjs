#!/usr/bin/env node
var N = Object.defineProperty
var h = Object.getOwnPropertySymbols
var v = Object.prototype.hasOwnProperty,
	k = Object.prototype.propertyIsEnumerable
var w = (t, e, n) =>
		e in t
			? N(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n })
			: (t[e] = n),
	y = (t, e) => {
		for (var n in e || (e = {})) v.call(e, n) && w(t, n, e[n])
		if (h) for (var n of h(e)) k.call(e, n) && w(t, n, e[n])
		return t
	}
var P = (t, e) => {
	var n = {}
	for (var r in t) v.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r])
	if (t != null && h)
		for (var r of h(t)) e.indexOf(r) < 0 && k.call(t, r) && (n[r] = t[r])
	return n
}
var L = { RELEASE_BUMP_VERSION: '3.0.0-alpha.21' },
	c = { env: L }
var C = require('fs'),
	x = require('fs/promises'),
	F = require('path'),
	b = [
		{
			argument: 'changelogPath',
			description: 'Path to changelog.',
			type: 'string',
		},
		{ argument: 'date', description: 'Release date.', type: 'string' },
		{
			alias: 'd',
			argument: 'dryRun',
			description: 'Dry run.',
			type: 'boolean',
		},
		{
			alias: 'e',
			argument: 'failOnError',
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
			alias: 'h',
			argument: 'help',
			description: 'Log CLI usage text.',
			type: 'boolean',
		},
		{
			alias: 'p',
			argument: 'prefix',
			description: "Prefix release version with a 'v'.",
			type: 'boolean',
		},
		{
			alias: 'q',
			argument: 'quiet',
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
			alias: 'v',
			argument: 'version',
			description: 'Log Release Bump version.',
			type: 'boolean',
		},
	]
function S(t, e) {
	return t.filter((n) => !e.some((r) => n.includes(r)))
}
function B(t, e) {
	var f, d
	let { date: n, prefix: r, release: i, repository: o } = e,
		s = o.includes('bitbucket.org') ? 'bitbucket' : 'github',
		a =
			(d = (f = /\d+\.\d+\.\d+/.exec(i)) == null ? void 0 : f[0]) != null
				? d
				: i,
		g = `${o}/${s === 'bitbucket' ? 'commits' : 'releases'}/tag/${
			r ? 'v' : ''
		}${a}`,
		l =
			`## [${r ? 'v' : ''}${a}]` +
			(o !== '' ? `(${g})` : '') +
			(n ? ` - ${n}` : ''),
		p = `(${o}/${s === 'bitbucket' ? 'branches/' : ''}compare/HEAD..${
			r ? 'v' : ''
		}${a})`,
		u =
			`## [Unreleased]${o ? p : ''}

### ` +
			['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security'].join(`

### `)
	return t
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
			u +
				`

` +
				l,
		)
}
function D(t, e) {
	var i, o
	let { release: n } = e,
		r =
			(o = (i = /\d+\.\d+\.\d+/.exec(n)) == null ? void 0 : i[0]) != null
				? o
				: n
	return t.replace(/@([Ss]ince|[Vv]ersion)(:?\s+)unreleased/g, `@$1$2${r}`)
}
function V(t, e = 'github') {
	return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&/=]*)/.test(
		t,
	)
		? t
		: /^[-a-zA-Z0-9()!@:%_+~#?&=]+\/[-a-zA-Z0-9()!@:%_+~#?&=]+$/.test(t)
		? `https://${e === 'bitbucket' ? 'bitbucket.org' : 'github.com'}/${t}`
		: ''
}
function A() {
	return (
		`
Usage
	$ release-bump <options>

Options` +
		b.reduce((t, e) => {
			let n = e.alias ? (e.argument.length < 6 ? '	' : '') + `	-${e.alias}` : '		',
				r = e.alias
					? `	${e.description}`
					: (e.argument.length < 6 ? '	' : '') + e.description
			return (
				t +
				`
	--${e.argument}${n}${r}`
			)
		}, '') +
		`

Examples
	$ release-bump -pq --files=src
`
	)
}
async function $(t, e = []) {
	return (
		(await (0, x.readdir)(t)).forEach(async (n) => {
			;(await (0, x.stat)(t + '/' + n)).isDirectory()
				? (e = await $(`${t}/${n}`, e))
				: typeof e < 'u' && e.push((0, F.join)(t, '/', n))
		}),
		e
	)
}
async function T() {
	return c.env.RELEASE_BUMP_VERSION
		? 'v' + c.env.RELEASE_BUMP_VERSION
		: 'no version found'
}
function _(t) {
	return t.reduce((e, n, r) => {
		let i = {}
		if (n.indexOf('--') === 0) {
			let [o, s] = n.substr(2).split('='),
				a = b.find((g) => g.argument === o)
			if (a)
				switch (a.type) {
					case 'boolean':
						i[o] = !0
						break
					case 'string[]':
						i[o] = s == null ? void 0 : s.split(',')
						break
					default:
						i[o] = s
						break
				}
		} else if (n.indexOf('-') === 0)
			[...n.substr(1)].forEach((o) => {
				let s = b.find((a) => a.alias === o)
				s && (i[s.argument] = !0)
			})
		else {
			let o = Object.keys(e),
				s = o[o.length - 1],
				a = b.find((g) => g.argument === s)
			a &&
				(e[s] === `$${r - 1}` || typeof e[s] > 'u') &&
				(i[s] = a.type === 'string[]' ? n.split(',') : n)
		}
		return y(y({}, e), i)
	}, {})
}
function q(t) {
	var i
	let e = { repository: '', version: '0.0.0' }
	try {
		e = JSON.parse((0, C.readFileSync)('package.json', 'utf8'))
	} catch (o) {
		c.env.NODE_ENV !== 'test' &&
			t.quiet !== !0 &&
			console.warn('could not read package.json')
	}
	let n = {
		changelogPath: 'CHANGELOG.md',
		date: (i = new Date().toISOString().split('T')) == null ? void 0 : i[0],
		dryRun: !1,
		failOnError: !1,
		filesPath: '.',
		ignore: ['node_modules', 'tests/fixtures'],
		prefix: !1,
		quiet: c.env.NODE_ENV === 'test' || !1,
		release: e.version,
		repository: V(e.repository),
	}
	return y(y({}, n), t)
}
var m = require('fs/promises')
async function j(t) {
	let {
			changelogPath: e,
			date: n,
			dryRun: r,
			failOnError: i,
			prefix: o,
			quiet: s,
			release: a,
			repository: g,
		} = t,
		l = e,
		p = ''
	try {
		p = await (0, m.readFile)(l, 'utf8')
	} catch (d) {
		if (i) throw ((c.exitCode = 1), d)
		console.warn(`could not read ${l}`)
	}
	let f = B(p, { date: n, prefix: o, release: a, repository: g })
	if (r !== !0)
		try {
			await (0, m.writeFile)(l, f, 'utf8')
		} catch (d) {
			if (i) throw ((c.exitCode = 1), d)
			console.warn(`could not write ${l}`)
		}
	return (
		s !== !0 && console.info((r ? 'would have ' : '') + `bumped ${l}`),
		r ? '' : l
	)
}
async function I(t) {
	let {
			dryRun: e,
			failOnError: n,
			filesPath: r,
			ignore: i,
			quiet: o,
			release: s,
		} = t,
		a = await $(r),
		l = S(a, i),
		p = []
	return l.length < 1
		? (o !== !0 && console.info('no files to bump'), [])
		: (await Promise.all(
				l.map(async (u) => {
					let f = ''
					try {
						f = await (0, m.readFile)(u, 'utf8')
					} catch (O) {
						if (n) throw ((c.exitCode = 1), O)
						console.warn(`could not read ${u}`)
					}
					let R = D(f, { release: s })
					if (f !== R && (p.push(u), e !== !0))
						try {
							await (0, m.writeFile)(u, R, 'utf8')
						} catch (O) {
							if (n) throw ((c.exitCode = 1), O)
							console.warn(`could not write ${u}`)
						}
				}),
		  ),
		  p.length > 0 &&
				o !== !0 &&
				console.info((e ? 'would have ' : '') + `bumped ${p.join(', ')}`),
		  e ? [] : p)
}
async function U(t) {
	var r, i
	let e = q(t)
	return (i =
		(r = await Promise.all([j(e), I(e)])) == null ? void 0 : r.flat()) != null
		? i
		: []
}
;(async function () {
	var r, i
	let o = _((i = (r = c.argv) == null ? void 0 : r.slice(2)) != null ? i : []),
		{ help: t, version: e } = o,
		n = P(o, ['help', 'version'])
	if (t === !0) return console.info(A())
	if (e === !0) return console.info(await T())
	await U(n)
})()
