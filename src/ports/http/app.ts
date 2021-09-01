import { adapter, transactionAdapter } from '@adapters'
import { appConfig, AWSDynamoConfig } from '@config'
import { Transaction } from '@models'
import { databaseRepository } from '@ports/aws-dynamo'
import { handleLogger } from '@ports/logger'
import { config as AWSConfig, DynamoDB } from 'aws-sdk'
import express, { json as expressJson, urlencoded as expressUrlEncoded } from 'express'
import { getRoutes } from './routes'

// setting app
const app = express()
// logger
const logger = handleLogger(appConfig.appName, appConfig.envName)

// AWS Dynamo configuration.
AWSConfig.update(AWSDynamoConfig)
const dynamo = new DynamoDB.DocumentClient()

// inject repositories
const databaseRepoInstance = databaseRepository<Transaction>(dynamo, appConfig.transaction.tableName)

const adapterInstance = adapter(transactionAdapter(logger, databaseRepoInstance))

app.use(expressJson({ limit: '50mb' }))
app.use(expressUrlEncoded({ extended: false }))

// Routes
const routes = getRoutes(logger, adapterInstance)

const version = 'v1'

const startPoint: string = '/api/' + version

app.use(startPoint, routes.index)
app.use(`${startPoint}/credit`, routes.credit)
app.use(`${startPoint}/debit`, routes.debit)
app.use(`${startPoint}/register`, routes.register)
export default app
