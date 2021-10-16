pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";

contract SolnSquareVerifier is EdwinTopEstateERC721Token {
    _SquareVerifier squareVerifier;
    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address addr;
    }

    // TODO define an array of the above struct
    Solution[] private solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => bool) uniqueSolution;

    uint256 public solutionCount;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 index);

    constructor(
        string memory name,
        string memory symbol,
        address verifierAddress
    ) public EdwinTopEstateERC721Token("EdwinTop Estate", "EDW") {
        squareVerifier = _SquareVerifier(verifierAddress);
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public {
        bytes32 key = keccak256(abi.encodePacked(a, b, c, input));
        require(uniqueSolution[key] == false, "solution already exists");
        solutions.push(Solution(solutionCount, msg.sender));
        uniqueSolution[key] = true;
        solutionCount++;
        emit SolutionAdded(solutionCount);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mint(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input,
        uint256 tokenId,
        address to
    ) public {
        bool result = squareVerifier.verifyTx(a, b, c, input);

        require(result == true, "Incorrect solution");
        addSolution(a, b, c, input);
        super.mint(to, tokenId);
    }
}

contract _SquareVerifier {
    function verifyTx(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public returns (bool r);
}
