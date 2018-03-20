
import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { WindowRef } from '../window';

const Web3 = require('web3');
const contract = require('truffle-contract');
const IGVCore = require('../../../../build/contracts/IGVDAPP.json');

@Component({
  selector: 'app-mytokens',
  templateUrl: './mytokens.component.html',
  styleUrls: ['./mytokens.component.css']
})
export class MyTokensComponent {
  window;
  changeRef;
  tokens = [];

  constructor(private winRef: WindowRef, private ref: ChangeDetectorRef) {
    this.window = winRef.nativeWindow;
    const igv = contract(IGVCore);

    igv.setProvider(this.window.web3.currentProvider);
    this.changeRef = ref;
    this.init(igv);

    setTimeout(() => {
      this.ref.markForCheck();
    }, 1000);
  }

  async init(igv) {
    let instance = await igv.deployed();

    instance.CreateToken({
      purchaser: this.window.web3.eth.accounts[0]
    }, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch(async (error, result) => {
      if (result) {
        let id = result.args.certificateId.toNumber();
        const certificate = await instance.getCertificate(id);

        let campaignId = certificate[0].toNumber();
        let tokenIdx = certificate[1].toNumber();

        const campaign = await instance.getCampaign(campaignId);
        const token = await instance.getToken(campaignId, tokenIdx);

        this.tokens.push({
          certificateId: id,
          campaignId,
          tokenIdx,
          campaignName: campaign[3],
          supply: token[1].toNumber(),
          remaining: token[2].toNumber(),
          name: token[3],
          value: token[4].toNumber() / 10e18,
          issueNumber: certificate[2].toNumber(),
          purchaser: certificate[3]
        });
        this.tokens = this.tokens.slice();
      }
    });

  }


}

