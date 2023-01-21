import { Wallet } from "angular-sol-wallets";
import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";

export class WalletAdapter implements anchor.Wallet {
  protected _wallet: Wallet;
  constructor(readonly w: Wallet) {
    this._wallet = w;
  }
  async signTransaction(tx: anchor.web3.Transaction): Promise<anchor.web3.Transaction> {
    return this._wallet.signTransaction(tx);
  }
  async signAllTransactions(txs: anchor.web3.Transaction[]): Promise<anchor.web3.Transaction[]> {
    const map = txs.map(t => this._wallet.signTransaction(t));
    return Promise.all(map);
  }
  get publicKey(): PublicKey {
    return this._wallet.publicKey!;
  }
  get payer(): Keypair {
    return new Keypair();
  }
}
