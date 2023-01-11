import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

export interface Result{
  matches: Match[];
}

interface Match{
  id: number;
  utcDate: Date;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;

}

interface Team{
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

interface Score{
  winner: string;
  fullTime: ExactScore;
  halfTime: ExactScore;
}

interface ExactScore{
  home: number;
  away: number;
}

interface TableElement{
  id: number;
  utcDate: Date;
  homeTeam: string;
  awayTeam: string;
  bet: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private service: AppService){}
  title = 'blockchain-front-app';
  matches: Match[] = [];
  table: TableElement[] = [];
  columnsToDisplay = ['date', 'homeTeam', 'awayTeam', 'options', 'actions'];
  available: boolean = false;
  bets: string[] = ['HOME_TEAM', 'AWAY_TEAM', 'DRAW']
  

  ngOnInit(){
    const result: Observable<Result> = this.service.getMatches();
    result.subscribe(
      val => {
        console.log(val);
        this.matches = val.matches;
        this.matches.forEach(
          match => {
            this.table.push({id: match.id, utcDate: match.utcDate, homeTeam: match.homeTeam.name, awayTeam: match.awayTeam.name, bet:""})
          }
        )
        console.log(this.table);
        this.available = true;
      }
    )
  }

  chooseOption(value: any, element: any) {    
    element.bet = value;
  }

  placeBet(element: any) {
    console.log(element);
  }

}
