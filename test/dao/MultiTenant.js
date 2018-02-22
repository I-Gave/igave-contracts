import { increaseTimeTo, duration } from '../helpers/increaseTime';

const BigNumber = web3.BigNumber

const MultiTenantAdapter = artifacts.require('MultiTenantAdapter')
const TokenTemplate = artifacts.require('TokenTemplate')
const DAOTemplate = artifacts.require('Association')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const expect = require('chai').expect

contract('Multitenant Test', accounts => {
  const [creator, user, anotherUser, operator, mallory] = accounts
  const oneEth = 10*10e18;

  let Token1 = null
  let Token2 = null
  let Token3 = null
  let Dao1 = null
  let Dao2 = null
  let Dao3 = null

  let Adapter = null;
  let MultiTenantDao = null;


  beforeEach(async () => {

    Token1 = await TokenTemplate.new("Token1", "T1", oneEth);
    Token2 = await TokenTemplate.new("Token2", "T2", oneEth, {from: user});
    Token3 = await TokenTemplate.new("Token3", "T3", oneEth, {from: anotherUser});

    Dao1 = await DAOTemplate.new(Token1.address, 100, 1);
    Dao2 = await DAOTemplate.new(Token2.address, 100, 1);
    Dao3 = await DAOTemplate.new(Token3.address, 100, 1);

    Adapter = await MultiTenantAdapter.new();

    await Adapter.addMember(Token1.address);
    await Adapter.addMember(Token2.address);
    await Adapter.addMember(Token3.address);

    MultiTenantDao = await DAOTemplate.new(Adapter.address, 100, 1);

  })

  describe('Multitenant DAO', () => {
    it('Exists', async () => {
      expect(MultiTenantDao).to.exist;
    })
    describe('Tokens', async () => {
      it('Creators have oneEth of tokens', async () => {
        let bal1 = await Token1.balanceOf(creator)
        let bal2 = await Token2.balanceOf(user)
        let bal3 = await Token3.balanceOf(anotherUser)

        bal1.should.be.bignumber.equal(oneEth)
        bal2.should.be.bignumber.equal(oneEth)
        bal3.should.be.bignumber.equal(oneEth)
      })
    })
    describe('Daos', async () => {
      it('Creates a new proposal', async () => {
        await Dao1.newProposal(
          creator,
          0,
          'Test Proposal',
          ''
        )

        const newProposal = await Dao1.proposals(0);

        newProposal[0].should.be.equal(creator);
        newProposal[1].should.be.bignumber.equal(0);
        newProposal[2].should.be.equal('Test Proposal');
      })
      it('Votes on a proposal', async () => {
        await Dao1.newProposal(
          creator,
          0,
          'Test Proposal',
          ''
        )
        const beforeVote = await Dao1.proposals(0);

        await Dao1.vote(0, true)

        const afterVote = await Dao1.proposals(0);

        beforeVote[6].should.be.bignumber.equal(0)
        afterVote[6].should.be.bignumber.equal(1)
      })
    })
    describe('MultiTenant',  async () => {
      beforeEach(async () => {

        await MultiTenantDao.newProposal(
          creator,
          0,
          'Test MultiDAO Proposal',
          ''
        )

        const newProposal = await MultiTenantDao.proposals(0);
      })
      it('Dao1 votes on the Dao1s proposal', async () => {
        const beforeVote = await MultiTenantDao.proposals(0);

        await MultiTenantDao.vote(0, true)

        const afterVote = await MultiTenantDao.proposals(0);

        beforeVote[6].should.be.bignumber.equal(0)
        afterVote[6].should.be.bignumber.equal(1)
      })
      it('Dao2 votes on the Dao1s proposal', async () => {
        const beforeVote = await MultiTenantDao.proposals(0);

        await MultiTenantDao.vote(0, true, {from: user})

        const afterVote = await MultiTenantDao.proposals(0);

        beforeVote[6].should.be.bignumber.equal(0)
        afterVote[6].should.be.bignumber.equal(1)
      })
      it('Dao3 votes on the Dao1s proposal', async () => {
        const beforeVote = await MultiTenantDao.proposals(0);

        await MultiTenantDao.vote(0, true, { from: anotherUser })

        const afterVote = await MultiTenantDao.proposals(0);

        beforeVote[6].should.be.bignumber.equal(0)
        afterVote[6].should.be.bignumber.equal(1)
      })
      it('All three vote and a proposal is executed', async () => {
        const beforeVote = await MultiTenantDao.proposals(0);

        await MultiTenantDao.vote(0, true, { from: creator })
        await MultiTenantDao.vote(0, true, { from: user })
        await MultiTenantDao.vote(0, true, { from: anotherUser })

        const afterVote = await MultiTenantDao.proposals(0);

        beforeVote[6].should.be.bignumber.equal(0)
        afterVote[6].should.be.bignumber.equal(3)

        await increaseTimeTo(Date.now() + duration.days(1));

        const { logs } = await MultiTenantDao.executeProposal(0, '');

        const quorum = logs[0].args.quorum.toNumber();

        quorum.should.be.equal(oneEth * 3)
      })
    })
  })
})

