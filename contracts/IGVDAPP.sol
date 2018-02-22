pragma solidity 0.4.19;

import "./dapp/IGVCore.sol";

contract IGVDAPP is IGVCore {
    function IGVDAPP() public {
    founderAddress = msg.sender;
    ownerAddress = msg.sender;

    // Genesis is unspendable/invalid =)
    _createCampaign(address(0), "Genesis Campaign", "");
    _createCertificate(0, 1, "Genesis Certificate", 0);
    _createToken(0, 0, 0, address(0), 0);
  }
}