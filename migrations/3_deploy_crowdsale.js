var Token = artifacts.require("./IGVToken.sol");
var Crowdsale = artifacts.require("./IGVCrowdsale.sol");

var startTime = Date.now() + 1000000000;
var endTime = startTime + 100000000;
var rate = 10;
var goal = 1000;
var cap = 10000000;

// _startTime, _endTime, _rate, _goal, _cap, _wallet, _token

module.exports = async function (deployer) {
  try {
    await deployer.deploy(Crowdsale, startTime, endTime, rate, goal, cap, Token.address, Token.address);
  } catch (e) {
    console.log(e)
  }

};
