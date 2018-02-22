pragma solidity 0.4.19;

contract Token {
  function balanceOf(address who) public view returns (uint256);
}

contract MultiTenantAdapter {
  Token[] public _tokenAddresses;

  function MultiTenantAdapter() {

  }

  function balanceOf(address holder) public returns (uint256) {
    uint256 balance = 0;
    for (uint256 i = 0; i < _tokenAddresses.length; i++) {
      balance += adjustVoteWeight(
        _tokenAddresses[i],
        _tokenAddresses[i].balanceOf(holder)
      );
    }
    return balance;
  }

  function addMember(address newMember) {
    _tokenAddresses.push(Token(newMember));
  }

  /*
   * TODO: Solve the management problem. See Array Delete
   * For now, change removed member's address to a benign
   * contract that returns 0 for every address. But I'm in a parking lot in SF =D
   **/
  function removeMember(uint256 index, address someBenignContract) {
    _tokenAddresses[index] = Token(someBenignContract);
  }

  /*
   * Magic goes here.
   */
  function adjustVoteWeight(address tokenAddress, uint256 voteWeight) returns (uint256) {
    return voteWeight;
  }
}