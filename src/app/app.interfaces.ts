export interface Result{
    matches: Match[];
  }
  
  export interface Match{
    id: number;
    utcDate: Date;
    homeTeam: Team;
    awayTeam: Team;
    score: Score;
  
  }
  
  export interface Team{
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  }
  
  export interface Score{
    winner: string;
    fullTime: ExactScore;
    halfTime: ExactScore;
  }
  
  export interface ExactScore{
    home: number;
    away: number;
  }
  