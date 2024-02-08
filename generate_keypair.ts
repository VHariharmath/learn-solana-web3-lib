import { Keypair } from "@solana/web3.js";

// keypair is the combination of public key and secrete key
// public key is the wallet address
// secrete is the one to keep secrete
// solana works on asymmetric cryptography
// in asymmetric cryptography, we will have 2 different keys for encryption and decrypt
const keypair = Keypair.generate();

console.log(`Wallet addres: ${keypair.publicKey.toBase58()}`);
console.log(`Secret: ${keypair.secretKey}`);
console.log("Finished loading KEYS");
