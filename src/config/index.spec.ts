import { appConfig, AWSConfig, AWSDynamoConfig, AWSS3Config, AWSSqsConfig, envProdName, loggerConf, momentConfig } from './index'

describe('config', () => {
  test('AWSConfig', () => {
    expect(AWSConfig).toHaveProperty('accessKeyId')
    expect(AWSConfig).toHaveProperty('secretAccessKey')
    expect(AWSConfig).toHaveProperty('region')
    expect(AWSConfig).toHaveProperty('profile')
  })
  test('AWSDynamoConfig', () => {
    expect(AWSDynamoConfig).toHaveProperty('region')
    expect(AWSDynamoConfig).toHaveProperty('apiVersion', '2012-08-10')
    expect(AWSDynamoConfig).toHaveProperty('endpoint')
  })
  test('AWSS3Config', () => {
    expect(AWSS3Config).toHaveProperty('region')
    expect(AWSS3Config).toHaveProperty('apiVersion', '2006-03-01')
  })
  test('AWSSqsConfig', () => {
    expect(AWSSqsConfig).toHaveProperty('region')
    expect(AWSSqsConfig).toHaveProperty('apiVersion', '2012-11-05')
  })
  test('momentConfig', () => {
    expect(momentConfig).toHaveProperty('timezone', 'America/Sao_Paulo')
  })
  test('envProdName', () => {
    expect(envProdName).toBe('production')
  })
  test('appConfig', () => {
    expect(appConfig).toHaveProperty('appName', 'balance-operations')
    expect(appConfig).toHaveProperty('isProduction', false)
    expect(appConfig.isProduction).not.toBeUndefined()
    expect(appConfig.isProduction).not.toBeNull()
    expect(appConfig).toHaveProperty('envName', 'test')
    expect(appConfig).toHaveProperty('transaction')
    expect(appConfig.transaction).toHaveProperty('tableName', 'transactions')
    expect(appConfig.transaction).toHaveProperty('queueUrl', 'transaction')
  })
  test('loggerConf', () => {
    expect(loggerConf).toBeDefined()
  })
})
