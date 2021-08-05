import 'reflect-metadata'
import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import 'express-async-errors'
import { errors } from 'celebrate'
import { pagination } from 'typeorm-pagination'
import cors from 'cors'
import routes from './routes'
import AppError from '../errors/AppError'
import '@shared/typeorm'
import uploadConfig from '@config/upload'
import rateLimiter from './middlewares/rateLimiter'

const app = express()

app.use(cors())
app.use(express.json())
app.use(rateLimiter)
app.use(pagination)
app.use('/files', express.static(uploadConfig.directory))
app.use(routes)
app.use(errors())

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    })
  }

  console.log(error)

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
})

app.listen(3333, () => {
  console.log('Listening on PORT 3333')
})

// docker run --name postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
