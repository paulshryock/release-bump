var F = Object.defineProperty
var x = Object.getOwnPropertySymbols
var C = Object.prototype.hasOwnProperty,
	S = Object.prototype.propertyIsEnumerable
var O = (t, e, n) =>
		e in t
			? F(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n })
			: (t[e] = n),
	y = (t, e) => {
		for (var n in e || (e = {})) C.call(e, n) && O(t, n, e[n])
		if (x) for (var n of x(e)) S.call(e, n) && O(t, n, e[n])
		return t
	}
var D = { RELEASE_BUMP_VERSION: '3.0.0-alpha.21' },
	g = { env: D }
import { readFileSync as B } from 'fs'
import { readdir as A, stat as T } from 'fs/promises'
import { join as _ } from 'path'
function R(t, e) {
	return t.filter((n) => !e.some((r) => n.includes(r)))
}
function w(t, e) {
	var c, u
	let { date: n, prefix: r, release: o, repository: i } = e,
		d = i.includes('bitbucket.org') ? 'bitbucket' : 'github',
		p =
			(u = (c = /\d+\.\d+\.\d+/.exec(o)) == null ? void 0 : c[0]) != null
				? u
				: o,
		f = `${i}/${d === 'bitbucket' ? 'commits' : 'releases'}/tag/${
			r ? 'v' : ''
		}${p}`,
		s =
			`## [${r ? 'v' : ''}${p}]` +
			(i !== '' ? `(${f})` : '') +
			(n ? ` - ${n}` : ''),
		a = `(${i}/${d === 'bitbucket' ? 'branches/' : ''}compare/HEAD..${
			r ? 'v' : ''
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
function v(t, e) {
	var o, i
	let { release: n } = e,
		r =
			(i = (o = /\d+\.\d+\.\d+/.exec(n)) == null ? void 0 : o[0]) != null
				? i
				: n
	return t.replace(/@([Ss]ince|[Vv]ersion)(:?\s+)unreleased/g, `@$1$2${r}`)
}
function q(t, e = 'github') {
	return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&/=]*)/.test(
		t,
	)
		? t
		: /^[-a-zA-Z0-9()!@:%_+~#?&=]+\/[-a-zA-Z0-9()!@:%_+~#?&=]+$/.test(t)
		? `https://${e === 'bitbucket' ? 'bitbucket.org' : 'github.com'}/${t}`
		: ''
}
async function h(t, e = []) {
	return (
		(await A(t)).forEach(async (n) => {
			;(await T(t + '/' + n)).isDirectory()
				? (e = await h(`${t}/${n}`, e))
				: typeof e < 'u' && e.push(_(t, '/', n))
		}),
		e
	)
}
function k(t) {
	var o
	let e = { repository: '', version: '0.0.0' }
	try {
		e = JSON.parse(B('package.json', 'utf8'))
	} catch (i) {
		g.env.NODE_ENV !== 'test' &&
			t.quiet !== !0 &&
			console.warn('could not read package.json')
	}
	let n = {
		changelogPath: 'CHANGELOG.md',
		date: (o = new Date().toISOString().split('T')) == null ? void 0 : o[0],
		dryRun: !1,
		failOnError: !1,
		filesPath: '.',
		ignore: ['node_modules', 'tests/fixtures'],
		prefix: !1,
		quiet: g.env.NODE_ENV === 'test' || !1,
		release: e.version,
		repository: q(e.repository),
	}
	return y(y({}, n), t)
}
import { readFile as P, writeFile as E } from 'fs/promises'
async function U(t) {
	let {
			changelogPath: e,
			date: n,
			dryRun: r,
			failOnError: o,
			prefix: i,
			quiet: d,
			release: p,
			repository: f,
		} = t,
		s = e,
		a = ''
	try {
		a = await P(s, 'utf8')
	} catch (u) {
		if (o) throw ((g.exitCode = 1), u)
		console.warn(`could not read ${s}`)
	}
	let c = w(a, { date: n, prefix: i, release: p, repository: f })
	if (r !== !0)
		try {
			await E(s, c, 'utf8')
		} catch (u) {
			if (o) throw ((g.exitCode = 1), u)
			console.warn(`could not write ${s}`)
		}
	return (
		d !== !0 && console.info((r ? 'would have ' : '') + `bumped ${s}`),
		r ? '' : s
	)
}
async function N(t) {
	let {
			dryRun: e,
			failOnError: n,
			filesPath: r,
			ignore: o,
			quiet: i,
			release: d,
		} = t,
		p = await h(r),
		s = R(p, o),
		a = []
	return s.length < 1
		? (i !== !0 && console.info('no files to bump'), [])
		: (await Promise.all(
				s.map(async (l) => {
					let c = ''
					try {
						c = await P(l, 'utf8')
					} catch (m) {
						if (n) throw ((g.exitCode = 1), m)
						console.warn(`could not read ${l}`)
					}
					let b = v(c, { release: d })
					if (c !== b && (a.push(l), e !== !0))
						try {
							await E(l, b, 'utf8')
						} catch (m) {
							if (n) throw ((g.exitCode = 1), m)
							console.warn(`could not write ${l}`)
						}
				}),
		  ),
		  a.length > 0 &&
				i !== !0 &&
				console.info((e ? 'would have ' : '') + `bumped ${a.join(', ')}`),
		  e ? [] : a)
}
async function K(t) {
	var r, o
	let e = k(t)
	return (o =
		(r = await Promise.all([U(e), N(e)])) == null ? void 0 : r.flat()) != null
		? o
		: []
}
export { K as releaseBump }
