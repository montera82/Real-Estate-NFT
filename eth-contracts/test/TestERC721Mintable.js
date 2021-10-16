var EdwinTopEstateERC721Token = artifacts.require('EdwinTopEstateERC721Token');

contract('EdwinTopEstateERC721Token', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await EdwinTopEstateERC721Token.deployed();
        })

        it('should return total supply', async function () { 
            await this.contract.mint(account_one, 1, { from : account_one });
            await this.contract.mint(account_one, 2, { from : account_one });

            const totalSupply = await this.contract.totalSupply();
            assert.equal(totalSupply.toNumber(), 2, "Total supply does not match");
        })

        it('should get token balance', async function () { 
            const balance = await this.contract.balanceOf(account_one);
            assert.equal(balance.toNumber(), 2, "Balance does not match");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            const uri = await this.contract.tokenURI(1);
            assert.equal(uri, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", "Token URI should match" );
        })

        it('should transfer token from one owner to another', async function () { 
            const account_three = accounts[3];
            const tokenId = 3;
            await this.contract.mint(account_three, tokenId, {from: account_one});
            await this.contract.transferFrom(account_three, account_two, tokenId , { from : account_three});
            const owner = await this.contract.ownerOf(tokenId);

            assert.equal(owner, account_two, "Account 2 should be owner");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await EdwinTopEstateERC721Token.deployed();
        })

        it('should fail when minting when address is not contract owner', async function () { 
            try {
                await this.contract.mint(account_two, 4, {from : account_two});
            } catch (error) {
                assert.include(error.message, "revert Only owner allowed");
            }
        })

        it('should return contract owner', async function () { 
            const owner = await this.contract.owner();

            assert.equal(owner, account_one, "owner should be account 1");
        })

    });
})