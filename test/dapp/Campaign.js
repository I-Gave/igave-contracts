import assertRevert, { assertError } from '../helpers/assertRevert'
import { increaseTimeTo, duration } from '../helpers/increaseTime';

const BigNumber = web3.BigNumber

const DAPP = artifacts.require('IGVDAPP')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const expect = require('chai').expect

contract('IGVCampaign Test', accounts => {
  const [creator, user, anotherUser, operator, mallory] = accounts
  let dapp = null

  beforeEach(async () => {
    dapp = await DAPP.new()
  })

  describe('IGVCampaign', () => {
    describe('Campaigns', async () => {
      it('Creates a new campaign', async () => {
        await dapp.createCampaign('Test Campaign', '501cid');
        const newCampaign = await dapp.getCampaign(1);

        newCampaign[1].should.be.equal('Test Campaign')
      })
      it('Activates a campaign', async () => {
        await dapp.createCampaign('Test Campaign', '501cid');
        await dapp.activateCampaign(1);

        const campaign = await dapp.getCampaign(1);

        campaign[3].should.be.equal(true);
      })
      it('Readies a campaign', async () => {
        await dapp.createCampaign('Test Campaign', '501cid');
        await dapp.readyCampaign(1)

        const campaign = await dapp.getCampaign(1);

        campaign[5].should.be.equal(true);
      })
      it('Vetos an inactive campaign', async () => {
        await dapp.createCampaign('Test Campaign', '501cid');
        await dapp.vetoCampaign(1)
        const vetoCampaign = await dapp.getCampaign(1);

        vetoCampaign[4].should.be.equal(true);
      })
      it('Vetos an active campaign', async () => {
        await dapp.createCampaign('Test Campaign', '501cid');
        await dapp.activateCampaign(1)
        await dapp.vetoCampaign(1)

        const vetoCampaign = await dapp.getCampaign(1);

        vetoCampaign[4].should.be.equal(true);
      })
      it('Vetos a readied campaign', async () => {
        await dapp.createCampaign('Test Campaign', '501cid');
        await dapp.readyCampaign(1)
        await dapp.vetoCampaign(1)

        const vetoCampaign = await dapp.getCampaign(1);

        vetoCampaign[4].should.be.equal(true);
      })
      it('Gets a campaign for an owner id', async () => {
        const campaignId = await dapp.getCampaignIdByOwnerIndex(creator, 0);

        campaignId.should.be.bignumber.equal(1);
      })
      it('Tracks the total campaigns', async () => {
        let totalCampaigns = await dapp.totalCampaigns();

        totalCampaigns.should.be.bignumber.equal(0);

        await dapp.createCampaign('Test Campaign', '501cid');

        totalCampaigns = await dapp.totalCampaigns();
        totalCampaigns.should.be.bignumber.equal(1);
      })
      it('Tracks the campaign balance', async () => {
        await dapp.createCampaign('Test Campaign', '501cid');
        await dapp.createCertificate(1, 10, "Test Certificate", 10);
        await dapp.activateCampaign(1);
        await dapp.createToken(1, 0, { value: 10 });

        const balance = await dapp.getCampaignBalance(1);

        balance.should.be.bignumber.equal(10);
      })
      it('Withdraws the campaign balance', async () => {
        await dapp.createCampaign('Test Campaign', '501cid');
        await dapp.createCertificate(1, 10, "Test Certificate", 10);
        await dapp.activateCampaign(1);
        await dapp.createToken(1, 0, { value: 10 });
        await dapp.withdrawCampaignBalance(1);

        const balance = await dapp.getCampaignBalance(1);

        balance.should.be.bignumber.equal(0);
      })
      it('Campaigns have a maximum number of certificates', async () => {
        const max = await dapp.maxCertificates();

        max.should.be.bignumber.equal(1000);
      })
      it('Changes the max certificates', async () => {
        await dapp.changeMaxCertificates(100);
        const max = await dapp.maxCertificates();

        max.should.be.bignumber.equal(100);
      })
    })
    describe('Fail conditions', async () => {
      it('Fails to create a campaign if the escrow amount is incorrect', async () => {
        await assertRevert(dapp.createCampaign('Test Campaign', '501cid', {value: 10}));
      })
      it('Fails to create a cert if the campaign is active', async () => {
        await dapp.createCampaign('Test Campaign', '501cid');
        await dapp.activateCampaign(1);
        await assertRevert(dapp.createCertificate(1, 10, "Test Certificate", 10));
      })
      it('Fails to withdraw the campaign balance from the wrong owner', async () => {
        await dapp.createCampaign('Test Campaign', '501cid');
        await dapp.createCertificate(1, 10, "Test Certificate", 10);
        await dapp.activateCampaign(1);
        await dapp.createToken(1, 0, { value: 10 });
        await assertRevert(dapp.withdrawCampaignBalance(1, {from: mallory}));

        const balance = await dapp.getCampaignBalance(1);

        balance.should.be.bignumber.equal(10);
      })
      it('Cannot activate the Genesis Campaign', async () => {
        await assertRevert(dapp.activateCampaign(0));
      })
      it('Cannot activate the same campaign twice', async () => {
        await dapp.createCampaign('Test Campaign', '501cid');
        await dapp.createCertificate(1, 10, "Test Certificate", 10);
        await dapp.activateCampaign(1);
        await assertRevert(dapp.activateCampaign(1));
      })
      it('Cannot activate a vetoed campaign', async () => {
        await dapp.createCampaign('Test Campaign', '501cid');
        await dapp.createCertificate(1, 10, "Test Certificate", 10);
        await dapp.vetoCampaign(1)
        await assertRevert(dapp.activateCampaign(1));
      })
      it('Cannot ready a campaign it does not own', async () => {
        await dapp.createCampaign('Test Campaign', '501cid');
        await assertRevert(dapp.readyCampaign(1, {from: mallory}));
      })
      it('Cannot change the max certificates unless they are the owner', async () => {
        await assertRevert(dapp.changeMaxCertificates(100, {from: mallory}));
      })
    })
  })
})

