import React, { useState } from 'react'
import {
    Flex,
    Box,
    Text,
    Input,
} from "@chakra-ui/react";
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react';
import { ArrowDownIcon } from '@chakra-ui/icons'
import { useReadContract, useWriteContract } from "wagmi";
import { UniswapABI } from "../abi/UniSwapV3";
import { erc20Abi } from 'viem';
import { useAccount } from 'wagmi';
import { ContractFunctionExecutionError } from "viem"

//react conmponent
function Swap() {

    const [tokenIn, settokenIn] = useState<number>(0);
    const [tokenOut, settokenOut] = useState<number>(1);
    const { address } = useAccount();
    const [Value, setValue] = useState<number>(0);

    const tokenAddress = [
        {
            name: "WETH",
            address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14" as `0x${string}`
        },
        {
            name: "Uniswap",
            address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984" as `0x${string}`
        },
        {
            name: "Mock",
            address: "0x9a9Fb542C04A90028ed07F9eE7267AceD495573e" as `0x${string}`
        }
    ];

    const { writeContractAsync: writeContractApprove } = useWriteContract();
    const { data: swapHash, writeContractAsync: writeContractSwap } = useWriteContract();

    const { data: balanceOfToken } = useReadContract({
        abi: erc20Abi,
        address: tokenAddress[tokenIn].address as `0x${string}`,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
        query: {
            enabled: address !== undefined
        }
    })

    const { data: approvalAmount } = useReadContract({
        abi: erc20Abi,
        address: tokenAddress[tokenIn].address,
        functionName: 'allowance',
        args: [address as `0x${string}`, "0x2541885E9DE789758fFec4397A1a1A387a94722d"],
        query: {
            enabled: address !== undefined
        }
    })

    const approveSwap = async (val: number) => {
        try {
            await writeContractApprove({
                address: tokenAddress[tokenIn].address as `0x${string}`,
                abi: erc20Abi,
                functionName: 'approve',
                args: ["0x2541885E9DE789758fFec4397A1a1A387a94722d", BigInt(val)],
            })
        } catch (e) {
            console.log("Error", e);
        }
    }

    const BuyToken = async () => {
        if (Number(approvalAmount) < Value) {
            await approveSwap(Value);
        }
        else {
            await swapToken();
        }
    }

    const swapToken = async () => {
        try {
            await writeContractSwap({
                abi: UniswapABI,
                address: "0x2541885E9DE789758fFec4397A1a1A387a94722d",
                functionName: 'swapTokenInputSingle',
                args: [BigInt(Value), tokenAddress[tokenIn].address, tokenAddress[tokenOut].address]
            }, {
                onError(e) {
                    if (e instanceof ContractFunctionExecutionError) {
                        console.log(e.shortMessage);
                        console.log(e.cause);
                        console.log(e.details);
                        console.log(e.message);
                    }
                }
            })
        } catch (e) {
        }
    }

    return (
        <Box
            w="30.62rem"
            mx="auto"
            mt="5.25rem"

            borderRadius="1.37rem">
            <Flex
                alignItems="center"
                p="1rem 1.25rem 0.5rem"
                bg="white"
                color="rgb(86, 90, 105)"
                justifyContent="space-between"
                borderRadius="1.37rem 1.37rem 0 0">
                <Text
                    color="black"
                    fontWeight="500">
                    Swap Tokens
                </Text>
            </Flex>

            <Box
                p="0.5rem"
                bg="white"
                borderRadius="0 0 1.37rem 1.37rem">
                <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    bg="rgb(247, 248, 250)"
                    p="1rem 1rem 1.7rem"
                    borderRadius="1.25rem" border="0.06rem solid rgb(237, 238, 242)"
                    _hover={{ border: "0.06rem solid rgb(211,211,211)" }}>

                    <Menu as="div" className="relative z-10 inline-block text-right">
                        <div className=''>
                            <Menu.Button className="flex z-20 items-center justify-center">
                                <div className=' py-2 px-4  bg-[black] text-lg shadow-lg ring-1 ring-gray-600 ring-opacity-5 rounded-xl focus:outline-none'>
                                    {tokenAddress[tokenIn].name}
                                </div>
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-20 mt-2 text-white w-full border-white border-[1px] border-opacity-10 origin-top-right bg-[black] shadow-lg ring-1 ring-gray-600 ring-opacity-5 rounded-xl focus:outline-none">
                                <div className="py-1  flex flex-col items-center justify-center">
                                    {tokenAddress.map((token, index) => {
                                        return (
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        className="hover:bg-[#1e1e1e] border-b-[1px] border-white border-opacity-10 w-full  px-4 py-2 text-sm"
                                                        onClick={() => { settokenIn(index) }}
                                                    >
                                                        {tokenAddress[index].name}
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        )
                                    })}

                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                    <Input
                        className='text-black px-2'
                        placeholder="0.0"
                        fontWeight="500"
                        fontSize="1.5rem"
                        width="100%"
                        size="19rem"
                        textAlign="right"
                        bg="rgb(247, 248, 250)"
                        outline="none"
                        border="none"
                        focusBorderColor="none"
                        type="number"
                        onChange={(e) => {
                            const num = Number(e.target.value);
                            setValue(num)
                        }}
                    />
                    <div className='w-12 mx-8 flex-wrap text-black text-sm'>Balance: {balanceOfToken?.toString()}</div>
                </Flex>

                <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    bg="rgb(247, 248, 250)"
                    pos="relative" p="1rem 1rem 1.7rem"
                    borderRadius="1.25rem"
                    mt="0.25rem"
                    border="0.06rem solid rgb(237, 238, 242)"
                    _hover={{ border: "0.06rem solid rgb(211,211,211)" }}>

                    <Menu as="div" className="relative z-0  inline-block text-right">
                        <div className=''>
                            <Menu.Button className="flex z-10 items-center justify-center">
                                <div className=' py-2 px-4  bg-red-500 text-lg shadow-lg ring-1 ring-gray-600 ring-opacity-5 rounded-xl focus:outline-none'>
                                    {tokenAddress[tokenOut].name}
                                </div>
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-20 mt-2 text-white w-full border-white border-[1px] border-opacity-10 origin-top-right bg-[black] shadow-lg ring-1 ring-gray-600 ring-opacity-5 rounded-xl focus:outline-none">
                                <div className="py-1  flex flex-col items-center justify-center">
                                    {tokenAddress.map((token, index) => {
                                        if (index === tokenIn) return <div></div>
                                        return (
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        className="hover:bg-[#1e1e1e] border-b-[1px] border-white border-opacity-10 w-full  px-4 py-2 text-sm"
                                                        onClick={() => { settokenOut(index) }}
                                                    >
                                                        {tokenAddress[index].name}
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        )
                                    })}

                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                    <Flex
                        alignItems="center"
                        justifyContent="center"
                        bg="white"
                        p="0.18rem"
                        borderRadius="0.75rem"
                        pos="relative"
                        top="-2.37rem"
                        left="2.5rem">
                        <ArrowDownIcon
                            bg="rgb(247, 248, 250)"
                            color="rgb(128,128,128)"
                            h="1.5rem" width="1.62rem"
                            borderRadius="0.75rem"
                        />
                    </Flex>
                    <Box>
                    </Box>
                </Flex>
            </Box>

            <div>
                <button onClick={BuyToken} className='text-white text-xl rounded-xl mt-4 bg-red-600 px-4 py-1'>
                    Buy
                </button>
            </div>

            {swapHash !== undefined && <a href={`https://sepolia.etherscan.io/tx/${swapHash}`} target="_blank" rel="noopener noreferrer">
                <button className='mt-4 text-lg bg-blue-600 rounded-2xl px-3 py-1 '>
                    View on Block Explorer
                </button>
            </a>}
        </Box>
    )
}

export default Swap
