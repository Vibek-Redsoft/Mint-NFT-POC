/* eslint-disable react/jsx-no-target-blank */
import { useEffect, useState } from "react";
import {
	connectWallet,
	getCurrentWalletConnected,
	mintNFT,
} from "./util/interact.js";

const Minter = (props) => {
	const [url, setURL] = useState("");
	const [name, setName] = useState("");
	const [status, setStatus] = useState("");
	const [walletAddress, setWallet] = useState("");
	const [description, setDescription] = useState("");

	useEffect(() => {
		(async function requestCurrentWalletConnection() {
			const { address, status } = await getCurrentWalletConnected();
			setWallet(address);
			setStatus(status);
			addWalletListener();
		})();
	}, []);

	function addWalletListener() {
		if (window.ethereum) {
			window.ethereum.on("accountsChanged", (accounts) => {
				if (accounts.length > 0) {
					setWallet(accounts[0]);
					setStatus("👆🏽 Write a message in the textfield above");
				} else {
					setWallet("");
					setStatus("🦊 Connect to Metamask using the top right button");
				}
			});
		} else {
			setStatus(
				<p>
					{" "}
					🦊{" "}
					<a target="_blank" href={`https://metamask.io/download.html`}>
						You must install Metamask
					</a>
				</p>
			);
		}
	}

	const connectWalletPressed = async () => {
		const walletResponse = await connectWallet();
		setStatus(walletResponse.status);
		setWallet(walletResponse.address);
	};

	const onMintPressed = async () => {
		const { success, status } = await mintNFT(url, name, description);
		setStatus(status);
		if (success) {
			setURL("");
			setName("");
			setDescription("");
		}
	};

	return (
		<div className="Minter">
			<button id="walletButton" onClick={connectWalletPressed}>
				{walletAddress.length > 0 ? (
					"Connected: " +
					String(walletAddress).substring(0, 6) +
					"..." +
					String(walletAddress).substring(38)
				) : (
					<span>Connect Wallet</span>
				)}
			</button>

			<br></br>
			<h1 id="title">🧙‍♂️ Alchemy NFT Minter</h1>
			<p>
				Simply add your asset's link, name, and description, then click Mint NFT
			</p>
			<form>
				<h2>Link to asset </h2>
				<input
					type="text"
					placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
					onChange={(event) => setURL(event.target.value)}
				/>
				<h2>Name </h2>
				<input
					type="text"
					placeholder="e.g. My first NFT"
					onChange={(event) => setName(event.target.value)}
				/>
				<h2> Description </h2>
				<input
					type="text"
					placeholder="e.g. Even cooler than cryptokitties"
					onChange={(event) => setDescription(event.target.value)}
				/>
			</form>
			<button id="mintButton" onClick={onMintPressed}>
				Mint NFT
			</button>
			<p id="status" style={{ color: "red" }}>
				{status}
			</p>
		</div>
	);
};

export default Minter;
