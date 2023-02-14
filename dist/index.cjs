'use strict'
var __create = Object.create
var __defProp = Object.defineProperty
var __getOwnPropDesc = Object.getOwnPropertyDescriptor
var __getOwnPropNames = Object.getOwnPropertyNames,
	__getOwnPropSymbols = Object.getOwnPropertySymbols,
	__getProtoOf = Object.getPrototypeOf,
	__hasOwnProp = Object.prototype.hasOwnProperty,
	__propIsEnum = Object.prototype.propertyIsEnumerable
var __defNormalProp = (obj, key, value) =>
		key in obj
			? __defProp(obj, key, {
					enumerable: !0,
					configurable: !0,
					writable: !0,
					value,
			  })
			: (obj[key] = value),
	__spreadValues = (a, b) => {
		for (var prop in b || (b = {}))
			__hasOwnProp.call(b, prop) && __defNormalProp(a, prop, b[prop])
		if (__getOwnPropSymbols)
			for (var prop of __getOwnPropSymbols(b))
				__propIsEnum.call(b, prop) && __defNormalProp(a, prop, b[prop])
		return a
	}
var __export = (target, all) => {
		for (var name in all)
			__defProp(target, name, { get: all[name], enumerable: !0 })
	},
	__copyProps = (to, from, except, desc) => {
		if ((from && typeof from == 'object') || typeof from == 'function')
			for (let key of __getOwnPropNames(from))
				!__hasOwnProp.call(to, key) &&
					key !== except &&
					__defProp(to, key, {
						get: () => from[key],
						enumerable:
							!(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
					})
		return to
	}
var __toESM = (mod, isNodeMode, target) => (
		(target = mod != null ? __create(__getProtoOf(mod)) : {}),
		__copyProps(
			isNodeMode || !mod || !mod.__esModule
				? __defProp(target, 'default', { value: mod, enumerable: !0 })
				: target,
			mod,
		)
	),
	__toCommonJS = (mod) =>
		__copyProps(__defProp({}, '__esModule', { value: !0 }), mod)
var src_exports = {}
__export(src_exports, { releaseBump: () => releaseBump })
module.exports = __toCommonJS(src_exports)
var define_process_env_default = { RELEASE_BUMP_VERSION: '3.0.0-alpha.69' }
var import_node_console = require('console'),
	import_node_fs = require('fs'),
	import_promises = require('fs/promises'),
	import_node_path = require('path')
function filterFilePaths(filePaths, directoriesToIgnore) {
	return filePaths.filter(
		(file) =>
			!directoriesToIgnore.some((directory) => file.includes(directory)),
	)
}
function flattenArrayOfStrings(items) {
	let flat = []
	return (
		items.forEach((item) => {
			Array.isArray(item)
				? flat.push(...flattenArrayOfStrings(item))
				: flat.push(item)
		}),
		flat
	)
}
function formatRepositoryUrl(repository) {
	if (typeof repository == 'string') {
		if (
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&/=]*)/.test(
				repository,
			)
		)
			return repository
		if (
			/^[-a-zA-Z0-9()!@:%_+~#?&=]+\/[-a-zA-Z0-9()!@:%_+~#?&=]+$/.test(
				repository,
			)
		)
			return `https://github.com/${repository}`
	} else
		return typeof (repository == null ? void 0 : repository.url) > 'u'
			? ''
			: formatRepositoryUrl(repository.url.replace(/(^git\+|\.git$)/, ''))
	return ''
}
async function formatText(unformatted, options) {
	var _a, _b
	let { date, isChangelog, prefix, release, repository } = options
	if (/^\d+\.\d+\.\d+$/.test(release) === !1) return unformatted
	let version =
		(_b = (_a = /\d+\.\d+\.\d+/.exec(release)) == null ? void 0 : _a[0]) != null
			? _b
			: release
	if (isChangelog === !1)
		return unformatted
			.replace(/(\* @?)([Ss]ince)(:?\s+)[Uu]nreleased/g, `$1$2$3${version}`)
			.replace(
				/(\/\*+\n)((.+\n)+?)?(^(( |\t)*\**( |\t)*)?([Tt]heme|[Pp]lugin) [Nn]ame.+\n)((.+\n)+?)(^(( |\t)*\**( |\t)*@?)?([Vv]ersion)(:?\s+)((\d+\.\d+(\.\d+)?)|[Uu]nreleased)\n)((.+\n)+?)(\s*\*+\/)/m,
				`$1$2$4$9$12$15$16${version}
$20$22`,
			)
	let remote = repository.includes('bitbucket.org') ? 'bitbucket' : 'github',
		releaseUrl = `${repository}/${
			remote === 'bitbucket' ? 'commits' : 'releases'
		}/tag/${prefix ? 'v' : ''}${version}`,
		header =
			`## [${prefix ? 'v' : ''}${version}]` +
			(repository !== '' ? `(${releaseUrl})` : '') +
			(date ? ` - ${date}` : '')
	if (unformatted.includes(header)) return unformatted
	let compareUrl = `(${repository}/${
			remote === 'bitbucket' ? 'branches/' : ''
		}compare/HEAD..${prefix ? 'v' : ''}${version})`,
		unreleased =
			`## [Unreleased]${repository ? compareUrl : ''}

### ` +
			['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security'].join(`

### `)
	return unformatted
		.replace(/## \[[Uu]nreleased\](\(.*\))?/, header)
		.replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n\n/g, '')
		.replace(/### (Added|Changed|Deprecated|Removed|Fixed|Security)\n$/g, '')
		.replace(
			/\n\n$/g,
			`
`,
		)
		.replace(
			header,
			unreleased +
				`

` +
				header,
		)
}
async function getConfigFromFile(configPath) {
	var _a, _b
	let config = configPath != null ? configPath : ''
	switch (
		(_a = ['js', 'mjs', 'cjs', 'json'].find(
			(ext) => config.indexOf(`.${ext}`) === config.length - `.${ext}`.length,
		)) != null
			? _a
			: ''
	) {
		case 'js':
		case 'mjs':
		case 'cjs': {
			let imported = await Promise.resolve()
				.then(() => __toESM(require(config)))
				.catch(() => ({}))
			if (typeof imported == 'function') {
				let importedOutput = await imported()
				if (
					typeof importedOutput != 'object' ||
					Object.keys(importedOutput).length < 1
				)
					break
				return importedOutput
			} else if (typeof imported.default == 'function') {
				let importedDefaultOutput = await imported.default()
				if (
					typeof importedDefaultOutput != 'object' ||
					Object.keys(importedDefaultOutput).length < 1
				)
					break
				return importedDefaultOutput
			}
			if (Object.keys(imported).length > 0)
				return (_b = imported.default) != null ? _b : imported
			break
		}
		case 'json':
			try {
				return JSON.parse(await (0, import_promises.readFile)(config, 'utf8'))
			} catch (error) {}
			break
		default:
			break
	}
	return {}
}
async function getRecursiveFilePaths(options) {
	let { directoriesToIgnore, failOnError, filesPath, paths } = options
	if (
		directoriesToIgnore.some((directoryToIgnore) =>
			filesPath.includes(directoryToIgnore),
		)
	)
		return paths != null ? paths : []
	let filesInFilesPath = []
	try {
		filesInFilesPath = await (0, import_promises.readdir)(filesPath)
	} catch (error) {
		if (failOnError) throw ((process.exitCode = 1), error)
		filesInFilesPath = []
	}
	let newPaths = await Promise.all(
		filesInFilesPath.map(async (filePath) =>
			(
				await (0, import_promises.stat)(`${filesPath}/${filePath}`)
			).isDirectory() === !0
				? await getRecursiveFilePaths({
						directoriesToIgnore,
						failOnError,
						filesPath: `${filesPath}/${filePath}`,
						paths,
				  })
				: (0, import_node_path.join)(`${filesPath}/${filePath}`),
		),
	)
	return [...new Set(flattenArrayOfStrings([...paths, ...newPaths]))]
}
function Logger({ quiet }) {
	return quiet === !0
		? new import_node_console.Console({
				stdout: (0, import_node_fs.createWriteStream)('/dev/null'),
				stderr: (0, import_node_fs.createWriteStream)('/dev/null'),
		  })
		: console
}
async function parseSettingsFromOptions(options) {
	var _a, _b
	let pkg,
		quietDefault = define_process_env_default.NODE_ENV === 'test' || !1
	try {
		pkg = JSON.parse(
			await (0, import_promises.readFile)('package.json', 'utf8'),
		)
	} catch (error) {
		pkg = { repository: '', version: '0.0.0' }
	}
	let ignore = [
			'.cache',
			'.git',
			'.github',
			'coverage',
			'dist',
			'node_modules',
			'tests/fixtures',
		],
		defaults = {
			changelogPath: 'CHANGELOG.md',
			configPath: 'release-bump.config.js',
			date: (_a = new Date().toISOString().split('T')) == null ? void 0 : _a[0],
			dryRun: !1,
			failOnError: !1,
			filesPath: '.',
			ignore,
			prefix: !1,
			quiet: quietDefault,
			release: pkg.version,
			repository: formatRepositoryUrl(pkg.repository),
		},
		config = await getConfigFromFile(
			(_b = options == null ? void 0 : options.configPath) != null
				? _b
				: defaults.configPath,
		),
		settings = __spreadValues(
			__spreadValues(__spreadValues({}, defaults), config),
			options,
		)
	return (
		(settings.ignore = [...ignore, ...settings.ignore]),
		settings.ignore.includes(settings.filesPath) &&
			(settings.ignore = settings.ignore.filter(
				(path) => path !== settings.filesPath,
			)),
		settings
	)
}
var import_promises2 = require('fs/promises')
async function releaseBump(options) {
	let {
			changelogPath,
			date,
			dryRun,
			failOnError,
			filesPath,
			ignore,
			prefix,
			quiet,
			release,
			repository,
		} = await parseSettingsFromOptions(options),
		logger = Logger({ quiet }),
		directoriesToIgnore = ignore,
		filePaths = await getRecursiveFilePaths({
			directoriesToIgnore,
			failOnError,
			filesPath,
			paths: [changelogPath],
		}),
		filteredFilePaths = filterFilePaths(filePaths, directoriesToIgnore),
		bumpedFiles = []
	return (
		await Promise.all(
			filteredFilePaths.map(async (filePath) => {
				let unformatted = ''
				try {
					unformatted = await (0, import_promises2.readFile)(filePath, 'utf8')
				} catch (error) {
					if (failOnError) throw ((process.exitCode = 1), error)
					logger.warn(`could not read ${filePath}`)
				}
				let formatted = await formatText(unformatted, {
					date,
					isChangelog: changelogPath === filePath,
					prefix,
					quiet,
					release,
					repository,
				})
				if (unformatted !== formatted && (bumpedFiles.push(filePath), !dryRun))
					try {
						await (0, import_promises2.writeFile)(filePath, formatted, 'utf8')
					} catch (error) {
						if (failOnError) throw ((process.exitCode = 1), error)
						logger.warn(`could not write ${filePath}`, error)
					}
			}),
		),
		bumpedFiles.length > 0 &&
			logger.info(
				(dryRun ? 'would have ' : '') + `bumped ${bumpedFiles.join(', ')}`,
			),
		bumpedFiles
	)
}
0 && (module.exports = { releaseBump })
