import web3 from "@solana/web3.js";
import dotenv from "dotenv";

dotenv.config();

import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";

const keypair = await getKeypairFromEnvironment("SECRET_KEY_PAYEE");

console.log(`public key = ${keypair.publicKey.toBase58()}`);
