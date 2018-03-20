pragma solidity 0.4.19;

import '../util/Ownable.sol';
import '../util/SafeMath.sol';
import './IGVAsset.sol';

contract IGVCampaign is IGVAsset, Ownable {
  address public founderAddress;

  Campaign[] campaigns;
  Token[] tokens;

  uint256 public maxCertificates = 1000;

  mapping (uint256 => address) public campaignIndexToOwner;         // owner address for campaign
  mapping (address => uint256[]) public campaignOwnerToIndexes;     // list of campaign ids for address
  mapping (address => uint256) public campaignOwnerTotalCampaigns;  // count of campaigns by owner
  mapping (uint256 => uint256) public campaignBalance;              // current campaign balance
  mapping (uint256 => Certificate[]) public campaignCertificates;   // list of certificates for each campaign
  mapping (uint256 => uint64) public campaignCertificateCount;      // count of certificates for each campaign

  event CreateCampaign(address indexed owner, uint256 indexed campaignId);
  event CreateCertificate(uint256 indexed campaignId, string name);
  event UpdateCertificate(uint256 indexed campaignId, uint16 indexed certificateIdx);
  event CreateToken(uint256 indexed campaignId, uint16 indexed certificateIdx, address owner);

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
    bool ready;
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

    CreateToken(_campaignId, _certificateIdx, _owner);

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
      veto: false,
      ready: false
    });

    uint256 newCampaignId = campaigns.push(_campaign) - 1;

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

  function _updateCertificate(
    uint256 _campaignId,
    uint256 _certificateIdx,
    uint16 _supply,
    string _name,
    uint256 _price
  )
    internal
  {
    require(_certificateIdx < campaignCertificateCount[_campaignId]);

    campaignCertificates[_campaignId][_certificateIdx].supply = _supply;
    campaignCertificates[_campaignId][_certificateIdx].name = _name;
    campaignCertificates[_campaignId][_certificateIdx].price = _price;

    UpdateCertificate(_campaignId, _certificateIdx);
  }

  function withdrawCampaignBalance(uint256 _campaignId) public {
    require(_campaignId > 0);
    require(campaignIndexToOwner[_campaignId] == msg.sender);
    require(campaignBalance[_campaignId] > 0);
    uint256 _balance = campaignBalance[_campaignId];
    campaignBalance[_campaignId] = 0;
    msg.sender.transfer(_balance);
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
    bool veto,
    bool ready
  ) {
    Campaign storage campaign = campaigns[_id];

    owner = campaign.owner;
    campaignName = campaign.campaignName;
    taxId = campaign.taxId;
    active = campaign.active;
    veto = campaign.veto;
    ready = campaign.ready;
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

  function totalCampaigns() public view returns (uint256) {
    return campaigns.length - 1;
  }

  function changeMaxCertificates(uint256 _maxCertificates) public onlyOwner {
    // Hard cap at 1000 Certificates. Well under Veto gas limits.
    require(_maxCertificates <= 1000);
    maxCertificates = _maxCertificates;
  }

  function getCampaignBalance(uint256 _campaignId) public view returns (uint256) {
    return campaignBalance[_campaignId];
  }
}