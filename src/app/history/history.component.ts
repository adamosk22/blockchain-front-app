import { Component, OnInit } from '@angular/core';
import { SolWalletsService, Wallet } from 'angular-sol-wallets';
import { Observable } from 'rxjs';
import { Match, Result } from '../app.interfaces';
import { AppService } from '../app.service';
import * as anchor from "@project-serum/anchor";
import { Program, AnchorProvider } from "@project-serum/anchor";
import { Connection, LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";
import { BettingApp, IDL } from '../betting_app';
import { WalletAdapter } from '../WalletAdapter';
import * as buffer from 'buffer';
import { HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS } from '@angular/cdk/a11y/high-contrast-mode/high-contrast-mode-detector';
window.Buffer = buffer.Buffer;

interface TableElement{
  id: number;
  utcDate: Date;
  homeTeam: string;
  awayTeam: string;
  bet: string;
  result: string;
  amount: number;
  homeCrest: string;
  awayCrest: string;
  collected: boolean;
  blocked: boolean;
  cancelled: boolean;
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  constructor(private service: AppService, private solWalletS: SolWalletsService) { }

  columnsToDisplay = ['date', 'homeTeam', 'awayTeam', 'bet', 'amount', 'result', 'actions']
  matches: Match[] = [];
  matchesToDisplay: Match[] = [];
  table: TableElement[] = [];
  available: boolean = false;
  network = "https://api.devnet.solana.com";
  connection = new Connection(this.network, "processed");
  address = new PublicKey("Fnegbc6LmnZGufbRXbgpEZbVDQJe2aSUYhsbjjU611Hh")
  program: Program<BettingApp> | undefined

  ngOnInit(): void {
  }

  configure(){
    this.solWalletS.connect().then( async wallet => {
      const program = this.getProgram(wallet)
      if(program && wallet.publicKey){
        const [userStatsPDA, _ub] = PublicKey.findProgramAddressSync(
          [
            anchor.utils.bytes.utf8.encode("user-stats"),
            wallet.publicKey.toBuffer()
          ],
          program.programId
        );
        let stats =  await program.account.userStats.fetch(userStatsPDA);
        const state = await program.account.programContract.fetch(this.address);
    console.log(stats)
    console.log(state)
    let ids = stats.history.map(x=>x.gameId).join(',')
    console.log(ids)
    const result: Observable<Result> = this.service.getHistory(ids);
    result.subscribe(
      val => {
        console.log(val);
        this.matches = val.matches;
        this.matchesToDisplay = this.matches.slice(0, 10)
        this.matchesToDisplay.forEach(
          match => {
            stats.history.forEach(e => {
              if(e.gameId == match.id){
                var bet
                if(e.predictedResult.awayVictory)
                  bet = 'AwayVictory'
                else if (e.predictedResult.homeVictory)
                  bet = 'HomeVictory'
                else if (e.predictedResult.tie)
                  bet = 'Tie'
                else
                  bet = '?'
                  var result = '?'
                
                var amount = e.lamportsBet.toNumber() / LAMPORTS_PER_SOL
                var cancelled = false
                state.activeGames.forEach(g => {
                  if(g.id == e.gameId && (g.state.finished || g.state.cancelled)){
                    if(g.result?.awayVictory)
                      result = 'AwayVictory'
                    else if (g.result?.homeVictory)
                      result = 'HomeVictory'
                    else if (g.result?.tie)
                      result = 'Tie'
                    else
                      result = '?'

                    if(g.state.cancelled){
                      cancelled = true
                    }
                  }
                })
                var collected = (e.lamportsWon.toNumber() > 0)

                this.table.push({id: match.id, utcDate: match.utcDate, homeTeam: match.homeTeam.name, awayTeam: match.awayTeam.name, bet, amount, result, collected, homeCrest: match.homeTeam.crest, awayCrest: match.awayTeam.crest, blocked: false, cancelled})
              }
            })
          }
        )
        console.log(this.table);
        this.available = true;
      }
    )
      }})
  }
  
  collect(element: TableElement) {
    this.solWalletS.connect().then( wallet => {
      console.log(wallet)
    const program = this.getProgram(wallet)
    const amount = new anchor.BN(element.amount * anchor.web3.LAMPORTS_PER_SOL);
    if(program){
      var user;
    
        console.log(element);
      
        console.log("Wallet connected successfully with this address:", wallet.publicKey?.[Symbol.toStringTag]);
        user = wallet.publicKey;
      
      //after connecting to backend it should be set for already bet elements
      element.blocked = true;
      if(user)
        this.collectWager(program, user, element.id, wallet)
      element.collected = true;

      
    
  }
  }).catch(err => {
    console.log("Error connecting wallet", err );
  })
  }

  getProvider(wallet: Wallet) {
    if (!wallet) {
      return null;
    }

    

    const provider = new AnchorProvider(this.connection, new WalletAdapter(wallet), {
      preflightCommitment: "processed",
    });

    return provider;
  }

  getProgram(wallet: Wallet) {
    const provider = this.getProvider(wallet);

    if (!provider) {
      return;
    }

    const program: Program<BettingApp> = new Program(
      IDL,
      "Cs6SipyJ7i4Qgw1QaaR2Jmtrbx9c4A7sHa4Kgx9edLHC",
      provider
    );

    return program;
  }

  async getStats(wallet: Wallet){
    if(this.program && wallet.publicKey){
    const [userStatsPDA, _] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("user-stats"),
        wallet.publicKey.toBuffer(),
      ],
      this.program.programId
    );
    return await this.program.account.userStats.fetch(userStatsPDA);
    }
    return null
  }

  async collectWager(
    program: Program<BettingApp>,
    user: PublicKey,
    gameId: number,
    wallet: Wallet
  ) {
    const [userStatsPDA, _ub] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("user-stats"),
        user.toBuffer(),
      ],
      program.programId
    );
    const [programPDA, _pb] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("program-wallet"),
        this.address.toBuffer(),
      ],
      program.programId
    );
  
    const tx = await program.methods
      .collectWager(gameId)
      .accounts({
        user: user,
        contract: this.address,
        userStats: userStatsPDA,
        programWallet: programPDA,
      })
      .transaction()
      this.makeTransaction(tx, wallet)

  }

  async makeTransaction(tx: Transaction, wallet: Wallet){
    if(wallet.publicKey){
      tx.feePayer = wallet.publicKey
          tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash
          const signedTx = await wallet.signTransaction(tx)
          const txId = await this.connection.sendRawTransaction(signedTx.serialize())
          await this.connection.confirmTransaction(txId)
    }
  }

  


  

}
