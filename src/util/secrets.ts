import logger from './logger'
import dotenv from 'dotenv'
import fs from 'fs'

if (fs.existsSync('.env')) {
  logger.info('Using .env file to supply config environment variables')
  dotenv.config({ path: '.env' })
} else {
  logger.info('Using .env.example file to supply config environment variables')
  dotenv.config({ path: '.env.example' })
}
