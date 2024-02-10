import {
  PublicKey,
  Keypair,
  Connection,
  clusterApiUrl,
  SystemProgram,
  TransactionMessage,
  LAMPORTS_PER_SOL,
  VersionedTransaction,
} from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";
import dotenv from "dotenv";
import { printConsoleSeparator, explorerURL } from "./helpers/env_vars";

dotenv.config();

const sender = getKeypairFromEnvironment("SECRET_KEY_PAYER");
const staticAcc = getKeypairFromEnvironment("SECRET_KEY_PAYEE");

const connection = new Connection(clusterApiUrl("devnet"));
const balance = await connection.getBalance(sender.publicKey);

// create 3 transactions
// 1. create account
// 2. trasnfer lamports from keypair_sender to keypair_static
// 3. transfer lamports from keypair_static to new_account

// 1. Build create account instruction
const newAcc = Keypair.generate();
const space = 0;
const minLamportsRent =
  await connection.getMinimumBalanceForRentExemption(space);
const createAccInstruction = SystemProgram.createAccount({
  fromPubkey: sender.publicKey,
  newAccountPubkey: newAcc.publicKey,
  lamports: minLamportsRent + 2_000_000,
  space: space,
  programId: SystemProgram.programId,
});

const transferToStaticAcc = await SystemProgram.transfer({
  fromPubkey: sender.publicKey,
  toPubkey: staticAcc.publicKey,
  lamports: LAMPORTS_PER_SOL,
  programId: SystemProgram.programId,
});

const transferToNewAcc = await SystemProgram.transfer({
  fromPubkey: staticAcc.publicKey,
  toPubkey: newAcc.publicKey,
  lamports: minLamportsRent + 100_000,
  programId: SystemProgram.programId,
});

const recentBlockhash = await connection
  .getLatestBlockhash()
  .then((res) => res.blockhash);

const message = new TransactionMessage({
  payerKey: sender.publicKey,
  recentBlockhash: recentBlockhash,
  instructions: [
    createAccInstruction,
    transferToStaticAcc,
    transferToNewAcc,
    transferToStaticAcc,
  ],
}).compileToV0Message();

const tx = new VersionedTransaction(message);

tx.sign([sender, newAcc, staticAcc]);

const sig = await connection.sendTransaction(tx);

/**
 * display some helper text
 */
printConsoleSeparator();

console.log("Transaction completed.");
console.log(explorerURL({ txSignature: sig }));
