import assertRevert, { assertError } from '../helpers/assertRevert'
import { increaseTimeTo, duration } from '../helpers/increaseTime';

const BigNumber = web3.BigNumber

const DAPP = artifacts.require('IGVDAPP')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const expect = require('chai').expect

contract('IGVCertificate Test', accounts => {
  const [creator, user, anotherUser, operator, mallory] = accounts
  let dapp = null

  beforeEach(async () => {
    dapp = await DAPP.new()
  })

  describe('IGVCertificate', () => {
    beforeEach(async () => {
      await dapp.createCampaign('Test Campaign', '501cid');
    })
    describe('Certificate', async () => {
      it('Creates a new certificate', async () => {
        await dapp.createCertificate(1, 10, "Test Certificate", 10);
      })
      it('Gets a certificate', async () => {
        await dapp.createCertificate(1, 10, "Test Certificate", 10);
        const certificate = await dapp.getCertificate(1,0);

        certificate[3].should.be.equal("Test Certificate");
      })
      it('Tracks the total campaign certificates', async () => {
        const totalCertificates = await dapp.campaignCertificateCount(0);

        totalCertificates.should.be.bignumber.equal(1);
      })
    })
    describe('Fail conditions', async () => {
      it('Cannot create a new certificate for the genesis campaign', async () => {
        await assertRevert(dapp.createCertificate(0, 10, "Test Certificate", 10));
      })
      it('Cannot create a new certificate without being the campaign owner', async () => {
        await assertRevert(dapp.createCertificate(1, 10, "Test Certificate", 10, {from: mallory}));
      })
      it('Cannot create a new certificate for a vetoed campaign', async () => {
        await dapp.vetoCampaign(1);
        await assertRevert(dapp.createCertificate(1, 10, "Test Certificate", 10));
      })
      it('Cannot create a new certificate for an active campaign', async () => {
        await dapp.activateCampaign(1)
        await assertRevert(dapp.createCertificate(1, 10, "Test Certificate", 10));
      })
    })
  })
})

