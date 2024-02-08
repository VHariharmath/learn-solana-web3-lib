import web3, {
  sendAndConfirmRawTransaction,
  SystemProgram,
} from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";
import dotenv from "dotenv";

// loads .env
dotenv.config();

const keypair_sender = await getKeypairFromEnvironment("SECRET_KEY_PAYEE");
const keypair_receiver = await getKeypairFromEnvironment("SECRET_KEY_PAYER");
const address = new web3.PublicKey(keypair_sender.publicKey);

const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
var balanceInLamports = await connection.getBalance(address);
var balanceInSol = balanceInLamports / web3.LAMPORTS_PER_SOL;

if (balanceInSol < 1) {
  console.log("Adding faucets");
  await connection.requestAirdrop(
    keypair_sender.publicKey,
    1 * web3.LAMPORTS_PER_SOL
  );
}

balanceInLamports = await connection.getBalance(address);
balanceInSol = balanceInLamports / web3.LAMPORTS_PER_SOL;
console.log(
  `Payer account address = ${address} and balance SOL = ${balanceInSol}`
);

await transfer(connection, keypair_sender, keypair_receiver);

async function transfer(
  connection: web3.Connection,
  keypair_sender: web3.Keypair,
  keypair_receiver: web3.Keypair
) {
  const transaction = new web3.Transaction();

  const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: keypair_sender.publicKey,
    toPubkey: keypair_receiver.publicKey,
    lamports: web3.LAMPORTS_PER_SOL * 1,
  });

  transaction.add(sendSolInstruction);

  const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [keypair_sender]
  );

  console.log(
    `Verify the transaction over https://explorer.solana.com/ by searching payer URN = ${signature}`
  );

  const payeeAddr = new web3.PublicKey(keypair_receiver.publicKey);
  const balance = await connection.getBalance(payeeAddr);
  const balanceInSol = balance / web3.LAMPORTS_PER_SOL;
  console.log(
    `Payer account address = ${keypair_receiver.publicKey} and balance SOL = ${balanceInSol}`
  );
}
