import { Component, OnInit } from '@angular/core';
import { WindowRef } from '../window';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  challenge
  window;
  web3;
  $;
  constructor(private winRef: WindowRef) {
    this.window = winRef.nativeWindow;
    this.$ = this.window.$;
    this.web3 = this.window.web3;

  }

  ngOnInit() {

  }

  async register() {
    const $ = this.$;

    this.challenge = await this.$.get(`http://localhost:3000/auth/${this.web3.eth.accounts[0]}`);

    console.log(typeof(this.challenge));

    var from = this.web3.eth.accounts[0];
    var params = [this.challenge, from]
    var method = 'personal_sign'

    this.web3.currentProvider.sendAsync({
      method,
      params,
      from,
    }, async (err, result) => {
      if (err) return console.error(err)
      if (result.error) return console.error(result.error)
        console.log(result.result);
      const data = await $.get(`http://localhost:3000/auth/${this.challenge}/${result.result}`);
      console.log(data);
    })
  }
}

