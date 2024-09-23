import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import abi from '../../contract/abi'
import { Contract } from 'ethers';


const useBlockchain = () => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState('');
    const [connected, setConnected] = useState(false);
    // const contractAddress = process.env.CONTRACT_ADDRESS;
    const contractAddress = '0x6F5df1A8F4DEA99a7341038A6795b656a10d1b65';

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    setProvider(provider);
                    const signer = provider.getSigner();
                    console.log((await signer).getAddress());
                    setSigner(signer);
                    const address = (await signer).getAddress();
                    setAccount(address);
                    console.log(account);
                    setConnected(true);
                    
                    window.ethereum.on("chainChanged", () => {
                        window.location.reload()
                      });
              
                      window.ethereum.on("accountsChanged", () => {
                        window.location.reload();
                      });
    
                      const contract = new Contract(
                        contractAddress,
                        abi,
                        signer
                      );
                      setContract(contract);
                      console.log(contract)
                } catch (error) {
                    console.error(error);
                }

            } else {
                alert('Please install MetaMask.');
            }
        };

        init();
    }, []);

     const connectWallet = async () => {
        try {
            console.log("tried")
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
            setConnected(true)
            console.log("done")
        } catch (error) {
            console.error('Error connecting wallet', error);
        }
    };

    return { provider, signer, contract, account, connected, connectWallet };
};

export default useBlockchain;
