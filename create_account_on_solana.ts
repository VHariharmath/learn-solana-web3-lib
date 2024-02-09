// Snippet to create a account on solana
// 1. Get balance of the payer/admin who is creating an account on solana.
//    Every Tx needs fees to be paid
// 2. update balance if not enough
// 3. Generate credentials/secret for the account.
// 4. Solana charges rent for the account on solana.
//    Check how many lamports we need to create the account
// 5. Lets create a instruction for the account creation
// Mark here that we are preparing the instruction. Account does not get created here
// You can image like you are filling up the cheque for an transaction
// 6. Since we know the block chain is all based block hash, we need to get a block hash for
//    our account as well from the existing blockchain
// 7. Create a message binding creator's address, transaction record with recent block hash
// 8. Sign the transaction with our needed Signers (e.g. `payer` and `keypair`)
//    Its like signing the cheque
// 9 . Send the transaxtion to solana
// 10. Create account is completed
import {
  PublicKey,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  Keypair,
  Transaction,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";
import dotenv from "dotenv";
import { printConsoleSeparator, explorerURL } from "./helpers/env_vars";

// loads .env
dotenv.config();

// 1. Get balance of the payer/admin who is creating an account on solana.
//    Every Tx needs fees to be paid
const payer = await getKeypairFromEnvironment("SECRET_KEY_PAYER");
// const payerAddr = new PublicKey(payer.publicKey);
const connection = new Connection(clusterApiUrl("devnet"));
const balanceInLamports = await connection.getBalance(payer.publicKey);
const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL;
console.log(
  `Account balance of payer ${payer.publicKey} = ${balanceInSol} sol`
);

// 2. update balance if not enough
if (balanceInLamports < LAMPORTS_PER_SOL) {
  const balance = await connection.requestAirdrop(
    payer.publicKey,
    LAMPORTS_PER_SOL
  );
  console.log(
    `Account balance of payer ${payer.publicKey} updated with ${LAMPORTS_PER_SOL} lamports`
  );
}

// 3. Generate credentials/secret for the account.
const newKeypair = Keypair.generate();

// 4. Solana charges rent for the account on solana.
//    Check how many lamports we need to create the account
// We dont need any space of solana. Setting space = 0
const space = 0;
const lamportsValue = await connection.getMinimumBalanceForRentExemption(space);
console.log(`Lamports required to create account = ${lamportsValue}`);

// 5. Lets create a instruction for the account creation
// Mark here that we are preparing the instruction. Account does not get created here
// You can image like you are filling up the cheque for an transaction
const instruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  newAccountPubkey: newKeypair.publicKey,
  lamports: lamportsValue,
  space: space,
  programId: SystemProgram.programId,
});

// 6. Since we know the block chain is all based block hash, we need to get a block hash for
//    our account as well from the existing blockchain

let recentBlockhash = await connection
  .getLatestBlockhash()
  .then((res) => res.blockhash);

// 7. Create a message binding creator's address, transaction record with recent block hash
const message = new TransactionMessage({
  payerKey: payer.publicKey,
  recentBlockhash: recentBlockhash,
  instructions: [instruction],
}).compileToV0Message();

// create a versioned transaction using the message
const tx = new VersionedTransaction(message);

// 8. Sign the transaction with our needed Signers (e.g. `payer` and `keypair`)
//    Its like signing the cheque
tx.sign([payer, newKeypair]);

// 9 . Send the transaxtion to solana
const sig = await connection.sendTransaction(tx);

console.log(`Transaction signature = ${sig}`);

printConsoleSeparator();

console.log("Transaction completed");
console.log(explorerURL({ txSignature: sig }));
