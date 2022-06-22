const Tether = artifacts.require('Tether');
const DappToken = artifacts.require('DappToken');
const DigitalBank = artifacts.require('DigitalBank');

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DigitalBank', ([owner, customer]) => {
    let tether, dappToken, digitalBank

    function tokens(number) {
        return web3.utils.toWei(number, 'ether');
    }

    before(async() => {
        tether = await Tether.new();
        dappToken = await DappToken.new();
        digitalBank = await DigitalBank.new(dappToken.address, tether.address);

        await dappToken.transfer(digitalBank.address, tokens('10000000'));
        await tether.transfer(customer, tokens('100'), {from: owner});
    })

    describe('Mock Tether Deployment', async() => {
        it('matches name successfully', async() => {
            const name = await tether.name();
            assert.equal(name, 'Mock Tether');
        })
    })

    describe('Dapp Token Deployment', async() => {
        it('matches name successfully', async() => {
            const name = await dappToken.name();
            assert.equal(name, 'DApp Token');
        })
    })

    describe('Digital Bank Deployment', async() => {
        it('matches name successfully', async() => {
            const name = await digitalBank.name();
            assert.equal(name, 'Digital Bank');
        })

        it('contract has tokens', async () => {
            let balance = await dappToken.balanceOf(digitalBank.address);
            assert.equal(balance, tokens('10000000'))
        })
    })

    describe('Yeild Farming', async() => {
        it('rewards tokens for staking', async() => {
            let balance, result

            balance = await tether.balanceOf(customer);
            assert.equal(balance.toString(), tokens('100'))

            await tether.approve(digitalBank.address, tokens('100'), {from: customer})
            await digitalBank.depositTokens(tokens('100'), {from: customer})

            //Check balance of customer
            balance = await tether.balanceOf(customer);
            assert.equal(balance.toString(), tokens('0'), 'customer mock wallet balance after stacking');

            //Check updated balance of digital bank
            balance = await tether.balanceOf(digitalBank.address);
            assert.equal(balance.toString(), tokens('100'), 'digital bank wallet balance after stacking');

            //Is stating balance
            result = await digitalBank.isStaking(customer);
            assert.equal(result.toString(), 'true', 'customer staking status balance after stacking');

            //Issue tokens
            await digitalBank.issueTokens({from: owner});
            assert.equal(dappToken.balanceOf[customer], tokens('100'));

            //Ensure only the owner can issue tokens
            await digitalBank.issueTokens({from: owner}).should.be.rejected;

            //Unstake tokens
            await digitalBank.unstakeTokens({from: customer});

            //Check balance of customer
            balance = await tether.balanceOf(customer);
            assert.equal(balance.toString(), tokens('100'), 'customer mock wallet balance after stacking');

            //Check updated balance of digital bank
            balance = await tether.balanceOf(digitalBank.address);
            assert.equal(balance.toString(), tokens('0'), 'digital bank wallet balance after stacking');

            //Is stating balance
            result = await digitalBank.isStaking(customer);
            assert.equal(result.toString(), 'false', 'customer staking status balance after stacking');
        })
    })
})