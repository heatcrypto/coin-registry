/**
 * MyEtherWallet token list import.
 * Imports non existing tokens from:
 * https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/dist/tokens/eth/tokens-eth.json
 */
import * as _fs from 'fs'
const fs = _fs.promises
import * as path from 'path'
import { downloadJson } from '../utils/download';
import { getDirs } from '../utils/get-dirs';
const request = require('request');
const rp = require('request-promise');
const tokenListUrl = 'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/dist/tokens/eth/tokens-eth.json'
const registryDir = path.join(__dirname, '..', '..', 'registry')
const ethereumTokenDir = path.join(registryDir, 'ethereum', '1')

async function run() {
  const mewJson = await downloadJson(tokenListUrl)
  const tokenDirSetDualCase = await createTokenDirSetDualCase()

  for (let i = 0; i < mewJson.length; i++) {
    const { symbol, name, address, decimals } = mewJson[i]

    // Skip if address exists in registry
    if (tokenDirSetDualCase.has(address))
      continue;

    // Create the token currency.json file
    const tokenDir = path.join(ethereumTokenDir, address)
    const currencyJsonFile = path.join(tokenDir, 'currency.json')
    await fs.writeFile(currencyJsonFile, JSON.stringify({
      name,
      symbol,
      decimals,
    },null,2), 'utf-8')

  }
}

/**
 * Creates a Set<string> of all token addresses found in the ethereum token registry.
 * In case an address uses mixed case we will create a lower case version as well and
 * also add this to the set.
 * 
 */
async function createTokenDirSetDualCase() {
  const tokenDirs = await getDirs(ethereumTokenDir)
  const tokenDirSetDualCase = new Set<string>()
  tokenDirs.forEach(dirPath => {
    const address: string = path.basename(dirPath)
    tokenDirSetDualCase.add(address)
    const lowerCase = address.toLowerCase()
    if (lowerCase != address) {
      tokenDirSetDualCase.add(lowerCase)
    }
  })
  return tokenDirSetDualCase
}



run();