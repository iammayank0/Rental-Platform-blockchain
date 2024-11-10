import { BrowserProvider } from "ethers";
import { useState } from "react";
export const connectWallet = async () => {
    // const [provider, setProvider] = useState(null);
    // const [signer, setSigner] = useState(null);
    // const [address, setAddress] = useState('');
    // const [account, setAccount] = useState();
    // const [connected, setConnected] = useState(false);

    console.log("tried")
    if(window.ethereum){
        try {
            const provider = new BrowserProvider(window.ethereum);
            // setProvider(provider);
            const signer = provider.getSigner();
            // setSigner(signer);
            const address = (await signer).getAddress();
            // setAddress(address);
            window.ethereum.on("chainChanged", () => {
                window.location.reload()
                });
        
            window.ethereum.on("accountsChanged", () => {
            window.location.reload();

            });
            const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
            console.log(accounts[0]);
            return accounts[0];
            // setAccount(accounts[0]);
            // setConnected(true);
            
        } catch (error) {
            console.error("Error connectin to wallet: ", error);
        }
    }else{
        throw new Error("Install Metamask!");
    }

};