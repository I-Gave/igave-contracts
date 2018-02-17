pragma solidity 0.4.19;

import './dar/WeightedAssetRegistry.sol';

contract IGVWDAR is WeightedAssetRegistry {
  string internal _name =  "IGV NFT";
  string internal _symbol = "I<3";
  string internal _description = "Asset Registry for the I Gave DAO";
}