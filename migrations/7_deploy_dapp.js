const Dapp = artifacts.require('./IGVDAPP.sol');

module.exports = async function (deployer) {
  try {
    await deployer.deploy(Dapp, '0xC7b4f558e11Fa78dD985520FafE065ABA77F5c30');
  } catch (e) {
    console.log(e);
  }
};
