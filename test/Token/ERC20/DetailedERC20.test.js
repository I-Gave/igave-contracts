const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const DetailedERC20Mock = artifacts.require('IGVToken');

contract('DetailedERC20', (accounts) => {
  let detailedERC20 = null;

  const _name = 'I Gave Token';
  const _symbol = 'IGV';
  const _decimals = 18;

  beforeEach(async () => {
    detailedERC20 = await DetailedERC20Mock.new(_name, _symbol, _decimals);
  });

  it('has a name', async () => {
    const name = await detailedERC20.name();
    name.should.be.equal(_name);
  });

  it('has a symbol', async () => {
    const symbol = await detailedERC20.symbol();
    symbol.should.be.equal(_symbol);
  });

  it('has an amount of decimals', async () => {
    const decimals = await detailedERC20.decimals();
    decimals.should.be.bignumber.equal(_decimals);
  });
});
