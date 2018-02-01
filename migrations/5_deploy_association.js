const LiquidDemocracy = artifacts.require('./dao/LiquidDemocracy.sol');
const Association = artifacts.require('./dao/Association.sol');

module.exports = async function (deployer) {
  try {
    await deployer.deploy(Association, LiquidDemocracy.address, 10, 100);
  } catch (e) {
    console.log(e);
  }
};
