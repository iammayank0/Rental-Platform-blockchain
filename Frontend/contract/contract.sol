// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RentalPropertyPlatform is ERC721, Ownable {
    uint256 public nextTokenId;
    IERC20 public paymentToken;

    struct Agreement {
        address landlord;
        address tenant;
        uint256 propertyId;
        uint256 rentAmount;
        uint256 startDate;
        uint256 endDate;
    }

    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => Agreement) public agreements;

    event PropertyMinted(uint256 tokenId, address owner, string tokenURI);
    event AgreementCreated(uint256 propertyId, address landlord, address tenant, uint256 rentAmount, uint256 startDate, uint256 endDate);
    event RentPaid(uint256 propertyId, uint256 amount, address tenant);
    event RentPaidWithToken(uint256 propertyId, uint256 amount, address tenant);

    constructor(address tokenAddress) ERC721("RentalProperty", "RENT") {
        paymentToken = IERC20(tokenAddress);
    }

    // Mint a new rental property NFT
    function mintProperty(address to, string memory tokenURI) external onlyOwner returns (uint256) {
        uint256 tokenId = nextTokenId;
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        nextTokenId++;
        emit PropertyMinted(tokenId, to, tokenURI);
        return tokenId;
    }

    function _setTokenURI(uint256 tokenId, string memory tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = tokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    // Create a rental agreement
    function createAgreement(
        address tenant,
        uint256 propertyId,
        uint256 rentAmount,
        uint256 startDate,
        uint256 endDate
    ) external {
        require(ownerOf(propertyId) == msg.sender, "Caller is not the property owner");
        agreements[propertyId] = Agreement({
            landlord: msg.sender,
            tenant: tenant,
            propertyId: propertyId,
            rentAmount: rentAmount,
            startDate: startDate,
            endDate: endDate
        });
        emit AgreementCreated(propertyId, msg.sender, tenant, rentAmount, startDate, endDate);
    }

    // Pay rent in Ether
    function payRent(uint256 propertyId) external payable {
        Agreement storage agreement = agreements[propertyId];
        require(msg.sender == agreement.tenant, "Caller is not the tenant");
        require(msg.value == agreement.rentAmount, "Incorrect rent amount");
        payable(agreement.landlord).transfer(msg.value);
        emit RentPaid(propertyId, msg.value, msg.sender);
    }

    // Pay rent with ERC20 token
    function payRentWithToken(uint256 propertyId, uint256 amount) external {
        Agreement memory agreement = agreements[propertyId];
        require(msg.sender == agreement.tenant, "Caller is not the tenant");
        require(amount >= agreement.rentAmount, "Incorrect rent amount");
        require(paymentToken.transferFrom(msg.sender, agreement.landlord, amount), "Token transfer failed");
        emit RentPaidWithToken(propertyId, amount, msg.sender);
    }
}
