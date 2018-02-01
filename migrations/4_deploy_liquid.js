const Token = artifacts.require('./IGVToken.sol');
const LiquidDemocracy = artifacts.require('./dao/LiquidDemocracy.sol');

module.exports = async function (deployer) {
  try {
    await deployer.deploy(LiquidDemocracy, Token.address, 'transferOwnership(address)', 75);
  } catch (e) {
    console.log(e);
  }
};
