import {
  Connection,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
const address = new PublicKey("GK5GHL9ZyEka15qiLhqZyWaixMBPEZ3rCTqQaSD4huVd");

var balance;
try {
  balance = await connection.getBalance(address);
} catch (err) {
  console.log(`err returned ${err}`);
}
const balanceSol = balance / LAMPORTS_PER_SOL;
console.log(`The balance of the account at ${address} is ${balanceSol} SOL`);
