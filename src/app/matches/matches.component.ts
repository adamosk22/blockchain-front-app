import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Match, Result } from '../app.interfaces';
import { AppService } from '../app.service';
import { SolWalletsService, Wallet } from "angular-sol-wallets" ;
import * as anchor from "@project-serum/anchor";
import { Program, AnchorProvider } from "@project-serum/anchor";
import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { BettingApp, IDL } from '../betting_app';
import * as buffer from 'buffer';
import { WalletAdapter } from '../WalletAdapter';
window.Buffer = buffer.Buffer;

interface TableElement{
  id: number;
  utcDate: Date;
  homeTeam: string;
  awayTeam: string;
  bet: string;
  amount: number;
  homeCrest: string;
  awayCrest: string;
  blocked: boolean;
  betAmount: number;
}

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

  constructor(private service: AppService,  private solWalletS: SolWalletsService){}
  matches: Match[] = [];
  matchesToDisplay: Match[] = [];
  table: TableElement[] = [];
  columnsToDisplay = ['date', 'homeTeam', 'awayTeam', 'options', 'amount', 'actions'];
  available: boolean = false;
  bets: string[] = ['HomeVictory', 'AwayVictory', 'Tie']
  myDates: number[] = []
  network = "https://api.devnet.solana.com";
  connection = new Connection(this.network, "processed");
  address = new PublicKey("Fnegbc6LmnZGufbRXbgpEZbVDQJe2aSUYhsbjjU611Hh")
  

  ngOnInit(){
    this.solWalletS.connect().then( async wallet => {
      const program = this.getProgram(wallet)
      if(program){
    const state = await program.account.programContract.fetch(this.address);
    console.log(state)
    const ids = state.activeGames.filter(x => x.state.scheduled).map(x => x.id).join(',')
    const result: Observable<Result> = this.service.getHistory(ids);
    

    result.subscribe(
      val => {
        console.log(val);
        this.matches = val.matches;
        this.matchesToDisplay = this.matches.slice(0, 10)
        this.matchesToDisplay.forEach(
          match => {
            this.table.push({id: match.id, utcDate: match.utcDate, homeTeam: match.homeTeam.name, awayTeam: match.awayTeam.name, bet:"", amount: 0, blocked: false, homeCrest: match.homeTeam.crest, awayCrest: match.awayTeam.crest, betAmount:0})
          }
        )
        console.log(this.table);
      }
    )
    }
  }
    )
    
  }

  chooseOption(value: any, element: any) {    
    element.bet = value;
  }

  placeBet(element: TableElement) {
    if(element.bet != '' && element.amount > 0)
      {
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
        this.placeWager(program, user, element.id, amount, element.bet, wallet)

      
    
  }
  }).catch(err => {
    console.log("Error connecting wallet", err );
  })
}
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

  async placeWager(
    program: Program<BettingApp>,
    user: PublicKey,
    gameId: number,
    amount: anchor.BN,
    prediction: string,
    wallet: Wallet
  ) {
    const [userStatsPDA, _] = PublicKey.findProgramAddressSync(
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
    //this.createUserStats(program, user, wallet)
      const tx = await program.methods.placeWager(gameId, amount, prediction)
      .accounts({
        user: user,
        contract: this.address,
        programWallet: programPDA,
        userStats: userStatsPDA,
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

  async createUserStats(
    program: Program<BettingApp>, 
    user: any,
    wallet: Wallet
  ) {
    const [userStatsPDA, _] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("user-stats"),
        user.toBuffer(),
      ],
      program.programId
    );
  
    const tx = await program.methods
      .createUserStats()
      .accounts({
        user: user,
        userStats: userStatsPDA,
      })
      .transaction()
      this.makeTransaction(tx, wallet)
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
    console.log(stats)
    stats.history.forEach(val => {
      this.table.forEach(element => {
        if(val.gameId == element.id){
            var bet
            if(val.predictedResult.awayVictory)
              bet = 'AwayVictory'
            else if (val.predictedResult.homeVictory)
              bet = 'HomeVictory'
            else if (val.predictedResult.tie)
              bet = 'Tie'
            else
              bet = '?'
          element.bet = bet
          element.betAmount = val.lamportsBet.toNumber() / LAMPORTS_PER_SOL
          element.blocked = true;
        }
      })
    })
    
    
      }})
      this.available = true;
  }

  async withdrawWager(
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
      .withdrawWager(gameId)
      .accounts({
        user: user,
        contract: this.address,
        programWallet: programPDA,
        userStats: userStatsPDA,
      })
      .transaction()
      this.makeTransaction(tx, wallet)
  }

  withdrawBet(element: TableElement) {
    this.solWalletS.connect().then( wallet => {
      console.log(wallet)
    const program = this.getProgram(wallet)
    if(program){
      var user;
    
        console.log(element);
      
        console.log("Wallet connected successfully with this address:", wallet.publicKey?.[Symbol.toStringTag]);
        user = wallet.publicKey;
      
      //after connecting to backend it should be set for already bet elements
      element.blocked = true;
      if(user)
        this.withdrawWager(program, user, element.id, wallet)

      
    
  }
  }).catch(err => {
    console.log("Error connecting wallet", err );
  })
}

  

  

  


}
