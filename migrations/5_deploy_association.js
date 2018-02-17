const Token = artifacts.require('./IGVToken.sol');
const Association = artifacts.require('./dao/Association.sol');

module.exports = async function (deployer) {
  try {
    await deployer.deploy(Association, Token.address, 10, 100);
  } catch (e) {
    console.log(e);
  }
};
