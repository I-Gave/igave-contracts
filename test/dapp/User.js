import assertRevert, { assertError } from '../helpers/assertRevert'
import { increaseTimeTo, duration } from '../helpers/increaseTime';

const BigNumber = web3.BigNumber

const DAPP = artifacts.require('IGVDAPP')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const expect = require('chai').expect

contract('User Test', accounts => {
  const [creator, user, anotherUser, operator, mallory] = accounts
  let dapp = null

  beforeEach(async () => {
    dapp = await DAPP.new()
  })

  describe('User', () => {
    describe('Campaigns', async () => {
      it('Creates a new campaign', async () => {
        await dapp.createCampaign('Test Campaign', '501cid', {from: mallory});
        const newCampaign = await dapp.getCampaign(1);

        newCampaign[1].should.be.equal('Test Campaign')
      })
    })
  })
})

