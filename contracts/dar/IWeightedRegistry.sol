pragma solidity ^0.4.18;

interface IWeightedRegistry {

  function totalWeight() public view returns (uint256);
  function isWeighted() public view returns (bool);

  function weightOfAsset(uint256 assetId) public view returns (uint256);
  function weightOfHolder(address holder) public view returns (uint256);

  /**
   * Events
   */
  event TransferWeight(
    address indexed from,
    address indexed to,
    uint256 indexed assetId,
    uint256 weight
  );
  event ChangeWeight(
    uint256 indexed assetId,
    uint256 weight
  );

}
