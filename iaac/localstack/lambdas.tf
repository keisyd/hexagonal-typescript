resource "aws_lambda_function" "transaction" {
  function_name = "transaction_tf_handler"
  handler       = "/var/task/dist/ports/aws-lambda/transaction.handler"
  runtime       = var.runtime
  memory_size   = "128"
  timeout       = 30                                             #for local environment this is larger than 10 seconds

  role      = "arn:aws:iam::123456:role/irrelevant"
  s3_bucket = "__local__"
  s3_key    = "${abspath(path.module)}/../../"

  environment {
    variables = local.environment
  }
}
