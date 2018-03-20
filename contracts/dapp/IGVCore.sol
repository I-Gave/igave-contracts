pragma solidity 0.4.19;

import "./IGVFundraiser.sol";

contract IGVCore is IGVFundraiser {
  uint256 public campaignEscrowAmount = 0; // Required escrow to create a campaign. Default, zero
  uint256 public totalRaised = 0;          // Total funds raised by the contract

  event ReadyCampaign(uint256 campaignId);    // Campaign owner has marked campaign ready for activation
  event ActivateCampaign(uint256 campaignId); // Contract owner has marked campaign active
  event VetoCampaign(uint256 campaignId);     // Contract owner has removed a campaign from the dapp

  // Create a new campaign. Must include escrow amount in tx.
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
  // Add a certificate to an existing campaign. Must be the campaign owner. Returns the new certificate index.
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
  // Change the values of an existing certificate. Campaign cannot be active. Must be campaign owner.
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
  // Make a donation and issue the ERC-721 token for a campaign & certificate. Must include certificate price in tx.
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

  // Campaign owner marks their campaign ready for activation
  function readyCampaign(uint256 _campaignId) public {
    require(_campaignId > 0);
    require(campaignIndexToOwner[_campaignId] == msg.sender);

    campaigns[_campaignId].ready = true;

    ReadyCampaign(_campaignId);
  }

  // Contract owner marks a campaign active.
  function activateCampaign(uint256 _campaignId) public onlyOwner {
    require(_campaignId > 0);
    require(campaigns[_campaignId].active == false);
    require(campaigns[_campaignId].veto == false);
    require(campaignCertificates[_campaignId].length > 0);

    campaigns[_campaignId].active = true;

    ActivateCampaign(_campaignId);
  }

  // Contract owner removes a campaign
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

  // Contract owner changes the amount required to start a campaign
  function changeEscrowAmount(uint64 _campaignEscrowAmount) public onlyOwner {
    campaignEscrowAmount = _campaignEscrowAmount;
  }

}