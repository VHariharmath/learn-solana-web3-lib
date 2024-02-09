### Everthing in Solana is account

1. The program logic we deploy to the block chain is also treated like account
2. If you trasfer money then it is between 2 accounts
   Like linux where everything is treated as a file, here everything is account

Ex: If you are looking to store a record and your program has the logic to do it. Then you send the
Transaction to the program account. The logic inside the program will do rest of the job.

### Transaction types

1. You can send SOLANA coin from one person to another person
2. You can store record on the solana n/w by sending the transaction to program account

### Transactions work flow

1. Applications send transactions to RPC client
2. RPC client forwards the request to validators
3. Validators execute the transactions invoking programs on the blockchain
4. Programs update account state

### Tokens
