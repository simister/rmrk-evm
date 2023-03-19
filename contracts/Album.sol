// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.18;

import { RMRKNestableMultiAsset } from "@rmrk-team/evm-contracts/contracts/RMRK/nestable/RMRKNestableMultiAsset.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

error MintOverMaxSupply();
error ZeroAddress();
error ZeroAmount();

contract Album is RMRKNestableMultiAsset, Ownable {
    uint256 public totalSupply;
    uint256 public maxSupply;
    uint64 public numberOfAssets;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 maxSupply_
    ) RMRKNestableMultiAsset(name_, symbol_) {
        maxSupply = maxSupply_;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        if (amount == 0) revert ZeroAmount();
        if (to == address(0)) revert ZeroAddress();
        if (totalSupply + amount > maxSupply) revert MintOverMaxSupply();

        uint256 nextTokenId = totalSupply + 1;
        unchecked {
            totalSupply += amount;
        }
        uint256 totalSupplyOffset = maxSupply + 1;

        for (uint256 i = nextTokenId; i < totalSupplyOffset; ) {
            _safeMint(to, i, "");
            unchecked {
                i++;
            }
        }
    }

    function addAssetEntry(string memory metadataURI) public onlyOwner {
        unchecked {
            numberOfAssets++;
        }
        _addAssetEntry(numberOfAssets, metadataURI);
    }

    function addAssetToTokens(
        uint256[] memory tokenIds,
        uint64 assetId
    ) public onlyOwner {
        for (uint256 i = 0; i < tokenIds.length; ) {
            _addAssetToToken(tokenIds[i], assetId, 0);

            if (ownerOf(tokenIds[i]) == msg.sender) {
                uint256 assetIndex = getPendingAssets(tokenIds[i]).length - 1;
                acceptAsset(tokenIds[i], assetIndex, assetId);
            }

            unchecked {
                i++;
            }
        }
    }
}
