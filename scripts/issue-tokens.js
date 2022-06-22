const DigitalBank = artifacts.require('DigitalBank');

module.exports = async function issueRewards(callback) {
    let digitalBank = await DigitalBank.deployed();
    await digitalBank.issueTokens();
    console.log("Tokens have been issued successfully");
    callback();
}