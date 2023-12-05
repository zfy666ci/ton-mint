const { TonClient, WalletContractV4, internal } = require("@ton/ton");
const { mnemonicToPrivateKey } = require("@ton/crypto");

// Create Client
const client = new TonClient({
    endpoint:
        "https://ton.access.orbs.network/44A2c0ff5Bd3F8B62C092Ab4D238bEE463E644A2/1/mainnet/toncenter-api-v2/jsonRPC",
});


let mnemonic = "这里写你的注记词";
const num = 10000;

async function main() {
    const mnemonics = mnemonic.split(" ");
    let keyPair = await mnemonicToPrivateKey(mnemonics);
    let workchain = 0;
    let wallet = WalletContractV4.create({
        workchain,
        publicKey: keyPair.publicKey,
    });
    let contract = client.open(wallet);

    let v = []


    for (let i = 0; i < 4; i++) {
        v.push(internal({
            to: `EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c`,
            value: "0",
            body: `data:application/json,{"p":"ton-20","op":"mint","tick":"nano","amt":"100000000000"}`
        }))

    }
    let count = 0
 
    for (let i = 0; i < 10000; i++) {
        try {
            let seqno = await contract.getSeqno();
            console.log(seqno)
            let transfer = await contract.sendTransfer({
                seqno: seqno,
                secretKey: keyPair.secretKey,
                validUntil: Math.floor(Date.now() / 1e3) + 600,
                messages: v,
            });
            console.log(transfer)
            count++
            console.log(`第${count}次成功`);

        } catch (error) {

        }


    }

}

main();
