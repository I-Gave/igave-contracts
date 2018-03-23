pragma solidity 0.4.19;

import "./dapp/IGVCore.sol";

contract IGVDAPP is IGVCore {
    function IGVDAPP(address _owner) public {
    founderAddress = msg.sender;
    owner = _owner;
    _createCampaign(msg.sender, "Genesis Campaign", "");
    _createCertificate(0, 1, "Genesis Certificate", 0);
    _createToken(0, 0, 0, msg.sender, 0);
  }
}