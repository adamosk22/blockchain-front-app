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
  blocked: false;
}
interface BasicElement{
  id: number;
  bet: string;
  amount: number;
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  constructor(private service: AppService, private solWalletS: SolWalletsService) { }

  columnsToDisplay = ['date', 'homeTeam', 'awayTeam', 'bet', 'amount', 'result', 'actions']
  //placeholder
  backendInfo: BasicElement[]  = [{id: 416384, amount: 2, bet: 'AWAY_TEAM'}, {id: 416383, amount: 1, bet: 'HOME_TEAM'}, {id: 416317, amount: 3, bet: 'HOME_TEAM'}]
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
      if(program){
        const [userStatsPDA, _ub] = PublicKey.findProgramAddressSync(
          [
            anchor.utils.bytes.utf8.encode("user-stats"),
            wallet.publicKey.toBuffer()
          ],
          program.programId
        );
        let stats =  await program.account.userStats.fetch(userStatsPDA);
    console.log(stats)
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
            var basicElement: BasicElement
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
                  var result
                if(e.actuallResult?.awayVictory)
                  result = 'AwayVictory'
                else if (e.actuallResult?.homeVictory)
                  result = 'HomeVictory'
                else if (e.actuallResult?.tie)
                  result = 'Tie'
                else
                  result = '?'
                  var amount = e.lamportsBet.toNumber() / LAMPORTS_PER_SOL

                this.table.push({id: match.id, utcDate: match.utcDate, homeTeam: match.homeTeam.name, awayTeam: match.awayTeam.name, bet, amount, result, collected: false, homeCrest: match.homeTeam.crest, awayCrest: match.awayTeam.crest, blocked: false})
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
    console.log(element);
    this.solWalletS.connect().then( wallet => {
      console.log("Wallet connected successfully with this address:", wallet.publicKey?.[Symbol.toStringTag]);
    }).catch(err => {
      console.log("Error connecting wallet", err );
    })
    element.collected = true;
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
    if(this.program){
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

  


  

}
