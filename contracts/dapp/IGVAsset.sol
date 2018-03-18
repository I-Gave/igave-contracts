pragma solidity ^0.4.19;

import '../token/ERC721/ERC721Token.sol';

contract IGVAsset is ERC721Token {
  function name() external pure returns (string _name) {
    _name = "I Gave Asset";
  }

  function symbol() external pure returns (string _symbol) {
    _symbol = "I<3";
  }
}