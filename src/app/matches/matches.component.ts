import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Match, Result } from '../app.interfaces';
import { AppService } from '../app.service';
import { SolWalletsService, Wallet } from "angular-sol-wallets" ;
import * as anchor from "@project-serum/anchor";
import { Program, AnchorProvider } from "@project-serum/anchor";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { BettingApp, IDL } from '../betting_app';

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
  bets: string[] = ['HOME_TEAM', 'AWAY_TEAM', 'DRAW']
  myDates: number[] = []
  network = "https://api.devnet.solana.com";
  connection = new Connection(this.network, "processed");
  address = "Fnegbc6LmnZGufbRXbgpEZbVDQJe2aSUYhsbjjU611Hh"
  

  ngOnInit(){
    this.solWalletS.connect().then( async wallet => {
      /*const program = this.getProgram(wallet)
      const contract = anchor.web3.Keypair.generate();
      if(program){
    const state = await program.account.programContract.fetch(this.address);
    console.log(state)*/
    const result: Observable<Result> = this.service.getMatches();
    result.subscribe(
      val => {
        console.log(val);
        this.matches = val.matches;
        this.matchesToDisplay = this.matches.slice(0, 10)
        this.matchesToDisplay.forEach(
          match => {
            this.table.push({id: match.id, utcDate: match.utcDate, homeTeam: match.homeTeam.name, awayTeam: match.awayTeam.name, bet:"", amount: 0, blocked: false, homeCrest: match.homeTeam.crest, awayCrest: match.awayTeam.crest})
          }
        )
        console.log(this.table);
        this.available = true;
        // Configure the client to use the local cluster.
        //anchor.setProvider(anchor.AnchorProvider.env());

        //const program = anchor.workspace.BettingApp as Program<BettingApp>;
        //const owner = (program.provider as _anchor.AnchorProvider).wallet;
        //const contract = _anchor.web3.Keypair.generate();
        //const user = _anchor.web3.Keypair.generate();
      }
    )
    }
  //}
    )
    
  }

  chooseOption(value: any, element: any) {    
    element.bet = value;
  }

  placeBet(element: TableElement) {
    if(element.bet != '' && element.amount > 0)
      {
    this.solWalletS.connect().then( wallet => {
    const program = this.getProgram(wallet)
    const amount = new anchor.BN(element.amount * anchor.web3.LAMPORTS_PER_SOL);
    if(program){
      const contract = anchor.web3.Keypair.generate();
      var user;
    
        console.log(element);
      
        console.log("Wallet connected successfully with this address:", wallet.publicKey?.[Symbol.toStringTag]);
        user = wallet.publicKey;
      
      //after connecting to backend it should be set for already bet elements
      element.blocked = true;
      if(user)
        this.placeWager(program, contract, user, element.id, amount, element.bet, wallet)

      
    
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

    

    const provider = new AnchorProvider(this.connection, wallet, {
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
      this.address,
      provider
    );

    return program;
  }

    async placeWager(
    program: Program<BettingApp>,
    contract: any,
    user: PublicKey,
    gameId: number,
    amount: anchor.BN,
    prediction: string,
    wallet: Wallet
  ) {
    const [userStatsPDA, _ub] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("user-stats"),
      ],
      program.programId
    );
    const [programPDA, _pb] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("program-wallet"),
        contract.publicKey.toBuffer(),
      ],
      program.programId
    );

   
      const tx = program.methods.placeWager(gameId, amount, prediction)
      .accounts({
        user: user,
        contract: contract.publicKey,
        programWallet: programPDA,
        userStats: userStatsPDA,
      })
      .transaction()
      tx.then(value => {
        this.makeTransaction(value, wallet)
      })
      


      
      

      
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
