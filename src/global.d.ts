declare global {
	class SystemError extends Error {
		address?: string
		code: string
		dest?: string
		errno: number
		info?: object
		message: string
		path?: string
		port?: number
		syscall: string
	}
}
