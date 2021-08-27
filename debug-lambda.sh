if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  aws lambda invoke /dev/null --endpoint-url=http://localhost:3002 --function-name transaction_tf_handler --payload $(cat mocks/lambda/events/create_transaction.json | base64 -w 0)
elif [[ "$OSTYPE" == "darwin"* ]]; then
  aws lambda invoke /dev/null --endpoint-url=http://localhost:3002 --function-name transaction_tf_handler --payload $(cat mocks/lambda/events/create_transaction.json | base64 -w 0)
else
  echo "༼つಠ益ಠ༽つ ─=≡ΣO)) NOT NOW"
fi
