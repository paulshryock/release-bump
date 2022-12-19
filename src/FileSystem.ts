export interface FileSystem {
  getFile: (file: string) => Promise<string>
  getFilePaths: () => Promise<string[]>
}

export class FileSystemError extends Error {}
