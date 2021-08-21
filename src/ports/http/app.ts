import { adapter } from '@adapters'
import { appConfig, AWSDynamoConfig } from '@config'
import { Todo, Transaction, Wallet } from '@models'
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
const databaseRepoInstance = databaseRepository<Todo>(dynamo, appConfig.todo.tableName)
const wallets = databaseRepository<Wallet>(dynamo, appConfig.Wallet.tableName)
const transactions = databaseRepository<Transaction>(dynamo, appConfig.Transaction.tableName)
const adapterInstance = adapter(logger, databaseRepoInstance, transactions, wallets)

app.use(expressJson({ limit: '50mb' }))
app.use(expressUrlEncoded({ extended: false }))

// Routes
const routes = getRoutes(logger, adapterInstance)
app.use('/api/v1', routes.index)
app.use('/api/v1/todos', routes.todo)

export default app
