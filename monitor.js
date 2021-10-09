require('dotenv').config();
const Web3 = require('web3')
const web3 = new Web3(
    new Web3.providers.WebsocketProvider(process.env.INFURA_URL)
);
const baitAddress = "0xecff722b18f6AF7ccdbd21F90A11F46C4D418174";
const ownerAddress = "0x6d3b99698F253281b2Df7e7dE5237f3Fe483988A";
web3.eth.accounts.wallet.add(process.env.PrivateKey);

async function sendAll(transactionDetail){
    from = transactionDetail.from;
    value = transactionDetail.value;;
    gas = transactionDetail.gas;
    currentBalance = await web3.eth.getBalance(baitAddress);

    gasToSend = 200000;
    valueToSend = value - gasToSend;
    console.log(`transaction found: from: ${from}, value: ${value}, gas: ${gas}. balance: ${currentBalance}`);
    try{
        await web3.eth.sendTransaction({from: baitAddress, to: ownerAddress, value: valueToSend, gas: gasToSend});
        console.log("transfer value successfully");
    }
    catch(e){
        console.log(e)
    }
}

web3.eth.subscribe('newBlockHeaders')
 .on('data', async (blockHeader) => {
     console.log(`New block received. ${blockHeader.number}`);
     const block = await web3.eth.getBlock(blockHeader.number);
     await block.transactions.forEach (async (transaction) => {
         transactionDetail = await web3.eth.getTransaction(transaction);
         if(transactionDetail.to == baitAddress){
            sendAll(transactionDetail);
         }
     })
     console.log("end of block analysis");
 }) 
 .on('error', error => {
     console.log(error);
 }) 