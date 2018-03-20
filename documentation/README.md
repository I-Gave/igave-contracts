# I Gave Fundraiser DAPP

### Files
```
IGVCore 			- High-level campaign, certificate and token function calls.
IGVFundraiser 		- Logic and storage for campaigns, certificates and issuing tokens
IGVAsset 			- IGV Metadata for ERC-721
ERC721Token.sol 	- Base OpenZeppelin ERC-721 contract
```

#### IGVCore.sol
```
// Variables
uint256 public campaignEscrowAmount = 0; 	// Required escrow to create a campaign. Default, zero
uint256 public totalRaised = 0; 		 	// Total funds raised by the contract

// Event logging
event ReadyCampaign(uint256 campaignId);	// Campaign owner has marked campaign ready for activation
event ActivateCampaign(uint256 campaignId); // Contract owner has marked campaign active
event VetoCampaign(uint256 campaignId);		// Contract owner has removed a campaign from the dapp

// Create a new campaign. Must include escrow amount in tx.
function createCampaign(string _campaignName, string _taxid) public payable returns (uint);

// Add a certificate to an existing campaign. Must be the campaign owner. Returns the new certificate index.
function createCertificate(uint256 _campaignId, uint16 _supply, string _name, uint256 _price) public returns (uint)

// Change the values of an existing certificate. Campaign cannot be active. Must be campaign owner.
function updateCertificate(uint256 _campaignId, uint256 _certificateIdx, uint16 _supply, string _name, uint256 _price)     public

// Make a donation and issue the ERC-721 token for a campaign & certificate. Must include certificate price in tx.
function createToken(uint128 _campaignId, uint16 _certificateIdx) public payable returns (uint)

// Campaign Management
// Campaign owner marks their campaign ready for activation
function readyCampaign(uint256 _campaignId) public

// Contract owner marks a campaign active. Campaign does not have to be ready but must have certificates.
function activateCampaign(uint256 _campaignId) public onlyOwner

// Contract owner removes a campaign
function vetoCampaign(uint256 _campaignId) public onlyOwner

 // Contract owner changes the amount required to start a campaign
 function changeEscrowAmount(uint64 _campaignEscrowAmount) public onlyOwner
```