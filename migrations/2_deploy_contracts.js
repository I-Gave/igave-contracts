var Token = artifacts.require("./IGVToken.sol");

module.exports = async function(deployer) {
  await deployer.deploy(Token);
};
