// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract POIDHBounty is Ownable, ReentrancyGuard {
    struct Bounty {
        address creator;
        string title;
        string description;
        uint256 amount;
        bool isActive;
        address[] claimants;
    }

    mapping(uint256 => Bounty) public bounties;
    uint256 public bountyCount;
    
    event BountyCreated(
        uint256 indexed bountyId, 
        address indexed creator, 
        string title, 
        uint256 amount
    );
    
    event BountyClaimed(
        uint256 indexed bountyId, 
        address indexed claimant
    );

    function createBounty(
        string memory _title, 
        string memory _description
    ) public payable {
        require(msg.value > 0, "Bounty amount must be greater than 0");
        
        bountyCount++;
        bounties[bountyCount] = Bounty({
            creator: msg.sender,
            title: _title,
            description: _description,
            amount: msg.value,
            isActive: true,
            claimants: new address[](0)
        });

        emit BountyCreated(bountyCount, msg.sender, _title, msg.value);
    }

    function claimBounty(uint256 _bountyId) public nonReentrant {
        Bounty storage bounty = bounties[_bountyId];
        
        require(bounty.isActive, "Bounty is not active");
        require(bounty.amount > 0, "No funds left in bounty");
        
        bounty.claimants.push(msg.sender);
        
        // Transfer funds to claimant
        (bool success, ) = msg.sender.call{value: bounty.amount}("");
        require(success, "Transfer failed");
        
        bounty.amount = 0;
        bounty.isActive = false;

        emit BountyClaimed(_bountyId, msg.sender);
    }

    function withdrawFunds() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}
}
