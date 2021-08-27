resource "aws_dynamodb_table" "transaction_data" {
  name           = local.dynamodb_table_name_transaction
  read_capacity  = 5
  write_capacity = 1
  hash_key       = "walletId"
  range_key       = "transactionTime"

  attribute {
    name = "walletId"
    type = "S"
  }

  attribute {
    name = "transactionTime"
    type = "S"
  }
}

resource "aws_sqs_queue" "transactions" {
  name                      = "transactions"
  delay_seconds             = 90
  max_message_size          = 8192
  message_retention_seconds = 3600
  receive_wait_time_seconds = 10
}
