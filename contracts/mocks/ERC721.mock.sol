pragma solidity ^0.4.18;

import "../dapp/IGVAsset.sol";

/**
 * @title ERC721TokenMock
 * This mock just provides a public mint and burn functions for testing purposes.
 */
contract ERC721TokenMock is IGVAsset {
  function ERC721TokenMock() ERC721Token() public { }

  function mint(address _to, uint256 _tokenId) public {
    super._mint(_to, _tokenId);
  }

  function burn(uint256 _tokenId) public {
    super._burn(_tokenId);
  }
}