import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Match, Result } from '../app.interfaces';
import { AppService } from '../app.service';
import { SolWalletsService, Wallet } from "angular-sol-wallets" ;
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { BettingApp } from '../betting_app';

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
  

  ngOnInit(){
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
        anchor.setProvider(anchor.AnchorProvider.env());

        const program = anchor.workspace.BettingApp as Program<BettingApp>;
        const owner = (program.provider as anchor.AnchorProvider).wallet;
        const contract = anchor.web3.Keypair.generate();
        const user = anchor.web3.Keypair.generate();
      }
    )
  }

  chooseOption(value: any, element: any) {    
    element.bet = value;
  }

  placeBet(element: TableElement) {
    if(element.bet != '' && element.amount > 0)
      {
        console.log(element);
      this.solWalletS.connect().then( wallet => {
        console.log("Wallet connected successfully with this address:", wallet.publicKey?.[Symbol.toStringTag]);
      }).catch(err => {
        console.log("Error connecting wallet", err );
      })
      //after connecting to backend it should be set for already bet elements
      element.blocked = true;
    }
  }

}
