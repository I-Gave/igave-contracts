pragma solidity 0.4.19;

import '../IGVToken.sol';

contract IGVTokenMock is IGVToken {

  function IGVTokenMock(uint256 balance) {
    balances[msg.sender] = balance;
    totalSupply_ = balance;
  }
}