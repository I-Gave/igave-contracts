import assertRevert, { assertError } from '../helpers/assertRevert'
import { increaseTimeTo, duration } from '../helpers/increaseTime';

const BigNumber = web3.BigNumber

const DAPP = artifacts.require('IGVDAPP')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const expect = require('chai').expect

contract('IGVAsset Test', accounts => {
  const [creator, user, anotherUser, operator, mallory] = accounts
  let dapp = null

  beforeEach(async () => {
    dapp = await DAPP.new()
  })

  describe('IGVAsset', () => {
    beforeEach(async () => {
      await dapp.createCampaign('Test Campaign', '501cid');
      await dapp.createCertificate(1, 2, "Test Certificate", 10);
    })
    describe('Assets', async () => {
      beforeEach(async () => {
        await dapp.activateCampaign(1);
      })
      it('Has a genesis token', async () => {
        await dapp.getToken(0);
        const token = await dapp.getToken(0);

        token[3].should.be.equal(creator);
      })
      it('Buys a token', async () => {
        await dapp.createToken(1, 0, { value: 10 });
        const token = await dapp.getToken(1);
        const certificate = await dapp.getCertificate(1, 0);
        const totalRaised = await dapp.totalRaised();
        const campaignBalance = await dapp.getCampaignBalance(1);

        token[3].should.be.equal(creator);
        certificate[2].should.be.bignumber.equal(1);
        totalRaised.should.be.bignumber.equal(10);
        campaignBalance.should.be.bignumber.equal(10);
      })
      it('Total raised increases', async () => {
        await dapp.createToken(1, 0, { value: 10 });

        const totalRaised = await dapp.totalRaised();

        totalRaised.should.be.bignumber.equal(10);
      })
      it('Campaign balance increases', async () => {
        await dapp.createToken(1, 0, { value: 10 });
        const campaignBalance = await dapp.getCampaignBalance(1);

        campaignBalance.should.be.bignumber.equal(10);
      })
      it('Total Tokens decreases', async () => {
        let certificate = await dapp.getCertificate(1,0);

        certificate[1].should.be.bignumber.equal(certificate[2]);
        await dapp.createToken(1, 0, { value: 10 });
        certificate = await dapp.getCertificate(1, 0);

        certificate[2].should.be.bignumber.equal(certificate[1].toNumber()-1);
      })
    })
    describe('Fail Conditions', async () => {
      it('Cannot buy a token from an inactive campaign', async () => {
        await assertRevert(dapp.createToken(1, 0, { value: 10 }));
      })
      it('Cannot buy a token from a vetoed campaign', async () => {
        await dapp.activateCampaign(1);
        await dapp.vetoCampaign(1);
        await assertRevert(dapp.createToken(1, 0, { value: 10 }));
      })
      it('Cannot buy more tokens than the supply', async () => {
        await dapp.activateCampaign(1);
        await dapp.createToken(1, 0, { value: 10 })
        await dapp.createToken(1, 0, { value: 10 })
        await assertRevert(dapp.createToken(1, 0, { value: 10 }));
      })
      it('Cannot avoid paying for the token', async () => {
        await dapp.activateCampaign(1);
        await assertRevert(dapp.createToken(1, 0, { value: 15 }));
        await assertRevert(dapp.createToken(1, 0));
      })
    })
  })
})

