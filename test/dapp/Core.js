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
    describe('Constructor', async () => {
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
        genToken[3].should.be.equal(creator);
      })
    })
  })
})

