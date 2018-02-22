import assertRevert, { assertError } from '../helpers/assertRevert'
import { increaseTimeTo, duration } from '../helpers/increaseTime';

import getEIP820 from '../helpers/getEIP820'

const BigNumber = web3.BigNumber

const DAPP = artifacts.require('IGVDAPP')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const expect = require('chai').expect

contract('DAPP Test', accounts => {
  const [creator, user, anotherUser, operator, mallory] = accounts
  let dapp = null

  beforeEach(async () => {
    dapp = await DAPP.new()
  })

  describe('DAPP', () => {
    describe('Constructor', async() => {
      it('Has a Founder', async () => {
        const founder = await dapp.founderAddress();
        founder.should.be.equal(creator);
      })
      it('Has an Owner', async () => {
        const owner = await dapp.ownerAddress();
        owner.should.be.equal(creator);
      })
      it('Has a Genesis Campaign', async () => {
        const genCampaign = await dapp.getCampaign(0);
        genCampaign[1].should.be.equal('Genesis Campaign')
      })
      it('Has a Genesis Certificate', async () => {
        const genCertificate = await dapp.getCertificate(0, 0);
        genCertificate[3].should.be.equal('Genesis Certificate')
      })
      it('Has a Genesis Token', async () => {
        const genToken = await dapp.getToken(0);
        genToken[3].should.be.equal('0x0000000000000000000000000000000000000000');
      })
    })
    describe('Escrow', async () => {
      it('Has escrow amount', async () => {
        const escrow = await dapp.campaignEscrowAmount()
        escrow.should.be.bignumber.equal(0);
      })
      it('Changes escrow amount', async () => {
        const oldEscrow = await dapp.campaignEscrowAmount()
        oldEscrow.should.be.bignumber.equal(0);

        await dapp.changeEscrowAmount(10000);

        const newEscrow = await dapp.campaignEscrowAmount()
        newEscrow.should.be.bignumber.equal(10000);
      })
    })
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
      describe('Certificates', async () => {
        beforeEach(async () => {
          await dapp.createCampaign('Test Campaign', '501cid');
        })
        it('Has a genesis certificate', async () => {
          const cert = await dapp.getCertificate(0, 0);

          cert[3].should.be.equal("Genesis Certificate");
        })
        it('Adds certificates to a campaign', async () => {
          await dapp.createCertificate(1, 10, "Test Certificate", 10);
          const cert = await dapp.getCertificate(1,0);

          cert[3].should.be.equal("Test Certificate");
        })
      })
      describe('Tokens', async () => {
        beforeEach(async () => {
          await dapp.createCampaign('Test Campaign', '501cid');
          await dapp.createCertificate(1, 10, "Test Certificate", 10);
          await dapp.activateCampaign(1);
        })
        it('Has a genesis token', async () => {
          await dapp.getToken(0);
          const token = await dapp.getToken(0);

          token[3].should.be.equal('0x0000000000000000000000000000000000000000');
        })
        it('Buys a token', async () => {
          await dapp.createToken(1,0, {value: 10});
          const token = await dapp.getToken(1);

          token[3].should.be.equal(creator);
        })
      })
    })
  })

})

