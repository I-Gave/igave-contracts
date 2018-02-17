pragma solidity 0.4.19;

contract IGVCampaign  {
    Campaign[] campaigns;
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

    // -1 Genesis Campaign is not a valid campaign
    function totalCampaigns() public view returns (uint) {
      return campaigns.length - 1;
    }

    function campaignCertificateCount(uint256 _campaignId) public view returns (uint64) {
      return campaignCertificateCount[_campaignId];
    }
}