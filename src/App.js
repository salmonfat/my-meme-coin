import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";
import abi from "./contract/MyMemeCoin.json";
import './App.css';

function App() {
  const [isWallectConnect,setWallectConnet]=useState(false);
  const [inputValue,setInPutValue]=useState({walletAddress:"",transferAmount:"",burnAmount:"",mintAmount:""});
  const [tokenName,setTokenName]=useState("");
  const [tokenSymbol,setTokenSymbol]=useState("");
  const [tokenTotalSupply,setTokenTotalSupply]=useState(0);
  const [tokenOwnerAddress,setTokenOwnerAddress]=useState(null);
  const [yourWalletAddress,setYourWalletAddress]=useState(null);
  const [isTokenOwner,setIsTokenOwner]=useState(false);
  const [error,setError]=useState(null);

  const contractAddress='0x02F239fd3b8eaa069E7f754d82f58C4252e3c014';
  const contractABI=abi.abi;
  
  const checkWalletConnect=async()=>{
    try{
      if (window.ethereum){
      const accounts=await window.ethereum.request({method: 'eth_requestAccounts'})
      const account = accounts[0];
      setWallectConnet(true);
      setYourWalletAddress(account);
      console.log("Account Connected: ", account);
    }else{
      setError("Install a MetaMask wallet to get our token.");
      console.log("No Metamask detected");
      }
    }catch(error){
      console.log(error);
    }
  }
  const getTokenInfo=async()=>{
    try{
      if(window.ethereum){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(contractAddress, contractABI, signer);
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        let tokenName=await tokenContract.name();
        let tokenSymbol=await tokenContract.symbol();
        let tokenTotalSupply=await tokenContract.totalSupply();
        let tokenOwner= await tokenContract.owner();
        tokenTotalSupply= utils.formatEther(tokenTotalSupply);
        setTokenName(tokenName);
        setTokenSymbol(tokenSymbol);
        setTokenTotalSupply(tokenTotalSupply);
        setTokenOwnerAddress(tokenOwner);
        if (account.toLowerCase()===tokenOwner.toLowerCase()){
          setIsTokenOwner(true);
        }
      }
    }catch(error){
      console.log(error);
    }
  }
  const transferToken=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn=await tokenContract.transfer(inputValue.walletAddress, utils.parseEther(inputValue.transferAmount));
        console.log("transfering token");
        await txn.wait();
        console.log("transfered done",txn.hash);
      }else{
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet to get our token.");
      }
    }catch(error){
      console.log(error);
    }
  }
  const burnToken=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn=await tokenContract.burn( utils.parseEther(inputValue.burnAmount));
        console.log("burning token");
        await txn.wait();
        console.log("burned done",txn.hash);
        let tokenTotalSupply=await tokenContract.totalSupply();
        tokenTotalSupply= utils.formatEther(tokenTotalSupply);
        setTokenTotalSupply(tokenTotalSupply);
      }else{
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet to get our token.");
      }
    }catch(error){
      console.log(error);
    }
  }
  const mintToken=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn=await tokenContract.mintToken( utils.parseEther(inputValue.mintAmount));
        console.log("minting token");
        await txn.wait();
        console.log("minted done",txn.hash);
        let tokenTotalSupply=await tokenContract.totalSupply();
        tokenTotalSupply= utils.formatEther(tokenTotalSupply);
        setTokenTotalSupply(tokenTotalSupply);
      }else{
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet to get our token.");
      }
    }catch(error){
      console.log(error);
    }
  }
  const handleInputChange = (event) => {
    setInPutValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  }
  useEffect(() => {
    checkWalletConnect();
    getTokenInfo();
  }, [])

  return (
    <main>
      {error &&<p>{error}</p>}
      <h2>My Meme Coin DAPP (On Rinkeby network)</h2>
      <div>
        <p>Token name: {tokenName}</p>
        <p>Token synbol: {tokenSymbol}</p>
        <p>Toral token supply: {tokenTotalSupply}</p>
      </div>
      <div>
        <form>
          <input
          type="text"
          onChange={handleInputChange}
          name="walletAddress"
          placeholder="Wallet Address"
          value={inputValue.walletAddress}/>
          <input
          type="text"
          onChange={handleInputChange}
          name="transferAmount"
          placeholder="transfer amount"
          value={inputValue.transferAmount}/>
          <button
              onClick={transferToken}>Transfer</button>
        </form>
      </div>
    <section>
      <div>
        <form>
        <input
          type="text"
          onChange={handleInputChange}
          name="burnAmount"
          placeholder="burn amount"
          value={inputValue.burnAmount}/>
          <button
              onClick={burnToken}>Burn</button><span>(can only be done by the contract owner) </span>
        </form>
      </div>
      <div>
        <form>
        <input
          type="text"
          onChange={handleInputChange}
          name="mintAmount"
          placeholder="mint amount"
          value={inputValue.mintAmount}/>
          <button
              onClick={mintToken}>Mint</button><span>(can only be done by the contract owner) </span>
        </form>
      </div> </section>
      <div><p>contract address:{contractAddress} </p></div>
      <div><p>token owner address:{tokenOwnerAddress} </p></div>
      <div>{isWallectConnect &&(<p>your address:{yourWalletAddress} </p>)}
      {!isWallectConnect &&<button onClick={checkWalletConnect}> connect wallet </button>}
      </div>
    </main>
  );
}

export default App;
