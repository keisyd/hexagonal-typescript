import { Transaction } from '@models'
import * as utils from '@utils'
import { EClassError, throwCustomError } from '@utils/errors'
import { DynamoDB } from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'
import { remapPrefixVariables } from './aws.dynamo'
import { databaseRepository } from './index'

/**
 * jest invocation for aws-sdk
 */
jest.mock('aws-sdk')
jest.mock('../../utils/errors')

; (throwCustomError as any).mockImplementation((error: Error) => {
  // eslint-disable-next-line functional/no-throw-statement
  throw error
})

const dynamo = new DynamoDB.DocumentClient()
const tableName = 'mockTable'
const repoInstance = databaseRepository<Transaction>(dynamo, 'mockTable')

const dynamoMockObject = {
  get: (Params: any) => jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      Item: {
        id: Params.Key.id,
        description: 'mockResult'
      },
      $response: {
        requestId: uuidv4()
      }
    })
  }),
  put: (Params: any) => jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      Item: Params.Item,
      $response: {
        requestId: uuidv4()
      }
    })
  }),
  update: (Params: any) => jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      Attributes: {
        id: Params.Key.id,
        description: 'mockResult'
      },
      $response: {
        requestId: uuidv4()
      }
    })
  }),
  delete: (Params: any) => jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      Item: {
        id: Params.Key.id,
        description: 'mockResult'
      },
      $response: {
        requestId: uuidv4()
      }
    })
  })
}

describe('getDocument', () => {
  beforeEach(() => {
    (DynamoDB.DocumentClient as any).mockReset()
  })
  const methodPath = 'ports.aws-dynamo.getDocument'
  test('default case', async () => {
    (dynamo.get as any).mockImplementationOnce((Params: any) => dynamoMockObject.get(Params)())
    const newId = uuidv4()

    const result = await repoInstance.getDocument({ id: newId })

    expect(result.value).toMatchObject({
      id: newId,
      description: 'mockResult'
    })
    expect(dynamo.get).toHaveBeenCalled()
    expect(dynamo.get).toHaveBeenCalledWith({ Key: { id: newId }, TableName: tableName })
  })

  test('error', async () => {
    const throwMessage = 'invalid id'
    const spyFn = jest.spyOn(utils, 'throwCustomError')
      ; (dynamo.get as any).mockImplementationOnce(jest.fn().mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error(throwMessage))
    }))
    const newId = uuidv4()
    await expect(repoInstance.getDocument({ id: newId })).rejects.toEqual(new Error(throwMessage))
    // throws correct message
    expect(spyFn).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.INTERNAL)
    expect(dynamo.get).toHaveBeenCalled()
    expect(dynamo.get).toHaveBeenCalledWith({ Key: { id: newId }, TableName: tableName })
  })

  test('null result.Item', async () => {
    (dynamo.get as any).mockImplementationOnce(jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Item: null, $response: { requestId: uuidv4() } })
    }))
    const newId = uuidv4()

    const result = await repoInstance.getDocument({ id: newId })

    expect(result.value).toBe(null)
    expect(dynamo.get).toHaveBeenCalled()
    expect(dynamo.get).toHaveBeenCalledWith({ Key: { id: newId }, TableName: tableName })
  })

  test('undefined result.Item', async () => {
    (dynamo.get as any).mockImplementationOnce(jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Item: undefined, $response: { requestId: uuidv4() } })
    }))
    const newId = uuidv4()

    const result = await repoInstance.getDocument({ id: newId })

    expect(result.value).toBeNull()
    expect(dynamo.get).toHaveBeenCalled()
    expect(dynamo.get).toHaveBeenCalledWith({ Key: { id: newId }, TableName: tableName })
  })
})

describe('putDocument', () => {
  beforeEach(() => {
    (DynamoDB.DocumentClient as any).mockReset()
  })
  const methodPath = 'ports.aws-dynamo.putDocument'
  test('default case', async () => {
    (dynamo.put as any).mockImplementationOnce((Params: any) => dynamoMockObject.put(Params)())
    const newId = uuidv4()

    const result = await repoInstance.putDocument({
      id: newId,
      description: 'mockResult'
    })

    await expect(result.value).toMatchObject({
      id: newId,
      description: 'mockResult'
    })
    expect(dynamo.put).toHaveBeenCalled()
    expect(dynamo.put).toHaveBeenCalledWith({
      Item: {
        id: newId,
        description: 'mockResult'
      },
      TableName: tableName
    })
  })

  test('error', async () => {
    const throwMessage = 'invalid entry'
    const spyFn = jest.spyOn(utils, 'throwCustomError')
      ; (dynamo.put as any).mockImplementationOnce(jest.fn().mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error(throwMessage))
    }))
    const newId = uuidv4()

    await expect(repoInstance.putDocument({
      id: newId,
      description: 'mockResult'
    })).rejects.toEqual(new Error(throwMessage))
    // throws correct message
    expect(spyFn).toHaveBeenCalledWith(new Error(throwMessage), methodPath, EClassError.INTERNAL)
    expect(dynamo.put).toHaveBeenCalled()
    expect(dynamo.put).toHaveBeenCalledWith({
      Item: {
        id: newId,
        description: 'mockResult'
      },
      TableName: tableName
    })
  })
})

describe('remapPrevixVariables', () => {
  test('default case', () => {
    const remmaped = remapPrefixVariables({ a: 'a' })
    expect(remmaped).toMatchObject({ ':a': 'a' })
  })

  test('empty', () => {
    const remmaped = remapPrefixVariables({})
    expect(remmaped).toMatchObject({})
  })
})
