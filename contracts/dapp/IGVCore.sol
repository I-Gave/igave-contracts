pragma solidity 0.4.19;

import "./IGVCampaign.sol";

contract IGVCore is IGVCampaign {
  Token[] tokens;
  address public founderAddress;
  address public ownerAddress;

  uint256 public campaignEscrowAmount = 0;
  uint256 public totalRaised = 0;

  modifier onlyBy(address _account)
  {
      require(msg.sender == _account);
      _;
  }

  function IGVCore() public {
      founderAddress = msg.sender;
      ownerAddress = msg.sender;

      // Genesis is unspendable/invalid =)
      _createCampaign(address(0), "Genesis Campaign", "");
      _createCertificate(0, 1, "Genesis Certificate", 0);
      //_createToken(0, 0, 0, address(0));
  }

  function createCampaign(
      string _campaignName,
      string _taxid
  )
    public
    payable
    returns (uint)
  {
    require(msg.value == campaignEscrowAmount);

    return _createCampaign(msg.sender, _campaignName, _taxid);
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

    require(campaign.veto == false);

    return _createCertificate(_campaignId, _supply, _name, _price);
  }

  function createToken(
      uint128 _campaignId,
      uint16 _certificateIdx
  )
    public
    payable
    //returns (uint)
  {
    Campaign storage campaign = campaigns[_campaignId];

    // Campaign is valid & active
    require(campaign.active == true);
    require(campaign.veto == false);

    // Ensure Token is still for sale
    Certificate storage certificate = campaignCertificates[_campaignId][_certificateIdx];

    require(certificate.remaining > 0);
    require(msg.value == uint256(certificate.price));

    uint64 unitNumber = certificate.supply - certificate.remaining + 1;

    campaignBalance[_campaignId] += msg.value;

    totalRaised += msg.value;


    //return _createToken(_campaignId, _certificateIdx, unitNumber, msg.sender);
  }

  function vetoCampaign(uint256 _campaignId) public onlyBy(ownerAddress)  {
    delete campaigns[_campaignId];
    campaigns[_campaignId].veto = true;
    campaigns[_campaignId].owner = ownerAddress;

    Certificate[] storage certificates = campaignCertificates[_campaignId];
    for (uint i = 0; i < certificates.length; i++) {
      delete certificates[i];
    }
  }

  // Views
  function getCampaign(uint256 _id)
      public
      view
      returns (
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
      veto = campaign.active;
      veto = campaign.veto;
  }

  function getCertificate(uint256 _campaignId, uint64 _certificateIdx)
    public
    view
    returns(
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
  {

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
    returns (
      uint256 id
    ) {
      id = campaignOwnerToIndexes[_owner][_index];
    }

  // Contract Management
  function changeEscrowAmount(
    uint64 _campaignEscrowAmount
  )
    public
    onlyBy(ownerAddress)
  {
    campaignEscrowAmount = _campaignEscrowAmount;
  }

  function changeOwner(
      address _newOwner
  )
    public
    onlyBy(ownerAddress) {
      ownerAddress = _newOwner;
  }
}