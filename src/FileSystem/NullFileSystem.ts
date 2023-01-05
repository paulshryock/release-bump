import { FileSystem } from '../Client'

export class NullFileSystem implements FileSystem {
	constructor(path: string, pathsToIgnore: string[] = []) {
		this.#noop(path, pathsToIgnore)
	}

  async listFiles(): Promise<string[]> {
  	return []
  }

  async readFile(file: string): Promise<string> {
  	this.#noop(file)

  	return JSON.stringify({ version: '' })
  }

  async writeFile(path: string, data: string): Promise<void> {
  	this.#noop(path, data)
  }

	#noop(...x: any): any {
		return x
	}
}
