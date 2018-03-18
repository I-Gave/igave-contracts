pragma solidity 0.4.19;

import "./token/ERC20/MintableToken.sol";

contract IGVToken is MintableToken {
  string public constant name = "I Gave Token";
  string public constant symbol = "IGV";
  uint8 public constant decimals = 18;
}