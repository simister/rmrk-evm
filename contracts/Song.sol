// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.18;

import { RMRKNestableMultiAsset } from "@rmrk-team/evm-contracts/contracts/RMRK/nestable/RMRKNestableMultiAsset.sol";
import { RMRKSoulbound } from "@rmrk-team/evm-contracts/contracts/RMRK/extension/soulbound/RMRKSoulbound.sol";
import { RMRKCore } from "@rmrk-team/evm-contracts/contracts/RMRK/core/RMRKCore.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

error DestinationZeroAddress();
error DestinationIdZero();
error AmountZero();

contract Song is RMRKNestableMultiAsset, RMRKSoulbound, Ownable {
    uint256 public totalSupply;
    uint64 public numberOfAssets;

    constructor(
        string memory name_,
        string memory symbol_
    ) RMRKNestableMultiAsset(name_, symbol_) {}

    function nestMint(
        address to,
        uint256 destinationId,
        uint256 amount
    ) public onlyOwner {
        if (to == address(0)) revert DestinationZeroAddress();
        if (destinationId == 0) revert DestinationIdZero();
        if (amount == 0) revert AmountZero();

        uint256 nextTokenId = totalSupply + 1;
        unchecked {
            totalSupply += amount;
        }
        uint256 totalSupplyOffset = totalSupply + 1;

        for (uint256 i = nextTokenId; i < totalSupplyOffset; ) {
            _nestMint(to, i, destinationId, "");
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
        uint64[] memory assetIds
    ) public onlyOwner {
        for (uint256 i = 0; i < tokenIds.length; ) {
            for (uint256 j = 0; j < assetIds.length; ) {
                _addAssetToToken(tokenIds[i], assetIds[j], 0);

                if (ownerOf(tokenIds[i]) == msg.sender) {
                    uint256 assetIndex = getPendingAssets(tokenIds[i]).length -
                        1;
                    acceptAsset(tokenIds[i], assetIndex, assetIds[j]);
                }

                unchecked {
                    j++;
                }
            }

            unchecked {
                i++;
            }
        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(RMRKCore, RMRKSoulbound) {
        RMRKSoulbound._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(RMRKSoulbound, RMRKNestableMultiAsset)
        returns (bool)
    {
        return
            RMRKSoulbound.supportsInterface(interfaceId) ||
            super.supportsInterface(interfaceId);
    }
}
