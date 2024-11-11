import { ethers } from "ethers";

const createAgreementAndPayRent = async(property, startDate, endDate) => {
    const startTime = Math.floor(new Date(startDate.getTime()/1000));
    const endTime = Math.floor(new Date(endDate.getTime()/1000));
    const contract = await contractInstance();
    const totalAmount = (endDate-startDate+1)*property.pricePerDay+ property.depositAmount;
    const totalAmountInWei = ethers.parseEther(rentAmount);
    await contract.createAgreementAndPayRent(property.propertyId, startTime, endTime, {value: totalAmountInWei});
    const agreement = await contract.getAgreement(property.propertyId);
    return agreement;

}