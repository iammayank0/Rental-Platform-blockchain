import { AlchemyProvider, ethers } from 'ethers';
import { abi } from '../../contract/abi.json';
import { Contract, Wallet, BrowserProvider } from 'ethers';


const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });


const provider = new AlchemyProvider();
const wallet = new Wallet(process.env.WALLET_PRIVATE_KEY, provider);
const contract = new Contract(contractAddress, abi, wallet);

export async function mintProperty(tokenURI, pricePerUnitTime, minimumTime, maximumTime, depositAmount) {
    const tx = await contract.mintProperty(tokenURI, pricePerUnitTime, minimumTime, maximumTime, depositAmount);
    await tx.wait();
}

export async function createAgreementAndPayRent(tokenId, startTimestamp, endTimestamp){
    const tx = await contract.createAgreementAndPayRent(tokenId, startTimestamp, endTimestamp);
    await tx.wait();
}


export async function refundDeposit(tokenId, deductionAmount){
    const tx = await contract.refundDeposit(tokenId, deductionAmount);
    tx.wait();
}

