import React, { useState } from 'react'
import { Flex, Text } from "@chakra-ui/react"
import { UniswapABI } from "../abi/UniSwapV3";
import { useWriteContract } from "wagmi";
function AddToken() {

    const [tokenAddressA, settokenAddressA] = useState<string>('');
    const [tokenAddressB, settokenAddressB] = useState<string>('');
    const [poolPrice, setpoolPrice] = useState(0)
    const { writeContractAsync: writeContractAddToken } = useWriteContract();

    const addToken = async () => {
        try {
            await writeContractAddToken({
                address: '0x2541885E9DE789758fFec4397A1a1A387a94722d',
                abi: UniswapABI,
                functionName: 'addToken',
                args: [tokenAddressA as `0x${string}`, tokenAddressB as `0x${string}`, poolPrice],
            });
            settokenAddressA('');
            settokenAddressB('');
            setpoolPrice(0);
        } catch (error) {
            console.log("Error", error);
        }
    }

    return (
        <>
            <div className='w-[30.62rem] bg-white mt-[5.25rem] p-4 rounded-2xl '>
                <Flex
                    alignItems="center"
                    p="0.5rem 0.25rem 0.5rem"
                    bg="white"
                    color="rgb(86, 90, 105)"
                    justifyContent="space-between"
                    borderRadius="1.37rem 1.37rem 0 0">
                    <Text
                        color="black"
                        fontWeight="500">
                        Add Token Pool
                    </Text>
                </Flex>
                <div className='flex flex-col'>
                    <input type='text' className=" my-1 h-[57px] w-full p-4 text-sm text-black border border-gray-300 rounded-lg bg-gray-50 dark:text-black focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-700 dark:focus:ring-blue-500 dark:focus:border-blue-500 " placeholder="ContractA Address" onChange={(e) => { settokenAddressA(e.target.value) }} />
                    <input type='text' className=" my-1 h-[57px] w-full p-4 text-sm text-black border border-gray-300 rounded-lg bg-gray-50 dark:text-black focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-700 dark:focus:ring-blue-500 dark:focus:border-blue-500 " placeholder="ContractB Address" onChange={(event) => { settokenAddressB(event.target.value) }} />
                    <input type="number" className=" my-1 h-[57px] w-full p-4 text-sm text-black border border-gray-300 rounded-lg bg-gray-50 dark:text-black focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-700 dark:focus:ring-blue-500 dark:focus:border-blue-500 " placeholder="Pool's Fees" onChange={(e) => { setpoolPrice(Number(e.target.value)) }} />
                </div>
            </div>
            <button onClick={addToken} className='text-white text-xl rounded-xl mt-4 bg-red-600 px-4 py-1'>
                <p>Add Token</p>
            </button>
        </>
    )
}

export default AddToken