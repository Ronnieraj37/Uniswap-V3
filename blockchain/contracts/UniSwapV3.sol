// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/swap-router-contracts/contracts/interfaces/ISwapRouter02.sol";
import "@uniswap/swap-router-contracts/contracts/interfaces/IV3SwapRouter.sol";

contract UniSwapV3 {
    error No_Amount_Given();
    error InputOutputSame(address input);
    error Swap_Pair_Inexistent();
    error TokenAlreadyExists();
    error Pool_Fee_Given_Zero();

    ISwapRouter02 public swapRouter =
        ISwapRouter02(0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E);

    // 2 layer mapping
    mapping(address => mapping(address => uint24)) public swapFees;

    constructor() {
        addToken(
            0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14,
            0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984,
            3000
        ); // weth/uniswap
        addToken(
            0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14,
            0x9a9Fb542C04A90028ed07F9eE7267AceD495573e,
            500
        ); // weth/mocktoken
        addToken(
            0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984,
            0x9a9Fb542C04A90028ed07F9eE7267AceD495573e,
            3000
        ); // uniswap/mocktoken
    }

    function addToken(address TokenA, address TokenB, uint24 poolFee) public {
        if (poolFee == 0) revert Pool_Fee_Given_Zero();
        if (swapFees[TokenA][TokenB] != 0) revert TokenAlreadyExists();
        swapFees[TokenA][TokenB] = poolFee;
        swapFees[TokenB][TokenA] = poolFee;
    }

    function swapTokenInputSingle(
        uint256 amountIn,
        address input,
        address output
    ) external returns (uint amountOut) {
        if (amountIn == 0) revert No_Amount_Given();
        if (input == output) revert InputOutputSame(input);
        uint24 swapFee = swapFees[input][output];
        // swapFee = swapFees[input][output] + swapFees[output][input]
        if (swapFee == 0) revert Swap_Pair_Inexistent();
        TransferHelper.safeTransferFrom(
            input,
            msg.sender,
            address(this),
            amountIn
        );

        TransferHelper.safeApprove(input, address(swapRouter), amountIn);

        IV3SwapRouter.ExactInputSingleParams memory params = IV3SwapRouter
            .ExactInputSingleParams({
                tokenIn: input,
                tokenOut: output,
                fee: swapFee,
                recipient: msg.sender,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        amountOut = swapRouter.exactInputSingle(params);
    }

    function swapTokenOutputSingle(
        address input,
        address output,
        uint256 amountOut,
        uint256 amountInMaximum
    ) external returns (uint256 amountIn) {
        if (amountIn == 0) revert No_Amount_Given();
        if (input == output) revert InputOutputSame(input);
        uint24 swapFee = swapFees[input][output] + swapFees[output][input];
        if (swapFee == 0) revert Swap_Pair_Inexistent();

        TransferHelper.safeTransferFrom(
            input,
            msg.sender,
            address(this),
            amountInMaximum
        );

        TransferHelper.safeApprove(input, address(swapRouter), amountInMaximum);

        IV3SwapRouter.ExactOutputSingleParams memory params = IV3SwapRouter
            .ExactOutputSingleParams({
                tokenIn: input,
                tokenOut: output,
                fee: swapFee,
                recipient: msg.sender,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96: 0
            });

        amountIn = swapRouter.exactOutputSingle(params);

        if (amountIn < amountInMaximum) {
            TransferHelper.safeApprove(input, address(swapRouter), 0);
            TransferHelper.safeTransfer(
                input,
                msg.sender,
                amountInMaximum - amountIn
            );
        }
    }
}
