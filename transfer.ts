import {
  Connection,
  Transaction,
  SystemProgram,
  sendAndConfirmRawTransaction,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";
import web3 from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";
import dotenv from "dotenv";

// loads .env
dotenv.config();

const keypair = await getKeypairFromEnvironment("SECRET_KEY");
const address = new PublicKey(keypair.publicKey);

const connection = new Connection(clusterApiUrl("devnet"));
var balanceInLamports = await connection.getBalance(address);
var balanceInSol = balanceInLamports / web3.LAMPORTS_PER_SOL;

if (balanceInSol < 1) {
  console.log("Adding faucets");
  await connection.requestAirdrop(keypair.publicKey, 1 * LAMPORTS_PER_SOL);
}

balanceInLamports = await connection.getBalance(address);
balanceInSol = balanceInLamports / web3.LAMPORTS_PER_SOL;
console.log(`SOL = ${balanceInSol}`);

const PING_PROGRAM_ADDRESS = new web3.PublicKey(
  "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa"
);
const PING_PROGRAM_DATA_ADDRESS = new web3.PublicKey(
  "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod"
);

async function pingProgram(connection: web3.Connection, payer: web3.Keypair) {}
