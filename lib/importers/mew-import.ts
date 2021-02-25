/**
 * MyEtherWallet token list import.
 * Imports non existing tokens from:
 * https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/dist/tokens/eth/tokens-eth.json
 */
import * as _fs from 'fs'
const fs = _fs.promises
import * as path from 'path'
import { downloadJson, downloadFile } from '../utils/download';
import { getDirs } from '../utils/get-dirs';
const tokenListUrl = 'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/dist/tokens/eth/tokens-eth.json'
const registryDir = path.join(__dirname, '..', '..', 'coin-registry')
const ethereumTokenDir = path.join(registryDir, 'ethereum', '1')

async function run() {
  console.log(`Downloading MEW token list`)
  const mewJson = await downloadJson(tokenListUrl)
  console.log(`Download complete, found ${mewJson.length} tokens`)
  const tokenDirSet = await createTokenDirSet()

  for (let i = 0; i < mewJson.length; i++) {
    const { symbol, name, address, decimals } = mewJson[i]

    // Skip if address exists in registry
    if (tokenDirSet.has(address))
      continue;

    console.log(`Found new token ${address} - ${name}`)

    // Create the token currency.json file
    const tokenDir = path.join(ethereumTokenDir, address)
    _fs.mkdirSync(tokenDir); 
    const currencyJsonFile = path.join(tokenDir, 'currency.json')
    await fs.writeFile(currencyJsonFile, JSON.stringify({
      name,
      symbol,
      decimals,
    },null,2), 'utf-8')

    // Download the logo from Trust/assets
    const logoPngFile = path.join(tokenDir, 'logo.png')
    const success:boolean = await downloadLogoFromTrustAssets(address, logoPngFile)
    if (!success) 
      console.log(`Could not download logo for ${address}`)
  }
}

/**
 * Creates a Set<string> of all token addresses found in the ethereum token registry.
 */
async function createTokenDirSet() {
  const tokenDirs = await getDirs(ethereumTokenDir)
  const tokenDirSet = new Set<string>()
  tokenDirs.forEach(dirPath => {
    const address: string = path.basename(dirPath)
    tokenDirSet.add(address)
  })
  return tokenDirSet
}

/**
 * Downloads raw png from github for ethereum token address 
 * @param address 
 * @param logoPngFile 
 */
async function downloadLogoFromTrustAssets(address:string, logoPngFile:string):Promise<boolean> {
  const logoUrl = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
  await downloadFile(logoUrl, logoPngFile)
  return _fs.existsSync(logoPngFile)
}

run();