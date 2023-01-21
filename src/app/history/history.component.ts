import { Component, OnInit } from '@angular/core';
import { SolWalletsService, Wallet } from 'angular-sol-wallets';
import { Observable } from 'rxjs';
import { Match, Result } from '../app.interfaces';
import { AppService } from '../app.service';
import * as anchor from "@project-serum/anchor";
import { Program, AnchorProvider } from "@project-serum/anchor";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { BettingApp, IDL } from '../betting_app';
import { WalletAdapter } from '../WalletAdapter';

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
  address = "Fnegbc6LmnZGufbRXbgpEZbVDQJe2aSUYhsbjjU611Hh"

  ngOnInit(): void {
    this.solWalletS.connect().then( async wallet => {
      const program = this.getProgram(wallet)
      if(program){
        const [userStatsPDA, _ub] = PublicKey.findProgramAddressSync(
          [
            anchor.utils.bytes.utf8.encode("user-stats"),
          ],
          program.programId
        );
        let stats =  await program.account.userStats.fetch(userStatsPDA);
    console.log(stats)
    let ids = this.backendInfo.map(x=>x.id).join(',')
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
            this.backendInfo.forEach(e => {
              if(e.id == match.id){
                basicElement = e;
                this.table.push({id: match.id, utcDate: match.utcDate, homeTeam: match.homeTeam.name, awayTeam: match.awayTeam.name, bet:basicElement.bet, amount: basicElement.amount, result: match.score.winner, collected: false, homeCrest: match.homeTeam.crest, awayCrest: match.awayTeam.crest, blocked: false})
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
      this.address,
      provider
    );

    return program;
  }

  


  

}
