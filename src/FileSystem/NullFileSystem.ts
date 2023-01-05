import { FileSystem } from '../Client'

export class NullFileSystem implements FileSystem {
	constructor(path: string, pathsToIgnore: string[] = []) {
		this.#noop(path, pathsToIgnore)
	}

	async listFiles(): Promise<string[]> {
		return Promise.resolve([])
	}

	async readFile(file: string): Promise<string> {
		this.#noop(file)

		return Promise.resolve(JSON.stringify({ version: '' }))
	}

	async writeFile(path: string, data: string): Promise<void> {
		this.#noop(path, data)

		return Promise.resolve()
	}

	#noop(...x: Array<string | string[]>): Array<string | string[]> {
		return x
	}
}
