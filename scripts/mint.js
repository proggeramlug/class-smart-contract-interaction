require('dotenv').config();
const { API_URL, PUBLIC_KEY, PRIVATE_KEY } = process.env;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contractAbi = require("../abi.json");
const contractAddress = "0x3b122a12344cBcebCf0ED3bd1b27C2B3174759BF";

const contract = new web3.eth.Contract(contractAbi, contractAddress);

async function main() {
    const weiAmount = web3.utils.toWei('100', 'ether');
    let nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest");
    const tx = {
        from: PUBLIC_KEY,
        to: contractAddress,
        nonce: nonce,
        gas: 6000000,
        maxPriorityFeePerGas: 10000,
        data: contract.methods.mint(weiAmount).encodeABI()
    };

    web3.eth.accounts.signTransaction(tx, PRIVATE_KEY).then(signedTx => {
        web3.eth.sendSignedTransaction(
            signedTx.rawTransaction,
            function(err, hash) {
                if (err) {
                    console.log("error: ", err);
                }
                else {
                    console.log("transaction: ", hash);
                }
            }
        )
    }).catch (err => {
        console.log("error: ", err);
    })
}
main().catch (error => {
    console.log("error: ", error);

})