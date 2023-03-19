import { delay } from '@nomiclabs/hardhat-etherscan/dist/src/etherscan/EtherscanService';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { run } from 'hardhat';
import { Album, Song } from '../typechain-types';
import { Wallet, utils } from 'zksync-web3';
import * as ethers from 'ethers';

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log('Deploying Album smart contract.');
  const wallet = new Wallet(process.env.PRIVATE_KEY || '');
  const deployer = new Deployer(hre, wallet);

  const albumArtifact = await deployer.loadArtifact('Album');
  const albumArgs = ['Album', 'ALB', 10000];
  const albumDeploymentFee = await deployer.estimateDeployFee(albumArtifact, albumArgs);

  const albumDepositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: utils.ETH_ADDRESS,
    amount: albumDeploymentFee,
  });

  await albumDepositHandle.wait();

  const parsedAlbumFee = ethers.utils.formatEther(albumDeploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedAlbumFee} ETH`);

  const album = <Album>await deployer.deploy(albumArtifact, albumArgs);

  await album.deployed();
  console.log(`Album smart contract deployed to ${album.address}`);

  console.log('Deploying Song smart contract.');
  const songArtifact = await deployer.loadArtifact('Song');
  const songArgs = ['Song', 'SNG'];
  const songDeploymentFee = await deployer.estimateDeployFee(songArtifact, songArgs);
  const songDepositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: utils.ETH_ADDRESS,
    amount: albumDeploymentFee,
  });

  await songDepositHandle.wait();

  const parsedSongFee = ethers.utils.formatEther(songDeploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedSongFee} ETH`);

  const song = <Song>await deployer.deploy(songArtifact, songArgs);

  await song.deployed();
  console.log(`Song smart contract deployed to ${song.address}.`);

  await delay(20000);
  console.log('Verifying smart contracts.');

  await run(`verify:verify`, {
    address: album.address,
    constructorArguments: albumArgs,
    contract: 'contracts/Album.sol:Album',
  });

  await run(`verify:verify`, {
    address: song.address,
    constructorArguments: songArgs,
    contract: 'contracts/Song.sol:Song',
  });
}
