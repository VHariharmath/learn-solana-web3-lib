import {
  Connection,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL,
  GetAccountInfoConfig,
} from "@solana/web3.js";

// Solana has 3 networks
// Mainnet: Actual chain where real world transactions happen
// devnet: Built for development purpose
// testnet: Buit for testing purpose
const connection = new Connection(clusterApiUrl("devnet"));

// Public key is the wallet address
const address = new PublicKey("GK5GHL9ZyEka15qiLhqZyWaixMBPEZ3rCTqQaSD4huVd");

var balance;
try {
  balance = await connection.getBalance(address);
  const accInfo = await connection.getAccountInfo(address);
  console.log(`Account Info = ${JSON.stringify(accInfo)}`);
} catch (err) {
  console.log(`err returned ${err}`);
}
// connection.getBalance() returns lamports.
// lamports is basic unit of SOL
// Every block chain is backed by a COIN and Solana is backed by SOL
// To convert lamports into SOL, divide it by LAMPORTS_PER_SOL
const balanceSol = balance / LAMPORTS_PER_SOL;
console.log(`The balance of the account at ${address} is ${balanceSol} SOL`);
