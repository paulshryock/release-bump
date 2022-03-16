var B = Object.defineProperty
var $ = Object.getOwnPropertySymbols
var T = Object.prototype.hasOwnProperty,
	U = Object.prototype.propertyIsEnumerable
var R = (r, e, t) =>
		e in r
			? B(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t })
			: (r[e] = t),
	y = (r, e) => {
		for (var t in e || (e = {})) T.call(e, t) && R(r, t, e[t])
		if ($) for (var t of $(e)) U.call(e, t) && R(r, t, e[t])
		return r
	}
var v = (r, e, t) => {
	if (!e.has(r)) throw TypeError('Cannot ' + t)
}
var b = (r, e, t) => (
		v(r, e, 'read from private field'), t ? t.call(r) : e.get(r)
	),
	O = (r, e, t) => {
		if (e.has(r))
			throw TypeError('Cannot add the same private member more than once')
		e instanceof WeakSet ? e.add(r) : e.set(r, t)
	},
	w = (r, e, t, o) => (
		v(r, e, 'write to private field'), o ? o.call(r, t) : e.set(r, t), t
	)
var F = { RELEASE_BUMP_VERSION: '3.0.0-alpha.17' },
	p = { env: F }
import { readdir as _, stat as q } from 'fs/promises'
import { join as N } from 'path'
function k(r, e) {
	return r.filter((t) => !e.some((o) => t.includes(o)))
}
function E(r, e) {
	var a, f
	let { date: t, prefix: o, release: i, repository: n } = e,
		u = n.includes('bitbucket.org') ? 'bitbucket' : 'github',
		g =
			(f = (a = /\d+\.\d+\.\d+/.exec(i)) == null ? void 0 : a[0]) != null
				? f
				: i,
		m = `${n}/${u === 'bitbucket' ? 'commits' : 'releases'}/tag/${
			o ? 'v' : ''
		}${g}`,
		s =
			`## [${o ? 'v' : ''}${g}]` +
			(n !== '' ? `(${m})` : '') +
			(t ? ` - ${t}` : ''),
		c = `(${n}/${u === 'bitbucket' ? 'branches/' : ''}compare/HEAD..${
			o ? 'v' : ''
		}${g})`,
		l =
			`## [Unreleased]${n ? c : ''}

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
function C(r, e) {
	var i, n
	let { release: t } = e,
		o =
			(n = (i = /\d+\.\d+\.\d+/.exec(t)) == null ? void 0 : i[0]) != null
				? n
				: t
	return r.replace(/@([Ss]ince|[Vv]ersion)(:?\s+)unreleased/g, `@$1$2${o}`)
}
function D(r, e = {}) {
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
async function x(r, e = []) {
	return (
		(await _(r)).forEach(async (t) => {
			;(await q(r + '/' + t)).isDirectory()
				? (e = await x(`${r}/${t}`, e))
				: typeof e < 'u' && e.push(N(r, '/', t))
		}),
		e
	)
}
import { readFileSync as L } from 'fs'
import { readFile as A, writeFile as S } from 'fs/promises'
var d,
	j = class {
		constructor(e) {
			O(this, d, void 0)
			var i
			let t = { repository: '', version: '0.0.0' }
			try {
				t = JSON.parse(L('package.json', 'utf8'))
			} catch (n) {
				p.env.NODE_ENV !== 'test' &&
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
				quiet: p.env.NODE_ENV === 'test' || !1,
				release: t.version,
				repository: D(t.repository),
			}
			w(this, d, y(y({}, o), e))
		}
		async bumpChangelog() {
			let {
					changelogPath: e,
					date: t,
					dryRun: o,
					failOnError: i,
					prefix: n,
					quiet: u,
					release: g,
					repository: m,
				} = b(this, d),
				s = e,
				c = ''
			try {
				c = await A(s, 'utf8')
			} catch (a) {
				if (i) throw ((p.exitCode = 1), a)
				console.warn(`could not read ${s}`)
			}
			let l = E(c, { date: t, prefix: n, release: g, repository: m })
			if (o !== !0)
				try {
					await S(s, l, 'utf8')
				} catch (a) {
					if (i) throw ((p.exitCode = 1), a)
					console.warn(`could not write ${s}`)
				}
			u !== !0 && console.info((o ? 'would have ' : '') + `bumped ${s}`)
		}
		async bumpDocblock() {
			let {
					dryRun: e,
					failOnError: t,
					filesPath: o,
					ignore: i,
					quiet: n,
					release: u,
				} = b(this, d),
				g = await x(o),
				s = k(g, i),
				c = []
			if (s.length < 1) {
				n !== !0 && console.info('no files to bump')
				return
			}
			await Promise.all(
				s.map(async (l) => {
					let a = ''
					try {
						a = await A(l, 'utf8')
					} catch (h) {
						if (t) throw ((p.exitCode = 1), h)
						console.warn(`could not read ${l}`)
					}
					let f = C(a, { release: u })
					if (a !== f && (c.push(l), e !== !0))
						try {
							await S(l, f, 'utf8')
						} catch (h) {
							if (t) throw ((p.exitCode = 1), h)
							console.warn(`could not write ${l}`)
						}
				}),
			),
				c.length > 0 &&
					n !== !0 &&
					console.info((e ? 'would have ' : '') + `bumped ${c.join(', ')}`)
		}
		async init() {
			await Promise.all([this.bumpChangelog(), this.bumpDocblock()])
		}
	}
d = new WeakMap()
export { j as ReleaseBump }
