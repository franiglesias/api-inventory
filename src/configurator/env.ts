import dotenv from 'dotenv'

export const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env'

dotenv.config({ path: envFile })

// Sensible default for local development and predictable test port, just in case no .env file is present, or it doesn't contain the PORT variable'
export const PORT: string =
  (process.env.PORT as string) || (process.env.NODE_ENV == 'test' ? '3333' : '3000')
