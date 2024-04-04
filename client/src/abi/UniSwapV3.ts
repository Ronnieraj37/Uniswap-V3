export const UniswapABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "input",
        "type": "address"
      }
    ],
    "name": "InputOutputSame",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "No_Amount_Given",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Pool_Fee_Given_Zero",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Swap_Pair_Inexistent",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TokenAlreadyExists",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "TokenA",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "TokenB",
        "type": "address"
      },
      {
        "internalType": "uint24",
        "name": "poolFee",
        "type": "uint24"
      }
    ],
    "name": "addToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "swapFees",
    "outputs": [
      {
        "internalType": "uint24",
        "name": "",
        "type": "uint24"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "swapRouter",
    "outputs": [
      {
        "internalType": "contract ISwapRouter02",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "input",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "output",
        "type": "address"
      }
    ],
    "name": "swapTokenInputSingle",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "input",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "output",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountInMaximum",
        "type": "uint256"
      }
    ],
    "name": "swapTokenOutputSingle",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const