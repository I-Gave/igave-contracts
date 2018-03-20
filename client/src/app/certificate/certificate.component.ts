import { Component } from '@angular/core';
import { WindowRef } from '../window';
import { ActivatedRoute } from '@angular/router';

const Web3 = require('web3');
const contract = require('truffle-contract');
const IGVCore = require('../../../../build/contracts/IGVDAPP.json');

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent {
  certificate;
  igv;
  sub;
  window;

  constructor(private winRef: WindowRef, private route: ActivatedRoute) {
    this.window = winRef.nativeWindow;
    this.igv = contract(IGVCore);
    this.igv.setProvider(this.window.web3.currentProvider);
    this.route = route;
    this.sub = this.route.params.subscribe(params => {
      let id = +params['id'];
      console.log(id);
      this.getCertificate(id);
    });



   }

   async getCertificate(id) {
    let instance = await this.igv.deployed();
    let cert = await instance.getCertificate(id);
    console.log(cert);
    let campaignId = cert[0].toNumber();
    let tokenIdx = cert[1].toNumber();
    let campaign = await instance.getCampaign(campaignId);
    let token = await instance.getToken(campaignId, tokenIdx);
    console.log(campaign)
    console.log(token)
    this.certificate = {
      id,
      campaignId,
      tokenIdx,
      campaignName: campaign[3],
      taxId: campaign[4],
      tokenName: token[3],
      purchaser: cert[3],
      value: token[4].toNumber() / 10e18
    }
  }


}
