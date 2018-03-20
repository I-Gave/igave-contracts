
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { WindowRef } from '../window';

const Web3 = require('web3');

@Component({
  selector: 'app-mytokens',
  templateUrl: './faucet.component.html',
  styleUrls: ['./faucet.component.css']
})
export class EtherFaucetComponent {
  window;
  addr;
  http;

  constructor(private winRef: WindowRef, http: Http) {
    this.window = winRef.nativeWindow;
    this.addr = this.window.web3.eth.accounts[0];

    this.http = http;
    this.getEther();
  }

  async init(igv) {

  }

  getEther() {
    this.http.get(`/faucet/${this.window.web3.eth.accounts[0]}`).subscribe(data => {
      console.log(data);
    });
  }
}

