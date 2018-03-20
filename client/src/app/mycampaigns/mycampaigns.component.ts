import { Component } from '@angular/core';
import { WindowRef } from '../window';

const Web3 = require('web3');
const contract = require('truffle-contract');
const IGVCore = require('../../../../build/contracts/IGVDAPP.json');

@Component({
  selector: 'app-dashboard',
  templateUrl: './mycampaigns.component.html',
  styleUrls: ['./mycampaigns.component.css']
})

export class MyCampaignsComponent {

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
    let totalCampaigns = await instance.getTotalCampaignsForOwner.call(this.window.web3.eth.accounts[0]);
    totalCampaigns = totalCampaigns.toNumber();

    for (let i = 0; i < totalCampaigns; i++) {
      let id = await instance.getCampaignIdByOwnerIndex.call(this.window.web3.eth.accounts[0], i);
      id = id.toNumber() - 1;

      let c = await instance.getCampaign.call(id);

      this.campaigns.push({
        id: id,
        ready: c[5],
        active: c[3],
        veto: c[4],
        name: c[1]
      });

    }
  }


}
