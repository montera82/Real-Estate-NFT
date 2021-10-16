// migrating the appropriate contracts
var SquareVerifier = artifacts.require("./SquareVerifier.sol");
 var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
const EdwinTopEstateERC721Token = artifacts.require("./EdwinTopEstateERC721Token");
module.exports = async function(deployer) {
  await deployer.deploy(SquareVerifier);
  await deployer.deploy(SolnSquareVerifier, "EdwinTop Estate", "EDW", SquareVerifier.address);
  await deployer.deploy(EdwinTopEstateERC721Token, "EdwinTop Estate", "EDW");
};
