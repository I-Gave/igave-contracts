pragma solidity 0.4.19;

import '../util/SafeMath.sol';
import './IGVAsset.sol';

contract IGVCampaign is IGVAsset {
  Campaign[] campaigns;
  Token[] tokens;

  mapping (uint256 => address) public campaignIndexToOwner;
  mapping (address => uint256[]) public campaignOwnerToIndexes;
  mapping (address => uint256) public campaignOwnerTotalCampaigns;
  mapping (uint256 => uint256) public campaignBalance;
  mapping (uint256 => Certificate[]) public campaignCertificates;
  mapping (uint256 => uint64) public campaignCertificateCount;

  event CreateCampaign(address indexed owner, uint256 campaignId);
  event CreateCertificate(uint256 indexed campaignId, string name);
  event CreateToken(uint256 campaignId, uint16 certificateIdx, uint16 remaining, uint256 price);

  struct Token {
    uint256 campaignId;
    uint256 value;
    address purchaser;
    uint16 unitNumber;
    uint16 certificateIdx;
  }

  struct Campaign {
    address owner;
    string campaignName;
    string taxId;
    bool active;
    bool veto;
  }

  struct Certificate {
    uint256 campaignId;
    uint256 price;
    uint16 supply;
    uint16 remaining;
    string name;
  }

  function _createToken(
    uint256 _campaignId,
    uint16 _certificateIdx,
    uint16 _unitNumber,
    address _owner,
    uint256 _value
  )
    internal
    returns (uint)
  {
    Token memory _token = Token({
      campaignId: _campaignId,
      value: _value,
      purchaser: _owner,
      certificateIdx: _certificateIdx,
      unitNumber: _unitNumber
    });

    campaignCertificates[_campaignId][_certificateIdx].remaining--;
    uint256 newTokenId = tokens.push(_token);

    _mint(_owner, newTokenId);

    return newTokenId;
  }


  function _createCampaign(
    address _owner,
    string _campaignName,
    string _taxId
  )
    internal
    returns (uint)
  {
    Campaign memory _campaign = Campaign({
      owner: _owner,
      campaignName: _campaignName,
      taxId: _taxId,
      active: false,
      veto: false
    });

    uint256 newCampaignId = campaigns.push(_campaign);

    campaignIndexToOwner[newCampaignId] = _owner;
    campaignOwnerToIndexes[_owner].push(newCampaignId);
    campaignOwnerTotalCampaigns[_owner] += 1;

    CreateCampaign(_owner, newCampaignId);

    return newCampaignId;
  }

  function _createCertificate(
    uint256 _campaignId,
    uint16 _supply,
    string _name,
    uint256 _price
  )
    internal
    returns (uint)
  {
    require(campaignCertificateCount[_campaignId] < 65536);

    Certificate memory _certificate = Certificate({
      campaignId: _campaignId,
      supply: _supply,
      remaining: _supply,
      name: _name,
      price: _price
    });

    uint256 certificateIndex = campaignCertificates[_campaignId].push(_certificate);

    campaignCertificateCount[_campaignId]++;

    CreateCertificate(_campaignId, _name);

    return certificateIndex;
  }

  // Views
  function getCampaign(uint256 _id)
    public
    view
    returns
  (
    address owner,
    string campaignName,
    string taxId,
    bool active,
    bool veto
  ) {
    Campaign storage campaign = campaigns[_id];

    owner = campaign.owner;
    campaignName = campaign.campaignName;
    taxId = campaign.taxId;
    active = campaign.active;
    veto = campaign.veto;
  }

  function getCertificate(uint256 _campaignId, uint64 _certificateIdx)
    public
    view
    returns
  (
    uint256 campaignId,
    uint64 supply,
    uint64 remaining,
    string name,
    uint256 price
  ){

    Certificate storage certificate = campaignCertificates[_campaignId][_certificateIdx];

    campaignId = uint256(certificate.campaignId);
    supply = uint64(certificate.supply);
    remaining = uint64(certificate.remaining);
    name = certificate.name;
    price = uint256(certificate.price);
  }

  function getToken(uint256 _id)
    public
    view
    returns
  (
    uint256 campaignId,
    uint256 value,
    uint16 unitNumber,
    address purchaser,
    uint16 certificateIdx
  ){
    Token storage token = tokens[_id];

    campaignId = uint256(token.campaignId);
    value = uint256(token.value);
    unitNumber = uint16(token.unitNumber);
    purchaser = address(token.purchaser);
    certificateIdx = uint16(token.certificateIdx);
  }

  function getTotalCampaignsForOwner(address _owner)
    public
    view
    returns (
    uint256 total
  ){
    total = campaignOwnerTotalCampaigns[_owner];
  }

  function getCampaignIdByOwnerIndex(address _owner, uint256 _index)
    public
    view
    returns
  (
    uint256 id
  ){
    id = campaignOwnerToIndexes[_owner][_index];
  }

  function totalCampaigns() public view returns (uint) {
    return campaigns.length;
  }

  function getCampaignBalance(uint256 _campaignId) public view returns (uint256) {
    return campaignBalance[_campaignId];
  }

  function withdrawCampaignBalance(uint256 _campaignId) public {
    require(_campaignId >  0);
    require(campaignIndexToOwner[_campaignId] == msg.sender);
    require(campaignBalance[_campaignId] > 0);
    uint256 _balance = campaignBalance[_campaignId];
    campaignBalance[_campaignId] = 0;
    msg.sender.transfer(_balance);
  }
}