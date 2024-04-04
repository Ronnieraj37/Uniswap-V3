import React, { useState } from 'react'
import { Box, Input } from "@chakra-ui/react"
import { UniswapABI } from "../abi/UniSwapV3";
import { useWriteContract } from "wagmi";
function AddToken() {

    const [tokenAddress, settokenAddress] = useState<string>('');
    const { writeContractAsync: writeContractAddToken } = useWriteContract();

    const addToken = async () => {
        try {
            console.log("Token Address", tokenAddress);
            await writeContractAddToken({
                address: '0x20ca54717354f0837f28148756900bbb6592587D',
                abi: UniswapABI,
                functionName: 'addToken',
                args: [tokenAddress as `0x${string}`],
            });
            settokenAddress('');
        } catch (error) {
            console.log("Error", error);
        }
    }

    return (
        <Box className='mt-20'
            p="0.2rem"
            bg="white"
            borderRadius="1.3rem">
            <Input
                className='text-black px-2'
                placeholder="0x"
                fontWeight="500"
                fontSize="1.5rem"
                width="100%"
                size="16rem"
                textAlign="right"
                bg="rgb(247, 248, 250)"
                outline="none"
                border="none"
                focusBorderColor="none"
                type="text"
                borderRadius="1.3rem"
                onChange={(e) => {
                    settokenAddress(e.target.value)
                }}
            />
            <button onClick={addToken} className='text-white rounded-2xl bg-red-600 text-lg px-4 py-1'>
                <p>Add Token</p>
            </button>
        </Box>
    )
}

export default AddToken