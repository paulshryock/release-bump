export interface FileSystem {
  listFiles: () => Promise<string[]>
  readFile: (path: string) => Promise<string>
  writeFile: (path: string, data: string) => Promise<void>
}

export class FileSystemError extends Error {}
