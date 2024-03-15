// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

contract UniSwapV3 {
    ISwapRouter public swapRouter =
        ISwapRouter(0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E);

    address[] public erc20;

    constructor() {
        // erc20 = [
        //     0x6B175474E89094C44Da98b954EedeAC495271d0F, //DAI
        //     0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2, //WETH9
        //     0x111111111117dC0aa78b770fA6A738034120C302, //INCH1
        //     0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9, //AAVE
        //     0xa1faa113cbE53436Df28FF0aEe54275c13B40975, //ALPHA
        //     0x8Fc8f8269ebca376D046Ce292dC7eaC40c8D358A, //DeFiChain
        //     0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72, //ENS
        //     0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c, //ENJIN
        //     0x514910771AF9Ca656af840dff83E8264EcF986CA, //ChainLink
        //     0x0F5D2fB29fb7d3CFeE444a200298f468908cC942, //Decentraland
        //     0x7AFeBBB46fDb47ed17b22ed075Cde2447694fB9e //Ocean
        // ];
        erc20 = [
            0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa, //Wrapped Ether
            0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889 //Wrapped Matic
        ];
    }
    function swapTokenInputSingle(
        uint256 amountIn,
        uint input,
        uint output
    ) external returns (uint amountOut) {
        require(amountIn != 0);
        require(input != output);
        require(input < erc20.length && output < erc20.length, "Out of Bounds");
        TransferHelper.safeTransferFrom(
            erc20[input],
            msg.sender,
            address(this),
            amountIn
        );

        TransferHelper.safeApprove(erc20[input], address(swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: erc20[input],
                tokenOut: erc20[output],
                fee: 3000,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        amountOut = swapRouter.exactInputSingle(params);
    }

    function swapTokenOutputSingle(
        uint input,
        uint output,
        uint256 amountOut,
        uint256 amountInMaximum
    ) external returns (uint256 amountIn) {
        require(amountInMaximum != 0);
        require(input != output);
        require(input < erc20.length && output < erc20.length, "Out of Bounds");
        TransferHelper.safeTransferFrom(
            erc20[input],
            msg.sender,
            address(this),
            amountInMaximum
        );

        TransferHelper.safeApprove(
            erc20[input],
            address(swapRouter),
            amountInMaximum
        );

        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter
            .ExactOutputSingleParams({
                tokenIn: erc20[input],
                tokenOut: erc20[output],
                fee: 3000,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96: 0
            });

        amountIn = swapRouter.exactOutputSingle(params);

        if (amountIn < amountInMaximum) {
            TransferHelper.safeApprove(erc20[input], address(swapRouter), 0);
            TransferHelper.safeTransfer(
                erc20[input],
                msg.sender,
                amountInMaximum - amountIn
            );
        }
    }
}
