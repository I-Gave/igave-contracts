import { Component } from '@angular/core';
import { WindowRef } from '../window';

const Web3 = require('web3');
const contract = require('truffle-contract');
const IGVCore = require('../../../../build/contracts/IGVDAPP.json');

@Component({
  selector: 'app-dashboard',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent {

  campaigns = [];
  window;

  constructor(private winRef: WindowRef) {
    this.window = winRef.nativeWindow;
    const igv = contract(IGVCore);

    igv.setProvider(this.window.web3.currentProvider);

    this.init(igv);
   }

   async init(igv) {
    let instance = await igv.deployed();
    let total = await instance.totalCampaigns.call();
    total = total.toNumber();

    for (let i = 1; i <= total; i++) {
      let c = await instance.getCampaign(i);

      this.campaigns.push({
        id: i,
        address: c[2],
        name: c[1],
        ready: c[5],
        active: c[3],
        veto: c[4],
      });
    }
  }


}
