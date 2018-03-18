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
      it('Vetos a campaign', async () => {
        await dapp.createCampaign('Test Campaign', '501cid');
        await dapp.vetoCampaign(1)
        const vetoCampaign = await dapp.getCampaign(1);

        vetoCampaign[4].should.be.equal(true);
      })
      it('Gets a campaign for an owner id', async () => {
        const campaignId = await dapp.getCampaignIdByOwnerIndex(creator, 0);

        campaignId.should.be.bignumber.equal(1);
      })
      it('Tracks the total campaigns', async () => {
        const totalCampaigns = await dapp.totalCampaigns();

        totalCampaigns.should.be.bignumber.equal(1);
      })
      it('Tracks the total campaign certificates', async () => {
        const totalCertificates = await dapp.campaignCertificateCount(0);

        totalCertificates.should.be.bignumber.equal(1);
      })
      it('Tracks the campaign balance', async () => {
        await dapp.createCampaign('Test Campaign', '501cid');
        await dapp.activateCampaign(1);
        await dapp.createToken(1, 0, { value: 10 });

        const balance = await dapp.getCampaignBalance(1);

        balance.should.be.bignumber.equal(10);
      })
    })
    describe('Fail conditions', async () => {
      it('Fails if the escrow amount is incorrect', async () => {
        await assertRevert(dapp.createCampaign('Test Campaign', '501cid', {value: 10}));
      })
    })
  })
})

