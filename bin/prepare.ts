export {}

const isCi = process.env.CI !== undefined
if (!isCi) {
	(await import('husky')).install('bin/husky')
}