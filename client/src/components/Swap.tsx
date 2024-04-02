import React, { useState } from 'react'
import {
    Flex,
    Box,
    Text,
    Input
} from "@chakra-ui/react";
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react';
import { ArrowDownIcon } from '@chakra-ui/icons'
import { useReadContract, useWriteContract } from "wagmi";
import { UniswapABI } from "../abi/UniSwapV3";
import { IWethABI } from "../abi/IWETH";
import { ERC20ABI } from "../abi/IERC20";
import { useAccount } from 'wagmi';
import { zeroAddress } from 'viem';

function Swap() {

    enum Tokens {
        WETH,
        Uniswap,
    };

    const [tokenIn, settokenIn] = useState<number>(Tokens.WETH);
    const [tokenOut, settokenOut] = useState<number>(Tokens.Uniswap);
    const { address } = useAccount();
    const [clear, setclear] = useState<boolean>(false);
    const [Value, setValue] = useState<number>(0);

    const { isSuccess, isPending, writeContract: writeContractSwap } = useWriteContract();
    const { isSuccess: isSuccessApprove, isPending: isPendingApprove, writeContract: writeContractApprove } = useWriteContract();

    const { data: balanceWeth } = useReadContract({
        abi: IWethABI,
        address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
        functionName: 'balanceOf',
        args: [address ? address : zeroAddress],
    })

    const { data: balanceUniswap } = useReadContract({
        abi: ERC20ABI,
        address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        functionName: 'balanceOf',
        args: [address ? address : zeroAddress],
    })

    // error fix here
    // docs of eslint
    // const xyz = 10n ** 18n;

    const submitSwap = async () => {
        setclear(false);
        try {
            if (typeof Value !== 'number') throw new Error('Value must be a number');
            writeContractApprove({
                address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
                abi: IWethABI,
                functionName: 'approve',
                args: ["0xA07f05F9fc6894f619CE782C1b77fa651e1CaD8C", BigInt(Value)],
            });
        } catch (error) {
            console.log("Error", error);
        }
    }
    const swapToken = () => {
        setclear(true);
        // with enums - done
        // add try catch add errorhandling - done 
        // Custom Errors from error handling (using view abi decoder)
        // as const in abi
        try {
            if (typeof Value !== 'number') throw new Error('Value must be a number');
            writeContractSwap({
                abi: UniswapABI,
                address: "0xA07f05F9fc6894f619CE782C1b77fa651e1CaD8C",
                functionName: 'swapTokenInputSingle',
                args: [BigInt(Value), BigInt(tokenIn), BigInt(tokenOut)]
            })
        } catch (error) {
            console.log("Error", error);
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
                    UniSwap-V3
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
                                    {Tokens[tokenIn]}
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
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className="hover:bg-[#1e1e1e] border-b-[1px] border-white border-opacity-10 w-full  px-4 py-2 text-sm"
                                                onClick={() => { settokenIn(Tokens.WETH); settokenOut(Tokens.Uniswap) }}
                                            >
                                                WETH
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className="hover:bg-[#1e1e1e] border-b-[1px] border-white border-opacity-10 w-full  px-4 py-2 text-sm"
                                                onClick={() => { settokenIn(Tokens.Uniswap); settokenOut(Tokens.WETH) }}
                                            >
                                                Uniswap
                                            </button>
                                        )}
                                    </Menu.Item>
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
                    {tokenIn === 0 ?
                        <div className='w-12 mx-8 flex-wrap text-black text-sm'>Balance: {balanceWeth?.toString()}</div>
                        :
                        <div className='w-12 mx-8 flex-wrap text-black text-sm'>Balance: {balanceUniswap?.toString()}</div>
                    }
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
                                    {Tokens[tokenOut]}
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
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className="hover:bg-[#1e1e1e] border-b-[1px] border-white border-opacity-10 w-full  px-4 py-2 text-sm"
                                                onClick={() => { settokenIn(Tokens.Uniswap); settokenOut(Tokens.WETH) }}
                                            >
                                                WETH
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className="hover:bg-[#1e1e1e] border-b-[1px] border-white border-opacity-10 w-full  px-4 py-2 text-sm"
                                                onClick={() => { settokenIn(Tokens.WETH); settokenOut(Tokens.Uniswap) }}
                                            >
                                                Uniswap
                                            </button>
                                        )}
                                    </Menu.Item>
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
                {!isSuccess && isSuccessApprove ?
                    <button onClick={swapToken} className='text-white rounded-xl bg-red-600 px-5 py-1'>
                        <p>Swap</p>
                    </button>
                    :
                    <button onClick={submitSwap} className='text-white rounded-xl bg-red-600 px-5 py-1'>
                        Approve Swap
                    </button>
                }
            </div>
            {!clear ?
                <div>
                    {isPendingApprove &&
                        <p className='text-white rounded-xl mt-10 px-5 py-1'>Approve Pending</p>
                    }{
                        isSuccessApprove &&
                        <p className='text-white rounded-xl mt-10 px-5 py-1'>Approved </p>
                    }
                </div>
                :
                <div>
                    {
                        isPending && <p className='text-white rounded-xl mt-10 px-5 py-1'>Swaping</p>
                    }
                    {
                        isSuccess && <p className='text-white rounded-xl mt-10 px-5 py-1'>Swap Successful</p>
                    }
                </div>
            }
        </Box>
    )
}

export default Swap
