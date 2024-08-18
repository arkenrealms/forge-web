import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

export const approve = async (contract, masterChefContract, account) => {
  return contract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const stake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods['deposit(uint256,uint256)'](
    pid,
    new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()
  )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const unstake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods['withdraw(uint256,uint256)'](
    pid,
    new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()
  )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const emergencyWithdraw = async (contract, pid, account) => {
  return contract.methods
    .emergencyWithdraw(pid)
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const harvest = async (masterChefContract, pid, account) => {
  return masterChefContract.methods['deposit(uint256,uint256)'](pid, '0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}
