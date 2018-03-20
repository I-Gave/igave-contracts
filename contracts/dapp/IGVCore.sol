pragma solidity 0.4.19;

import "./IGVCampaign.sol";

contract IGVCore is IGVCampaign {
  uint256 public campaignEscrowAmount = 0;
  uint256 public totalRaised = 0;

  event ReadyCampaign(uint256 campaignId);
  event ActivateCampaign(uint256 campaignId);
  event VetoCampaign(uint256 campaignId);

  function createCampaign(
    string _campaignName,
    string _taxid
  )
    public
    payable
    returns (uint)
  {
    require(msg.value == campaignEscrowAmount);

    uint256 campaignId = _createCampaign(msg.sender, _campaignName, _taxid);
    campaignBalance[campaignId] += campaignEscrowAmount;
    return campaignId;
  }

  function createCertificate(
    uint256 _campaignId,
    uint16 _supply,
    string _name,
    uint256 _price
  ) public
    returns (uint)
  {
    require(campaignIndexToOwner[_campaignId] == msg.sender);
    require(_campaignId > 0);

    Campaign storage campaign = campaigns[_campaignId];

    require(campaign.active == false);
    require(campaign.veto == false);
    require(campaign.ready == false);

    return _createCertificate(_campaignId, _supply, _name, _price);
  }

  function updateCertificate(
    uint256 _campaignId,
    uint256 _certificateIdx,
    uint16 _supply,
    string _name,
    uint256 _price
  )
    public
  {
    require(campaignIndexToOwner[_campaignId] == msg.sender);
    require(_campaignId > 0);

    Campaign storage campaign = campaigns[_campaignId];

    require(campaign.active == false);
    require(campaign.veto == false);
    require(campaign.ready == false);

    return _updateCertificate(_campaignId, _certificateIdx, _supply, _name, _price);
  }

  function createToken(
    uint128 _campaignId,
    uint16 _certificateIdx
  )
    public
    payable
    returns (uint)
  {
    Campaign storage campaign = campaigns[_campaignId];

    // Campaign is valid & active
    require(campaign.active == true);
    require(campaign.veto == false);

    // Ensure Token is still for sale
    Certificate storage certificate = campaignCertificates[_campaignId][_certificateIdx];

    require(certificate.remaining > 0);
    require(msg.value == uint256(certificate.price));

    uint16 unitNumber = certificate.supply - certificate.remaining + 1;

    campaignBalance[_campaignId] += msg.value;

    totalRaised += msg.value;

    return _createToken(_campaignId, _certificateIdx, unitNumber, msg.sender, msg.value);
  }

   function readyCampaign(uint256 _campaignId) public {
    require(_campaignId > 0);
    require(campaignIndexToOwner[_campaignId] == msg.sender);

    campaigns[_campaignId].ready = true;

    ReadyCampaign(_campaignId);
  }

  function activateCampaign(uint256 _campaignId) public onlyOwner {
    require(_campaignId > 0);
    require(campaigns[_campaignId].active == false);
    require(campaigns[_campaignId].veto == false);
    require(campaignCertificates[_campaignId].length > 0);

    campaigns[_campaignId].active = true;

    ActivateCampaign(_campaignId);
  }

  function vetoCampaign(uint256 _campaignId) public onlyOwner  {
    require(_campaignId > 0);
    delete campaigns[_campaignId];
    campaigns[_campaignId].veto = true;
    campaigns[_campaignId].owner = owner;

    Certificate[] storage certificates = campaignCertificates[_campaignId];
    for (uint256 i = 0; i < certificates.length; i++) {
      delete certificates[i];
    }
    VetoCampaign(_campaignId);
  }

  function changeEscrowAmount(uint64 _campaignEscrowAmount) public onlyOwner {
    campaignEscrowAmount = _campaignEscrowAmount;
  }

}