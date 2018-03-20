# I Gave Fundraiser DAPP

# I Gave Demo

This demo uses truffle and ganache to create a test Ethereum network, deploy the I Gave contracts and launch the demo. To get started:

```
$ cd client
$ npm install
$ ng serve
```

Angular CLI will build the front end client and serve it at localhost:4200

Create a local testnet:
```
$ truffle develop
Truffle Develop started at http://localhost:9545/

Accounts:
(0) 0x627306090abab3a6e1400e9345bc60c78a8bef57
(1) 0xf17f52151ebef6c7334fad080c5704d77216b732
(2) 0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef
(3) 0x821aea9a577a9b44299b9c15c88cf3087f3b5544
(4) 0x0d1d4e623d10f9fba5db95830f7d3839406c6af2
(5) 0x2932b7a2355d6fecc4b5c0b6bd44cc31df247a2e
(6) 0x2191ef87e392377ec08e7c08eb105ef5448eced5
(7) 0x0f4f2ac550a1b4e2280d04c21cea7ebd822934b5
(8) 0x6330a553fc93768f612722bb8c2ec78ac90b3bbc
(9) 0x5aeda56215b167893e80b4fe645ba6d5bab767de

Mnemonic: candy maple cake sugar pudding cream honey rich smooth crumble sweet treat

truffle(develop)>
```

```
truffle(develop)>  migrate
Compiling ./contracts/ERC677.sol...
Compiling ./contracts/ERC677Receiver.sol...
Compiling ./contracts/ERC721.sol...
Compiling ./contracts/IGVAsset.sol...
Compiling ./contracts/IGVBase.sol...
Compiling ./contracts/IGVCampaign.sol...
Compiling ./contracts/IGVCore.sol...
Compiling ./contracts/Migrations.sol...
Compiling ./contracts/SafeMath.sol...
Compiling ./contracts/StandardToken.sol...
Compiling ./contracts/Token.sol...
Writing artifacts to ./build/contracts

Using network 'develop'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0x77b140201db413a3433255cda984eef4955f7da88e0f82587ddcd27e792452c9
  Migrations: 0x8cdaf0cd259887258bc13a92c0a6da92698644c0
Saving successful migration to network...
  ... 0xd7bc86d31bee32fa3988f1c1eabce403a1b5d570340a3a9cdba53a472ee8c956
Saving artifacts...
Running migration: 3_core_migration.js
  Deploying IGVCore...
  ... 0xc47873d10958e7e71c6ba92e163a9ea46b3333c6ad649ba206866e8384886089
  IGVCore: 0x345ca3e014aaf5dca488057592ee47305d9b3e10
Saving successful migration to network...
  ... 0x6c490dbda19da7864052e45cd99efda3f7e0c7dc2e4b8f96722bf21f052b3f07
Saving artifacts...
truffle(develop)>

```

Now a local network has been setup, the contracts are deployed and the front end is ready.

Install Metamask: https://metamask.io/

Connect Metamask to the local Ethereum network

![](https://raw.githubusercontent.com/I-Gave/igave-demo/master/imgs/DemoMetamask0.png)  | ![](https://raw.githubusercontent.com/I-Gave/igave-demo/master/imgs/DemoMetamask1.png)


Then Send yourself some test Ether
```
truffle(develop)> web3.eth.sendTransaction({ to: "Your Metamask Address Goes Here", from: web3.eth.accounts[0], value: 1000000000000000000 })
'0x569cde4ef461a75393c0e7e2e7e82d9773310a32d82eba35187316a53f6484d5'
```

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



















