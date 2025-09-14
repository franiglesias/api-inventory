import dotenv from 'dotenv'

export const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env'

dotenv.config({ path: envFile })

// Sensible default for local development and predictable test port
export const PORT: string =
  (process.env.PORT as string) || (process.env.NODE_ENV == 'test' ? '3333' : '3000')
