// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract DiscoveryArtToken is ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor (string memory name, string memory symbol) ERC721(name, symbol){}

    struct Item {
        uint256 id;
        address creator;
        string uri;
    }
    
    mapping (uint256 => Item) public Items;

    function createItem(string memory uri) public returns (uint256){
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);

        Items[newItemId] = Item(newItemId, msg.sender, uri);

        return newItemId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

       return Items[tokenId].uri;
    }
}