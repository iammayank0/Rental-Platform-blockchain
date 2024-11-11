// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Rental is Ownable(msg.sender), ERC721URIStorage, ReentrancyGuard {
    uint public nextTokenId;

    constructor() ERC721("Rental Property", "PROPERTY") {
        nextTokenId = 0;
    }

    struct Property {
        address owner;
        uint256 tokenId;
        string  tokenUri;
        uint256 pricePerUnitTime;
        uint256 availableFrom;
        uint256 minimumTime;
        uint256 maximumTime;
        uint256 depositAmount;
        bool isAvailable;
    }

    struct Agreement {
        uint256 tokenId;
        address owner;
        address tenant;
        uint256 startTimestamp;
        uint256 endTimestamp;
        uint256 amount;
        uint256 depositAmount;
    }

    mapping(uint256 => Property) public properties;
    mapping(uint256 => Agreement) public agreements;

    uint[] public agreementPropertyIds;

    event PropertyMinted(uint indexed tokenId, address indexed owner);
    event AgreementConfirmed(uint indexed toekenId, address indexed tenant, uint256 amount);
    event DepositRefunded(uint indexed tokenId, address indexed tenant, uint256 amount);

    function mintProperty(string memory _tokenUri, uint256 pricePerUnitTime, uint256 availableFrom,  uint256 minimumTime, uint256 maximumTime, uint256 depositAmount) external {
       require( bytes(_tokenUri).length>0, "Invalid Uri!");
        uint256 tokenId = nextTokenId++;
        Property memory property = Property({owner: msg.sender, tokenId: tokenId, tokenUri: _tokenUri, pricePerUnitTime: pricePerUnitTime, availableFrom: availableFrom,  minimumTime:minimumTime, maximumTime: maximumTime, depositAmount: depositAmount, isAvailable: true});
        properties[tokenId] = property;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenUri);
        emit PropertyMinted(tokenId, msg.sender);
    }

    function createAgreementAndPayRent(uint256 _tokenId, uint256 startTimestamp, uint256 endTimestamp) external payable {
        Property memory property = properties[_tokenId];
        require(msg.sender != property.owner, "You are owner of the property");
        require(startTimestamp>= block.timestamp , "Invalid time!");
        require(endTimestamp > block.timestamp, "Invalid time!");
        require(startTimestamp>= property.availableFrom, "Not available!");
        uint256 duration = (endTimestamp - startTimestamp);
        uint256 amount = property.pricePerUnitTime* duration;
        require(msg.value == amount+ property.depositAmount, "Invalid amount!");
        require(duration<= property.maximumTime && duration >= property.minimumTime, "Invalid time period!");
        Agreement memory agreement = Agreement({
            tokenId: _tokenId,
            owner: property.owner,
            tenant: msg.sender,
            startTimestamp: startTimestamp,
            endTimestamp: endTimestamp,
            amount: amount, 
            depositAmount: property.depositAmount
        });
        agreements[_tokenId] = agreement;
        property.availableFrom = endTimestamp;
        property.isAvailable = false;
        agreementPropertyIds.push(_tokenId);
        payable(agreement.owner).transfer(agreement.amount);
        emit AgreementConfirmed(_tokenId, agreement.tenant,agreement.amount);
    }

    function refundDeposit(uint256 _tokenId, uint256 deductionAmount) external {
        Agreement storage agreement = agreements[_tokenId];
        require(msg.sender == agreement.owner, "You're not a owner!");
        require(block.timestamp> agreement.endTimestamp, "Rental period is not over yet!");
        uint256 returnAmount = agreement.depositAmount - deductionAmount;
        delete agreements[_tokenId];
        Property storage property = properties[_tokenId];
        property.isAvailable = true;
        payable(agreement.tenant).transfer(returnAmount);
        emit DepositRefunded(_tokenId, agreement.tenant, returnAmount);
    }

    function getProperties() view public returns( Property[] memory ) {
        Property[] memory allProperties = new Property[](nextTokenId);
        for(uint i = 0; i< nextTokenId; i++){
            allProperties[i] = properties[i];
        }
        return allProperties;
    }

    function getProperty(uint256 tokenId) public view returns (Property memory property){
        property = properties[tokenId];
    }

    function getAgreements() public view returns(Agreement[] memory allAgreements){
        uint count = agreementPropertyIds.length;
        allAgreements = new Agreement[](count);
        for(uint i=0; i<count; i++){
            allAgreements[i]= agreements[i];
        }
    }

    function getAgreement(uint256 tokenId) public view returns(Agreement memory agreement){
        agreement = agreements[tokenId];
    }
}