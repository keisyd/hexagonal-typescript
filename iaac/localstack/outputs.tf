# this file is for output members

output "aws_sqs_transaction_queue_url" {
  value = aws_sqs_queue.transaction_queue.id
}


output "aws_dynamodb_transaction_id" {
  value = aws_dynamodb_table.transaction_data.id
}


output "aws_lambda_transaction" {
  value = aws_lambda_function.transaction.arn
}
