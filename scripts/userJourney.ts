import { ethers } from 'hardhat';

async function main() {
  console.log('Getting signers.');

  const [owner, user] = await ethers.getSigners();

  console.log(`Owner: ${owner.address}`);
  console.log(`User: ${user.address}`);

  console.log('Deploying the smart contracts');

  const Album = await ethers.getContractFactory('Album');
  const Song = await ethers.getContractFactory('Song');

  const album = await Album.deploy('Album', 'ALB', 10000);
  await album.deployed();

  const song = await Song.deploy('Song', 'SNG');
  await song.deployed();

  console.log(`Album smart contract deployed to ${album.address}.`);
  console.log(`Song smart contract deployed to ${song.address}.`);

  console.log('Minting Album NFTs.');

  await album.mint(owner.address, 2);
  await album.mint(user.address, 1);

  console.log(`Album balance of owner: ${await album.balanceOf(owner.address)}`);
  console.log(`Album balance of user: ${await album.balanceOf(user.address)}`);

  console.log('Adding asset entries to the Album smart contract.');

  await album.addAssetEntry('ipfs://artwork');
  await album.addAssetEntry('ipfs://metadata');

  console.log('Adding asset entries to the Album smart contracts.');

  await album.addAssetEntry('ipfs://artwork');
  await album.addAssetEntry('ipfs://metadata');

  console.log('Adding assets to the Album NFTs');

  await album.addAssetToTokens([1, 2, 3], 1);
  await album.addAssetToTokens([1, 2, 3], 2);

  console.log(`Active assets of Album NFT 1: ${(await album.getActiveAssets(1)).length}`);
  console.log(`Pending assets of Album NFT 1: ${(await album.getPendingAssets(1)).length}`);

  console.log(`Active assets of Album NFT 2: ${(await album.getActiveAssets(2)).length}`);
  console.log(`Pending assets of Album NFT 2: ${(await album.getPendingAssets(2)).length}`);

  console.log(`Active assets of Album NFT 3: ${(await album.getActiveAssets(3)).length}`);
  console.log(`Pending assets of Album NFT 3: ${(await album.getPendingAssets(3)).length}`);

  console.log('Accepting assets for Album NFT 3');

  await album.connect(user).acceptAsset(3, 0, 1);
  await album.connect(user).acceptAsset(3, 0, 2);

  console.log(`Active assets of Album NFT 3: ${(await album.getActiveAssets(3)).length}`);
  console.log(`Pending assets of Album NFT 3: ${(await album.getPendingAssets(3)).length}`);

  console.log('Minting Song NFTs into Album NFTs');

  await song.nestMint(album.address, 1, 3);
  await song.nestMint(album.address, 2, 3);
  await song.nestMint(album.address, 3, 3);

  console.log(`Active child tokens of Album NFT 1: ${(await album.childrenOf(1)).length}`);
  console.log(`Pending child tokens of Album NFT 1: ${(await album.pendingChildrenOf(1)).length}`);
  console.log(`Active child tokens of Album NFT 2: ${(await album.childrenOf(2)).length}`);
  console.log(`Pending child tokens of Album NFT 2: ${(await album.pendingChildrenOf(2)).length}`);
  console.log(`Active child tokens of Album NFT 3: ${(await album.childrenOf(3)).length}`);
  console.log(`Pending child tokens of Album NFT 3: ${(await album.pendingChildrenOf(3)).length}`);

  console.log('Accepting child tokens for Album NFTs');

  await album.acceptChild(1, 0, song.address, 1);
  await album.acceptChild(1, 0, song.address, 3);
  await album.acceptChild(1, 0, song.address, 2);
  await album.acceptChild(2, 0, song.address, 4);
  await album.acceptChild(2, 0, song.address, 6);
  await album.acceptChild(2, 0, song.address, 5);
  await album.connect(user).acceptChild(3, 0, song.address, 7);
  await album.connect(user).acceptChild(3, 0, song.address, 8);
  await album.connect(user).acceptChild(3, 0, song.address, 9);

  console.log(`Active child tokens of Album NFT 1: ${(await album.childrenOf(1)).length}`);
  console.log(`Pending child tokens of Album NFT 1: ${(await album.pendingChildrenOf(1)).length}`);
  console.log(`Active child tokens of Album NFT 2: ${(await album.childrenOf(2)).length}`);
  console.log(`Pending child tokens of Album NFT 2: ${(await album.pendingChildrenOf(2)).length}`);
  console.log(`Active child tokens of Album NFT 3: ${(await album.childrenOf(3)).length}`);
  console.log(`Pending child tokens of Album NFT 3: ${(await album.pendingChildrenOf(3)).length}`);

  console.log('Adding asset entries to the Song smart contract.');

  await song.addAssetEntry('ipfs://audio1');
  await song.addAssetEntry('ipfs://metadata1');
  await song.addAssetEntry('ipfs://lyrics1');
  await song.addAssetEntry('ipfs://audio2');
  await song.addAssetEntry('ipfs://metadata2');
  await song.addAssetEntry('ipfs://lyrics2');
  await song.addAssetEntry('ipfs://audio3');
  await song.addAssetEntry('ipfs://metadata3');
  await song.addAssetEntry('ipfs://lyrics3');

  console.log('Adding assets to the Song NFTs');

  await song.addAssetToTokens([1, 4, 7], [1, 2, 3]);
  await song.addAssetToTokens([2, 5, 8], [4, 5, 6]);
  await song.addAssetToTokens([3, 6, 9], [7, 8, 9]);

  console.log(`Active assets of Song NFT 1: ${(await song.getActiveAssets(1)).length}`);
  console.log(`Pending assets of Song NFT 1: ${(await song.getPendingAssets(1)).length}`);
  console.log(`Active assets of Song NFT 4: ${(await song.getActiveAssets(4)).length}`);
  console.log(`Pending assets of Song NFT 4: ${(await song.getPendingAssets(4)).length}`);
  console.log(`Active assets of Song NFT 7: ${(await song.getActiveAssets(7)).length}`);
  console.log(`Pending assets of Song NFT 7: ${(await song.getPendingAssets(7)).length}`);

  console.log('Accepting assets for the Song NFTs not belonging to the user.');

  await song.connect(user).acceptAsset(7, 0, 1);
  await song.connect(user).acceptAsset(7, 0, 2);
  await song.connect(user).acceptAsset(7, 0, 3);
  await song.connect(user).acceptAsset(8, 0, 4);
  await song.connect(user).acceptAsset(8, 0, 5);
  await song.connect(user).acceptAsset(8, 0, 6);
  await song.connect(user).acceptAsset(9, 0, 7);
  await song.connect(user).acceptAsset(9, 0, 8);
  await song.connect(user).acceptAsset(9, 0, 9);

  console.log(`Active assets for Song NFT 1: ${(await song.getActiveAssets(1)).length}`);
  console.log(`Pending assets for Song NFT 1: ${(await song.getPendingAssets(1)).length}`);
  console.log(`Active assets for Song NFT 4: ${(await song.getActiveAssets(4)).length}`);
  console.log(`Pending assets for Song NFT 4: ${(await song.getPendingAssets(4)).length}`);
  console.log(`Active assets for Song NFT 7: ${(await song.getActiveAssets(7)).length}`);
  console.log(`Pending assets for Song NFT 7: ${(await song.getPendingAssets(7)).length}`);

  console.log('Observing the child-parent relationship.');

  console.log(`Children of Album NFT 1: ${await album.childrenOf(1)}`);
  console.log(`Children of Album NFT 2: ${await album.childrenOf(2)}`);
  console.log(`Children of Album NFT 3: ${await album.childrenOf(3)}`);

  console.log(`Parent of Album NFT 1: ${await album.directOwnerOf(1)}`);
  console.log(`Parent of Song NFT 1: ${await song.directOwnerOf(1)}`);
  console.log(`Parent of Song NFT 4: ${await song.directOwnerOf(4)}`);
  console.log(`Parent of Song NFT 7: ${await song.directOwnerOf(7)}`);

  console.log(`Owner of Song NFT 1: ${await song.directOwnerOf(1)}`);
  console.log(`Owner of Song NFT 4: ${await song.directOwnerOf(4)}`);
  console.log(`Owner of Song NFT 7: ${await song.directOwnerOf(7)}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
