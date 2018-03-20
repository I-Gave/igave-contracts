import { Component } from '@angular/core';
import { WindowRef } from '../window';

const Web3 = require('web3');
const contract = require('truffle-contract');
const IGVCore = require('../../../../build/contracts/IGVDAPP.json');

@Component({
  selector: 'app-dashboard',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateCampaignsComponent {

  igv;
  window;

  campaignName = '';
  taxId = '';
  owner = '';

  constructor(private winRef: WindowRef) {
    this.window = winRef.nativeWindow;
    this.igv = contract(IGVCore);

    this.igv.setProvider(this.window.web3.currentProvider);
    this.owner = this.window.web3.eth.accounts[0];
  }

  async createCampaign() {
    const campaignName = this.campaignName;
    const account = this.window.web3.eth.accounts[0];
    const taxId = this.taxId;

    const window = this.window;
    this.igv.deployed().then(function(instance) {
      const igv = instance;
      return igv.createCampaign(
        campaignName,
        taxId,
        { from: account }
      );
    }).then(function(result) {
      window.location = "/mycampaigns";
    }).catch(function(e) {
      console.log(e);
    });
  }

}
