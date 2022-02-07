pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract MyMemeCoin is ERC20,Ownable,ERC20Burnable{
    event tokenminted(uint amount);
    event tokenburned(uint amount);
    constructor()ERC20("MyMemeCoin","MMC"){
        _mint(msg.sender,1000*10**decimals());//decimals()==18
        emit tokenminted(1000*10**decimals());
    }
    function mintToken(uint _amount)public onlyOwner {
        _mint(msg.sender,_amount);
        emit tokenminted(_amount);
    }
    function burn(uint _amount)public override onlyOwner{
        _burn(msg.sender,_amount);
        emit tokenburned(_amount);
    }
}
