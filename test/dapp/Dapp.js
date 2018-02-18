import assertRevert, { assertError } from '../helpers/assertRevert'
import { increaseTimeTo, duration } from '../helpers/increaseTime';

import getEIP820 from '../helpers/getEIP820'

const BigNumber = web3.BigNumber

const DAPP = artifacts.require('IGVCore')

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
        console.log(genToken);
        genToken[2].should.be.equal('0x0000000000000000000000000000000000000000');
      })
    })
  })

})

