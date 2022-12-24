import { FileSystem } from '../../src/FileSystem/FileSystem'

export class MockFileSystem implements FileSystem {
	static #release = '1.0.0'
	#version = '1.0.0'

	constructor(path: string, pathsToIgnore: string[] = []) {
		this.#noop(path, pathsToIgnore)
	}

  async listFiles(): Promise<string[]> {
  	return []
  }

  async readFile(file: string): Promise<string> {
  	this.#noop(file)

  	return JSON.stringify({ version: this.#version })
  }

  async writeFile(path: string, data: string): Promise<void> {
  	this.#noop(path, data)
  }

  static getRelease(): string {
  	return this.#release
  }

	#noop(...x: any): any {
		return x
	}
}
