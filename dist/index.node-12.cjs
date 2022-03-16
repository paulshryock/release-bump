var h = Object.defineProperty
var q = Object.getOwnPropertyDescriptor
var N = Object.getOwnPropertyNames,
	O = Object.getOwnPropertySymbols
var P = Object.prototype.hasOwnProperty,
	L = Object.prototype.propertyIsEnumerable
var w = (r, e, t) =>
		e in r
			? h(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t })
			: (r[e] = t),
	b = (r, e) => {
		for (var t in e || (e = {})) P.call(e, t) && w(r, t, e[t])
		if (O) for (var t of O(e)) L.call(e, t) && w(r, t, e[t])
		return r
	}
var j = (r) => h(r, '__esModule', { value: !0 })
var I = (r, e) => {
		for (var t in e) h(r, t, { get: e[t], enumerable: !0 })
	},
	V = (r, e, t, o) => {
		if ((e && typeof e == 'object') || typeof e == 'function')
			for (let n of N(e))
				!P.call(r, n) &&
					(t || n !== 'default') &&
					h(r, n, {
						get: () => e[n],
						enumerable: !(o = q(e, n)) || o.enumerable,
					})
		return r
	}
var z = (
	(r) => (e, t) =>
		(r && r.get(e)) || ((t = V(j({}), e, 1)), r && r.set(e, t), t)
)(typeof WeakMap != 'undefined' ? new WeakMap() : 0)
var k = (r, e, t) => {
	if (!e.has(r)) throw TypeError('Cannot ' + t)
}
var R = (r, e, t) => (
		k(r, e, 'read from private field'), t ? t.call(r) : e.get(r)
	),
	E = (r, e, t) => {
		if (e.has(r))
			throw TypeError('Cannot add the same private member more than once')
		e instanceof WeakSet ? e.add(r) : e.set(r, t)
	},
	C = (r, e, t, o) => (
		k(r, e, 'write to private field'), o ? o.call(r, t) : e.set(r, t), t
	)
var G = {}
I(G, { ReleaseBump: () => _ })
var Z = { RELEASE_BUMP_VERSION: '3.0.0-alpha.17' },
	p = { env: Z }
var x = require('fs/promises'),
	A = require('path')
function S(r, e) {
	return r.filter((t) => !e.some((o) => t.includes(o)))
}
function B(r, e) {
	var a, m
	let { date: t, prefix: o, release: n, repository: i } = e,
		u = i.includes('bitbucket.org') ? 'bitbucket' : 'github',
		g =
			(m = (a = /\d+\.\d+\.\d+/.exec(n)) == null ? void 0 : a[0]) != null
				? m
				: n,
		y = `${i}/${u === 'bitbucket' ? 'commits' : 'releases'}/tag/${
			o ? 'v' : ''
		}${g}`,
		s =
			`## [${o ? 'v' : ''}${g}]` +
			(i !== '' ? `(${y})` : '') +
			(t ? ` - ${t}` : ''),
		c = `(${i}/${u === 'bitbucket' ? 'branches/' : ''}compare/HEAD..${
			o ? 'v' : ''
		}${g})`,
		l =
			`## [Unreleased]${i ? c : ''}

### ` +
			['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security'].join(`

### `)
	return r
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
function T(r, e) {
	var n, i
	let { release: t } = e,
		o =
			(i = (n = /\d+\.\d+\.\d+/.exec(t)) == null ? void 0 : n[0]) != null
				? i
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
async function v(r, e = []) {
	return (
		(await (0, x.readdir)(r)).forEach(async (t) => {
			;(await (0, x.stat)(r + '/' + t)).isDirectory()
				? (e = await v(`${r}/${t}`, e))
				: typeof e < 'u' && e.push((0, A.join)(r, '/', t))
		}),
		e
	)
}
var F = require('fs'),
	f = require('fs/promises'),
	d,
	_ = class {
		constructor(e) {
			E(this, d, void 0)
			var n
			let t = { repository: '', version: '0.0.0' }
			try {
				t = JSON.parse((0, F.readFileSync)('package.json', 'utf8'))
			} catch (i) {
				p.env.NODE_ENV !== 'test' &&
					e.quiet !== !0 &&
					console.warn('could not read package.json')
			}
			let o = {
				changelogPath: 'CHANGELOG.md',
				date: (n = new Date().toISOString().split('T')) == null ? void 0 : n[0],
				dryRun: !1,
				failOnError: !1,
				filesPath: '.',
				ignore: ['node_modules', 'tests/fixtures'],
				prefix: !1,
				quiet: p.env.NODE_ENV === 'test' || !1,
				release: t.version,
				repository: U(t.repository),
			}
			C(this, d, b(b({}, o), e))
		}
		async bumpChangelog() {
			let {
					changelogPath: e,
					date: t,
					dryRun: o,
					failOnError: n,
					prefix: i,
					quiet: u,
					release: g,
					repository: y,
				} = R(this, d),
				s = e,
				c = ''
			try {
				c = await (0, f.readFile)(s, 'utf8')
			} catch (a) {
				if (n) throw ((p.exitCode = 1), a)
				console.warn(`could not read ${s}`)
			}
			let l = B(c, { date: t, prefix: i, release: g, repository: y })
			if (o !== !0)
				try {
					await (0, f.writeFile)(s, l, 'utf8')
				} catch (a) {
					if (n) throw ((p.exitCode = 1), a)
					console.warn(`could not write ${s}`)
				}
			u !== !0 && console.info((o ? 'would have ' : '') + `bumped ${s}`)
		}
		async bumpDocblock() {
			let {
					dryRun: e,
					failOnError: t,
					filesPath: o,
					ignore: n,
					quiet: i,
					release: u,
				} = R(this, d),
				g = await v(o),
				s = S(g, n),
				c = []
			if (s.length < 1) {
				i !== !0 && console.info('no files to bump')
				return
			}
			await Promise.all(
				s.map(async (l) => {
					let a = ''
					try {
						a = await (0, f.readFile)(l, 'utf8')
					} catch ($) {
						if (t) throw ((p.exitCode = 1), $)
						console.warn(`could not read ${l}`)
					}
					let m = T(a, { release: u })
					if (a !== m && (c.push(l), e !== !0))
						try {
							await (0, f.writeFile)(l, m, 'utf8')
						} catch ($) {
							if (t) throw ((p.exitCode = 1), $)
							console.warn(`could not write ${l}`)
						}
				}),
			),
				c.length > 0 &&
					i !== !0 &&
					console.info((e ? 'would have ' : '') + `bumped ${c.join(', ')}`)
		}
		async init() {
			await Promise.all([this.bumpChangelog(), this.bumpDocblock()])
		}
	}
d = new WeakMap()
module.exports = z(G)
0 && (module.exports = { ReleaseBump })
