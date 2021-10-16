const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const SquareVerifier = artifacts.require('SquareVerifier');
const fs = require('fs');

contract("SolnSquareVerifier", (accounts) => {

    describe("Test SolnSquareVerifier", () => {
        beforeEach(async () => {
            const squareVerifier = await SquareVerifier.new({from: accounts[0]});
            this.contract = await SolnSquareVerifier.new("Name", "Symbol", squareVerifier.address, {from: accounts[0]});

            const file = fs.readFileSync("../zokrates/code/square/proof.json").toString();
            const proofObj = JSON.parse(file);
            const { proof, inputs } = proofObj;
            this.proof = proof;
            this.inputs = inputs;
        });
        // Test if a new solution can be added for contract - SolnSquareVerifier
        it("should add new solution for contract ", async () => {
            const { a, b, c } = this.proof;
            await this.contract.addSolution(a, b, c, this.inputs);
            const solutionCount = await this.contract.solutionCount.call();
            assert.equal(solutionCount.toNumber(), 1);
        });

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it("should mint ERC721 successfully", async () => {
            const { a, b, c } = this.proof;
            const tokenId = 1;
            const to = accounts[0];

            await this.contract.mint(a, b, c, this.inputs, tokenId, to);
            const tokenOwner = await this.contract.ownerOf(tokenId);
            assert.equal(tokenOwner, to);
        });

    })
})