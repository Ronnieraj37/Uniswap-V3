// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/swap-router-contracts/contracts/interfaces/ISwapRouter02.sol";
import "@uniswap/swap-router-contracts/contracts/interfaces/IV3SwapRouter.sol";

error No_Amount_Given();
error InputOutputSame(uint256 input);
error OutOfBounds(uint256 input, uint256 output);
error OnlyOwner();
error TokenAlreadyExists();

contract UniSwapV3 {
    ISwapRouter02 public swapRouter =
        ISwapRouter02(0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E);

    address owner;
    uint256 public totalTokens;
    mapping(uint => address) public tokenAddress;
    mapping(address => bool) public tokenExists; // Prevent to add same token

    constructor() {
        owner = msg.sender;
        addToken(0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14);
        addToken(0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984);
    }

    function addToken(address _tokenAddress) public {
        if (msg.sender != owner) revert OnlyOwner();
        if (tokenExists[_tokenAddress]) revert TokenAlreadyExists();

        tokenAddress[totalTokens] = _tokenAddress;
        tokenExists[_tokenAddress] = true;
        totalTokens++;
    }

    function swapTokenInputSingle(
        uint256 amountIn,
        uint256 input,
        uint256 output
    ) external returns (uint amountOut) {
        if (amountIn == 0) revert No_Amount_Given();
        if (input == output) revert InputOutputSame(input);
        if (input >= totalTokens || output >= totalTokens)
            revert OutOfBounds(input, output);
        TransferHelper.safeTransferFrom(
            tokenAddress[input],
            msg.sender,
            address(this),
            amountIn
        );

        TransferHelper.safeApprove(
            tokenAddress[input],
            address(swapRouter),
            amountIn
        );

        IV3SwapRouter.ExactInputSingleParams memory params = IV3SwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenAddress[input],
                tokenOut: tokenAddress[output],
                fee: 3000,
                recipient: msg.sender,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        amountOut = swapRouter.exactInputSingle(params);
    }

    // function swapTokenOutputSingle(
    //     uint256 input,
    //     uint256 output,
    //     uint256 amountOut,
    //     uint256 amountInMaximum
    // ) external returns (uint256 amountIn) {
    //     require(amountInMaximum != 0);
    //     require(input != output);
    //     require(input < erc20.length && output < erc20.length, "Out of Bounds");
    //     TransferHelper.safeTransferFrom(
    //         erc20[input],
    //         msg.sender,
    //         address(this),
    //         amountInMaximum
    //     );

    //     TransferHelper.safeApprove(
    //         erc20[input],
    //         address(swapRouter),
    //         amountInMaximum
    //     );

    //     IV3SwapRouter.ExactOutputSingleParams memory params = IV3SwapRouter
    //         .ExactOutputSingleParams({
    //             tokenIn: erc20[input],
    //             tokenOut: erc20[output],
    //             fee: 3000,
    //             recipient: msg.sender,
    //             amountOut: amountOut,
    //             amountInMaximum: amountInMaximum,
    //             sqrtPriceLimitX96: 0
    //         });

    //     amountIn = swapRouter.exactOutputSingle(params);

    //     if (amountIn < amountInMaximum) {
    //         TransferHelper.safeApprove(erc20[input], address(swapRouter), 0);
    //         TransferHelper.safeTransfer(
    //             erc20[input],
    //             msg.sender,
    //             amountInMaximum - amountIn
    //         );
    //     }
    // }
}
