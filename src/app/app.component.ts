import { Component } from '@angular/core';
import { SolWalletsService } from 'angular-sol-wallets';
import { Observable } from 'rxjs';
import { AppService } from './app.service';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'blockchain-front-app';
  publicKey: string = ''

  constructor(private solWalletS: SolWalletsService) {}

  ngOnInit(){
    this.solWalletS.connect().then( wallet => {
    this.publicKey = wallet.publicKey?.[Symbol.toStringTag]
    })
  }
}
