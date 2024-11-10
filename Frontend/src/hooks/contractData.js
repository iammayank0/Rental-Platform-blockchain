import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import abi from '../contract/abi.json';
import { Contract, BrowserProvider } from 'ethers';
import { AlchemyProvider } from 'ethers';
import { Wallet } from 'ethers';

// const contractAddress = '0xe12049a66792C836bcE6d0f48093Cef736DF6Baf';
const contractAddress = "0x786e16f3f540Ab980270cffAC9e236E82925Ba83";
// let contract, properties = [];

const contractInstance = async () => {
    try {
        if (window.ethereum) {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, abi, signer);
            console.log("Contract: ", contract);
            return contract;
        }
    } catch (error) {
        console.error(error);
    }
};

const getProperty = async(contractProperty) => {
    const propertyUri = `https://gold-quick-antelope-719.mypinata.cloud/ipfs/${contractProperty[i].tokenUri}`;
    const isAvailable = contractProperty.isAvailable;
    const propertyId = contractProperty.tokenId;
    const owner = contractProperty.owner;
    const property = {
        address: propertyUri.address,
        images: propertyUri.images,
        description: propertyUri.description,
        furnishing: propertyUri.furnishing,
        pricePerDay: propertyUri.pricePerDay,
        depositMoney: propertyUri.depositMoney,
        area: propertyUri.area,
        type: propertyUri.type,
        parking: propertyUri.parking,
        availableFrom: propertyUri.availableFrom,
        availableFor: propertyUri.availableFor,
        minDays: propertyUri.minDays,
        maxDays: propertyUri.maxDays,
        contactNumber: propertyUri.contactNumber,
        isAvailable: isAvailable,
        propertyId: propertyId,
        propertyUri: propertyUri,
        owner: owner,
    }; 
    return property;
}

const getProperties = async () => {
    try {
        const properties = [];
        const contract = await contractInstance();
        console.log(contract);
        const contractProperties = await contract.getProperties();
        console.log(contractProperties)
        const count = await contract.nextTokenId();
        console.log(count)
        // const properties = [];
        for (let i = 0; i < count; i++) {
            const property = await getProperty(contractProperties[i]);
            properties.push(property);
        }
        return properties;
    } catch (error) {
        console.error("Error fetching properties: ", error);
    }
};

const getMyListedProperties = async(accountAddress) => {
    const properties = await getProperties();
    const myListedProperties = properties.filter(property => property.owner === accountAddress);
}

const getMyRentalProperties = async(accountAddress) => {
    const contract = await contractInstance();
    const rentalPropertyIds = await contract.rentalPropertyIds();
    const myRentalProperties = [];
    for(let i=0; i<rentalPropertyIds.length; i++){
        const agreement = await contract.getAgreement();
        if(agreement.tenant===accountAddress){
            const contractProperty = await contract.getProperty(agreement.tokenId);
            const property = await getProperty(contractProperty);
            myRentalProperties.push(property);
        }
    }
}

const getAgreement = async(tokenId) => {
    const contract = await contractInstance();
    const contractAgreement = await contract.getAgreement(tokenId);
    const startTime = new Date(contractAgreement.startTimestamp*1000);
    const endTime = new Date(contractAgreement.endTimestamp*1000);
    let agreement = {
        tokenId: tokenId,
        owner: contractAgreement.owner,
        tenant: agreement.tenant,
        amount: ethers.formatEther(contractAgreement.amount),
        depositAmount: ethers.formatEther(contractAgreement.depositAmount),
        startTime: startTime.toLocaleDateString(),
        endTime: endTime.toLocaleDateString(),

    }

}

export { contractInstance, getProperties, getMyListedProperties, getMyRentalProperties};
