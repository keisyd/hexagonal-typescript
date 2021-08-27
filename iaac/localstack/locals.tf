locals {

  dynamodb_table_name_transaction = "transactions"

  localstack_remote_endpoint = "http://localstack_${var.project_name}:4566"

  environment = {
    ###################################
    # GLOBAL AND DEBUG ENVS
    ###################################
    APP_NAME = var.project_name
    ENV_NAME = "development"
    TIMEZONE = "America/Sao_Paulo"

    ###################################
    # AWS SERVICES
    ###################################
    # DYNAMO
    AWS_DYNAMO_REGION          = var.region
    AWS_DYNAMO_APIVERSION      = var.versions["DYNAMODB"]
    AWS_DYNAMO_transaction_TABLE_NAME = local.dynamodb_table_name_transaction

    # SQS
    AWS_SQS_REGION     = var.region
    AWS_SQS_APIVERSION = var.versions["SQS"]


    # SERVICES ENDPOINTS INNER LAMBDA DOCKER
    AWS_DYNAMO_ENDPOINT = local.localstack_remote_endpoint
    AWS_S3_URL          = local.localstack_remote_endpoint
  }
}
