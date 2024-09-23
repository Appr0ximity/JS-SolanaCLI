const { createMint, TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount, mintTo } = require("@solana/spl-token")
const { Connection, clusterApiUrl, PublicKey, Keypair } = require("@solana/web3.js")

const connection = new Connection(clusterApiUrl('devnet'))

//airdrop
async function airdrop(publicKey, amount){
    const sign = await connection.requestAirdrop(new PublicKey(publicKey), amount)
    await connection.confirmTransaction({signature: sign})
}

//get balance
async function getBalance(publicKey){
    const bal = await connection.getBalance(new PublicKey (publicKey))
    console.log(bal)
}

const payer = Keypair.fromSecretKey(Uint8Array.from()) //add private key array inside from()
const mintAuthority = payer

//create token mint
async function createTokenMint(publicKey) {
    const mint = await createMint(
        connection, //establish JSON RPC connection
        payer, //payer of the transaction cost
        mintAuthority, //account with authority to mint token
        null, // account with authority to freeze the token (optional)
        9, //decimal
        TOKEN_PROGRAM_ID //executable ID with smart contract to create tokens
    )
    console.log(mint.toBase58P())
}

//mint new tokens

async function mintNewTokens(mint, toPublicKey, amount) {
    const ata = await getOrCreateAssociatedTokenAccount( //associated token account
        connection,
        payer,
        mint,
        new PublicKey(toPublicKey)
    )

    console.log("ATA created ", ata.address.toBase58())

    await mintTo(
        connection,
        payer,
        mint,
        ata.address,
        payer,
        amount
    )

    console.log(amount+": tokens minted to account: "+ata.address.toBase58())
}