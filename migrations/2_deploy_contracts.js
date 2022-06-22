const Tether = artifacts.require('Tether');
const DappToken = artifacts.require('DappToken');
const DigitalBank = artifacts.require('DigitalBank');

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(Tether);
    const tether = await Tether.deployed();

    await deployer.deploy(DappToken);
    const dappToken = await DappToken.deployed();

    await deployer.deploy(DigitalBank, dappToken.address, tether.address);
    const digitalBank = await DigitalBank.deployed();

    await dappToken.transfer(digitalBank.address, '1000000000000000000000000');
    await tether.transfer(accounts[1], '100000000000000000000');
};
