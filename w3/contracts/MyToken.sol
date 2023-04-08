// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {

    address public owner;
    uint256 public constant INITIAL_SUPPLY = 100;
    uint256 public constant MINT_AMOUNT = 10;

    mapping (address => bool) private alreadyMinted;

    constructor() ERC20("XMMToken","XMM"){
        owner = msg.sender;
        _mint(msg.sender,INITIAL_SUPPLY);
    }

    event Mint(address indexed user, uint256 amount);
    event Burn(address indexed user, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    function mint() external {
        require(!alreadyMinted[msg.sender],"Already minted");

        _mint(msg.sender,MINT_AMOUNT);

        alreadyMinted[msg.sender] = true;

        emit Mint(msg.sender,MINT_AMOUNT);
    }

    function burn(address _user) external onlyOwner {
        uint256 _amount = balanceOf(_user);

        _burn(_user,_amount);

        delete alreadyMinted[_user];

        emit Burn(_user,_amount);
    }

    function _beforeTokenTransfer(
        address _from,
        address _to,
        uint256
    ) internal pure override
    {
        require(
            _from == address(0) || _to == address(0),
            "Transfer not allowed"
        );
    }
}
