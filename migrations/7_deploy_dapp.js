const Dapp = artifacts.require('./IGVDAPP.sol');

module.exports = async function (deployer) {
  try {
    await deployer.deploy(Dapp);
  } catch (e) {
    console.log(e);
  }
};
