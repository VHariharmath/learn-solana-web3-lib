import web3, {
  sendAndConfirmRawTransaction,
  SystemProgram,
} from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";
import dotenv from "dotenv";

// loads .env
dotenv.config();

const keypair_sender = await getKeypairFromEnvironment("SECRET_KEY_PAYER");
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
console.log(`SOL = ${balanceInSol}`);

await pingProgram(connection, keypair_sender);

async function pingProgram(
  connection: web3.Connection,
  keypair_sender: web3.Keypair
) {
  const PING_PROGRAM_ADDRESS = new web3.PublicKey(
    "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa"
  );
  const PING_PROGRAM_DATA_ADDRESS = new web3.PublicKey(
    "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod"
  );

  const transaction = new web3.Transaction();
  const programId = new web3.PublicKey(PING_PROGRAM_ADDRESS);
  const programDataId = new web3.PublicKey(PING_PROGRAM_DATA_ADDRESS);

  const instruction = new web3.TransactionInstruction({
    keys: [
      {
        pubkey: programDataId,
        isSigner: false,
        isWritable: true,
      },
    ],
    programId,
  });

  transaction.add(instruction);

  const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [keypair_sender]
  );

  console.log(`Singnature = ${signature}`);

  const balance = await connection.getBalance(programDataId);
  const balanceInSol = balance / web3.LAMPORTS_PER_SOL;
  console.log(`Succesfully wrong data to the n/w`);
}
