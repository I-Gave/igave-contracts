# I Gave Fundraiser DAPP

## Local Development

```
$ git clone
$ npm install && cd client && npm install && ..
... long install ...
$ truffle develop
truffle(develop)> migrate
```

This will pull the latest code, install required modules, launch a local ethereum testnet, compile the smart contracts and migrate them to the testnet chain.

Connect MetaMask to localhost:9545 to use the development blockchain in the browser.

```
$ cd client
$ ng serve
```

This will launch the angular 2 development server @ localhost:4200. Browse here for the management dashboard on the demo site.

The owner of the fundraiser contract is the account that launches it. That's currently the truffle development account.

Go back to the `truffle(develop) console

```
truffle(develop)> var instance
truffle(develop)> IGVDAPP.deployed().then(function(ins) { instance = ins })
truffle(develop)> instance.owner()
'0x627306090abab3a6e1400e9345bc60c78a8bef57'
truffle(develop)> web3.eth.accounts[0]
'0x627306090abab3a6e1400e9345bc60c78a8bef57'
```

From here, you will need to do two things before starting.

1. Transfer ownership of the contract to your MetaMask account
2. Transfer some ether to your MetaMask account

#### Transfer Contract Ownership
Each campaign needs activation before going live. You need to do this on the Campaign Admin tab and must be the contract owner to activate a campaign.

First, get your MetaMask account address, e.g. "0xC7b4f558e11Fa78dD985520FafE065ABA77F5c30"

```
truffle(develop)> instance.transferOwnership("0xC7b4f558e11Fa78dD985520FafE065ABA77F5c30")
truffle(develop)> instance.owner()
'0xc7b4f558e11fa78dd985520fafe065aba77f5c30'
```

Now your MetaMask account will be able to send Admin transactions through the dashboard.


#### Transfer ether to your account

```
web3.eth.sendTransaction({ to: "0xc7b4f558e11fa78dd985520fafe065aba77f5c30", from: web3.eth.accounts[0], value: 10e18 })
```

Connect Metamask to another network and then back to localhost:9545 to view the updated balance. If you relaunch the testnet chain you will also need to reset MetaMask under 'Settings.' This clears the transaction log so your tx nonce is correct.


## Demo

Now a local network has been setup, the contracts are deployed and the front end is ready. You are the contract owner

Now open the browser to localhost:4200

![](https://raw.githubusercontent.com/I-Gave/igave-demo/master/imgs/Demo0.png)

To start a new campaign, visit the campaign tab:

![](https://raw.githubusercontent.com/I-Gave/igave-demo/master/imgs/Demo1.png)

Give the campaign a name, starting block and ending block. Metamask will automatically provide the browser your account address.

Click Create Campaign

![](https://raw.githubusercontent.com/I-Gave/igave-demo/master/imgs/Demo2.png)

Metamask will open, send the transaction.

![](https://raw.githubusercontent.com/I-Gave/igave-demo/master/imgs/Demo3.png)

The browser will automatically redirect to the 'My Campaigns' tab

![](https://raw.githubusercontent.com/I-Gave/igave-demo/master/imgs/Demo4.png)

Click the gear to manage the new campaign.

![](https://raw.githubusercontent.com/I-Gave/igave-demo/master/imgs/Demo5.png)

Fill in the token information and add it to the campaign.

![](https://raw.githubusercontent.com/I-Gave/igave-demo/master/imgs/Demo6.png)

Refresh the page, the token will be added to the campaign.

Go to the Admin Campaign Tab. Mark your campaign Active. Now you may buy tokens from the campaign.



### Files
```
IGVCore
High-level campaign, certificate and token function calls.

IGVFundraiser
Logic and storage for campaigns, certificates and issuing tokens

IGVAsset
IGV Metadata for ERC-721

ERC721Token.sol
Base OpenZeppelin ERC-721 contract
```

#### IGVCore.sol
```
// Variables
// Required escrow to create a campaign. Default, zero
uint256 public campaignEscrowAmount = 0;

// Total funds raised by the contract
uint256 public totalRaised = 0;

// Event logging
// Campaign owner has marked campaign ready for activation
event ReadyCampaign(uint256 campaignId);

// Contract owner has marked campaign active
event ActivateCampaign(uint256 campaignId);

// Contract owner has removed a campaign from the dapp
event VetoCampaign(uint256 campaignId);

// Top-level logic. Contains access control and logic checks.
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

#### IGVFundraiser.sol
```
//  Variables
// Contract launcher
address public founderAddress;

// Campaigns tracked by the dapp
Campaign[] campaigns;

// Tokens tracked by the dapp
Token[] tokens;

// Max certificates a campaign may issue. Does not effect supply
uint256 public maxCertificates = 100;

// Campaign and Certificate tracking
// owner address for campaign
mapping (uint256 => address)  public      campaignIndexToOwner;

// list of campaign ids for address
mapping (address => uint256[]) public     campaignOwnerToIndexes;

// count of campaigns by owner
mapping (address => uint256) public       campaignOwnerTotalCampaigns;

// current campaign balance
mapping (uint256 => uint256) public       campaignBalance;

// list of certificates for each campaign
mapping (uint256 => Certificate[]) public campaignCertificates;

// count of certificates for each campaign
mapping (uint256 => uint64) public        campaignCertificateCount;


// Event logging
// Campaign has been created
event CreateCampaign(address indexed owner, uint256 indexed campaignId);

// Certificate added to campaign
event CreateCertificate(uint256 indexed campaignId, string name);

// Certificate has been updated
event UpdateCertificate(uint256 indexed campaignId, uint256 indexed certificateIdx);

// Token has been purchased
event CreateToken(uint256 indexed campaignId, uint256 indexed certificateIdx, address owner);

// Campaign owner withdraws campaign balance
event WithdrawBalance(uint256 indexed campaignId, uint256 balance);


// Structs
// Structs occupy 2 32 byte spaces at a time. These have room for storage optimization.

// ERC-721 Token data
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


// Internal fundraiser logic
// Issues an ERC-721 token
function _createToken(uint256 _campaignId, uint16 _certificateIdx, uint16 _unitNumber, address _owner, uint256 _value) internal returns (uint)

// Tracks a new campaign
function _createCampaign(address _owner, string _campaignName, string _taxId) internal returns (uint)

// Adds a certificate to an inactive campaign
function _createCertificate(uint256 _campaignId, uint16 _supply, string _name, uint256 _price) internal returns (uint)

// Changes the attributes of an existing certificate
function _updateCertificate(uint256 _campaignId, uint256 _certificateIdx, uint16 _supply, string _name, uint256 _price)  internal

// Campaign owner withdraws campaign balance;
function withdrawCampaignBalance(uint256 _campaignId) public

// Hard cap at 1000 Certificates. Well under Veto gas limits.
function changeMaxCertificates(uint256 _maxCertificates) public onlyOwner


// Views
function getCampaign(uint256 _id)
function getCertificate(uint256 _campaignId, uint64 _certificateIdx)
function getToken(uint256 _id)
function getTotalCampaignsForOwner(address _owner)
function getCampaignIdByOwnerIndex(address _owner, uint256 _index)
function totalCampaigns() public view returns (uint256)
function getCampaignBalance(uint256 _campaignId) public view returns (uint256)

```



















