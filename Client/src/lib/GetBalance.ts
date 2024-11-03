import { Connection, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL} from "@solana/web3.js";
export const CLUSTER_URL = import.meta.env.VITE_RPC_URL ?? clusterApiUrl("devnet");

export const connection = new Connection(CLUSTER_URL);

export async function getWalletBalance(address: PublicKey | null) {
    const currentBalance = await connection.getBalance(address!);
    return currentBalance/LAMPORTS_PER_SOL;
}