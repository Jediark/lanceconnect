export const logger = {
  info(message: string, context?: Record<string, any>) {
    console.log(
      JSON.stringify({
        level: 'INFO',
        timestamp: new Date().toISOString(),
        message,
        ...context
      })
    )
  },
  warn(message: string, context?: Record<string, any>) {
    console.warn(
      JSON.stringify({
        level: 'WARN',
        timestamp: new Date().toISOString(),
        message,
        ...context
      })
    )
  },
  error(message: string, error?: unknown, context?: Record<string, any>) {
    const errorDetails = error instanceof Error 
      ? { errorName: error.name, errorMessage: error.message, errorStack: error.stack }
      : { rawError: String(error) }

    console.error(
      JSON.stringify({
        level: 'ERROR',
        timestamp: new Date().toISOString(),
        message,
        ...errorDetails,
        ...context
      })
    )
  }
}
