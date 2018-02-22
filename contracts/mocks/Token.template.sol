pragma solidity 0.4.19;

import "../token/ERC827/MintableToken.sol";

contract TokenTemplate is MintableToken {
  string public name;
  string public symbol;
  uint8 public constant decimals = 18;

  function TokenTemplate(string _name, string _symbol, uint256 creatorStartAmount)  public {
    name = _name;
    symbol = _symbol;
    balances[msg.sender] = creatorStartAmount;
    totalSupply_ += creatorStartAmount;
  }
}