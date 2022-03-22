var y = Object.defineProperty
var B = Object.getOwnPropertyDescriptor
var A = Object.getOwnPropertyNames,
	R = Object.getOwnPropertySymbols
var v = Object.prototype.hasOwnProperty,
	T = Object.prototype.propertyIsEnumerable
var w = (t, e, n) =>
		e in t
			? y(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n })
			: (t[e] = n),
	x = (t, e) => {
		for (var n in e || (e = {})) v.call(e, n) && w(t, n, e[n])
		if (R) for (var n of R(e)) T.call(e, n) && w(t, n, e[n])
		return t
	}
var _ = (t) => y(t, '__esModule', { value: !0 })
var q = (t, e) => {
		for (var n in e) y(t, n, { get: e[n], enumerable: !0 })
	},
	U = (t, e, n, o) => {
		if ((e && typeof e == 'object') || typeof e == 'function')
			for (let r of A(e))
				!v.call(t, r) &&
					(n || r !== 'default') &&
					y(t, r, {
						get: () => e[r],
						enumerable: !(o = B(e, r)) || o.enumerable,
					})
		return t
	}
var N = (
	(t) => (e, n) =>
		(t && t.get(e)) || ((n = U(_({}), e, 1)), t && t.set(e, n), n)
)(typeof WeakMap != 'undefined' ? new WeakMap() : 0)
var Z = {}
q(Z, { releaseBump: () => z })
var L = { RELEASE_BUMP_VERSION: '3.0.0-alpha.21' },
	g = { env: L }
var P = require('fs'),
	h = require('fs/promises'),
	E = require('path')
function F(t, e) {
	return t.filter((n) => !e.some((o) => n.includes(o)))
}
function C(t, e) {
	var c, u
	let { date: n, prefix: o, release: r, repository: i } = e,
		d = i.includes('bitbucket.org') ? 'bitbucket' : 'github',
		p =
			(u = (c = /\d+\.\d+\.\d+/.exec(r)) == null ? void 0 : c[0]) != null
				? u
				: r,
		m = `${i}/${d === 'bitbucket' ? 'commits' : 'releases'}/tag/${
			o ? 'v' : ''
		}${p}`,
		s =
			`## [${o ? 'v' : ''}${p}]` +
			(i !== '' ? `(${m})` : '') +
			(n ? ` - ${n}` : ''),
		a = `(${i}/${d === 'bitbucket' ? 'branches/' : ''}compare/HEAD..${
			o ? 'v' : ''
		}${p})`,
		l =
			`## [Unreleased]${i ? a : ''}

### ` +
			['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security'].join(`

### `)
	return t
		.replace(/## \[Unreleased\](\(.*\))?/, s)
		.replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n\n/g, '')
		.replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n$/g, '')
		.replace(
			/\n\n$/g,
			`
`,
		)
		.replace(
			s,
			l +
				`

` +
				s,
		)
}
function S(t, e) {
	var r, i
	let { release: n } = e,
		o =
			(i = (r = /\d+\.\d+\.\d+/.exec(n)) == null ? void 0 : r[0]) != null
				? i
				: n
	return t.replace(/@([Ss]ince|[Vv]ersion)(:?\s+)unreleased/g, `@$1$2${o}`)
}
function j(t, e = 'github') {
	return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&/=]*)/.test(
		t,
	)
		? t
		: /^[-a-zA-Z0-9()!@:%_+~#?&=]+\/[-a-zA-Z0-9()!@:%_+~#?&=]+$/.test(t)
		? `https://${e === 'bitbucket' ? 'bitbucket.org' : 'github.com'}/${t}`
		: ''
}
async function O(t, e = []) {
	return (
		(await (0, h.readdir)(t)).forEach(async (n) => {
			;(await (0, h.stat)(t + '/' + n)).isDirectory()
				? (e = await O(`${t}/${n}`, e))
				: typeof e < 'u' && e.push((0, E.join)(t, '/', n))
		}),
		e
	)
}
function D(t) {
	var r
	let e = { repository: '', version: '0.0.0' }
	try {
		e = JSON.parse((0, P.readFileSync)('package.json', 'utf8'))
	} catch (i) {
		g.env.NODE_ENV !== 'test' &&
			t.quiet !== !0 &&
			console.warn('could not read package.json')
	}
	let n = {
		changelogPath: 'CHANGELOG.md',
		date: (r = new Date().toISOString().split('T')) == null ? void 0 : r[0],
		dryRun: !1,
		failOnError: !1,
		filesPath: '.',
		ignore: ['node_modules', 'tests/fixtures'],
		prefix: !1,
		quiet: g.env.NODE_ENV === 'test' || !1,
		release: e.version,
		repository: j(e.repository),
	}
	return x(x({}, n), t)
}
var f = require('fs/promises')
async function I(t) {
	let {
			changelogPath: e,
			date: n,
			dryRun: o,
			failOnError: r,
			prefix: i,
			quiet: d,
			release: p,
			repository: m,
		} = t,
		s = e,
		a = ''
	try {
		a = await (0, f.readFile)(s, 'utf8')
	} catch (u) {
		if (r) throw ((g.exitCode = 1), u)
		console.warn(`could not read ${s}`)
	}
	let c = C(a, { date: n, prefix: i, release: p, repository: m })
	if (o !== !0)
		try {
			await (0, f.writeFile)(s, c, 'utf8')
		} catch (u) {
			if (r) throw ((g.exitCode = 1), u)
			console.warn(`could not write ${s}`)
		}
	return (
		d !== !0 && console.info((o ? 'would have ' : '') + `bumped ${s}`),
		o ? '' : s
	)
}
async function V(t) {
	let {
			dryRun: e,
			failOnError: n,
			filesPath: o,
			ignore: r,
			quiet: i,
			release: d,
		} = t,
		p = await O(o),
		s = F(p, r),
		a = []
	return s.length < 1
		? (i !== !0 && console.info('no files to bump'), [])
		: (await Promise.all(
				s.map(async (l) => {
					let c = ''
					try {
						c = await (0, f.readFile)(l, 'utf8')
					} catch (b) {
						if (n) throw ((g.exitCode = 1), b)
						console.warn(`could not read ${l}`)
					}
					let $ = S(c, { release: d })
					if (c !== $ && (a.push(l), e !== !0))
						try {
							await (0, f.writeFile)(l, $, 'utf8')
						} catch (b) {
							if (n) throw ((g.exitCode = 1), b)
							console.warn(`could not write ${l}`)
						}
				}),
		  ),
		  a.length > 0 &&
				i !== !0 &&
				console.info((e ? 'would have ' : '') + `bumped ${a.join(', ')}`),
		  e ? [] : a)
}
async function z(t) {
	var o, r
	let e = D(t)
	return (r =
		(o = await Promise.all([I(e), V(e)])) == null ? void 0 : o.flat()) != null
		? r
		: []
}
module.exports = N(Z)
0 && (module.exports = { releaseBump })
