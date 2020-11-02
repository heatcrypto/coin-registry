import * as _ from 'lodash'
import * as path from 'path'
import * as _fs from 'fs'
const _fsExtra = require('fs-extra');
import { ChainModel } from './models/chain.model'
import { validateChainsJson, validateChainModel } from './build-coin-registry';
const fs = _fs.promises
const fsExtra = _fsExtra.promises;

const registryDir = path.join(__dirname, '..', 'coin-registry')
const distDir = path.join(__dirname, '..', 'dist')
const chainsFile = path.join(registryDir, 'chains.json')

export async function build() {
  const indexJson = JSON.parse(await fs.readFile(chainsFile, 'utf8'));
  validateChainsJson(indexJson)

  const chains:Array<ChainModel> = []
  const chainKeys = Object.keys(indexJson)
  console.log(`Processing a total of ${chainKeys.length} chains`)
  for (let i = 0; i < chainKeys.length; i++) {
    
    const name = chainKeys[i]
    console.log(`[${i+1} of ${chainKeys.length}] Processing chain "${name}"`)
    const id = indexJson[name]
    const chainDir = path.join(registryDir, name)
    const chainJsonFile = path.join(chainDir, 'chain.json')
    const chainJson = JSON.parse(await fs.readFile(chainJsonFile, 'utf8'))

    // We build the chains model
    const chainModel = ChainModel.fromJson(chainJson, id)
    validateChainModel(chainModel, chainDir)

    const sourceImage = path.join(chainDir, '0', '0', 'logo.png')
    const destImage = path.join(distDir, 'assets', 'icons', `${chainModel.id}_logo.png`)
    await fs.mkdir(path.dirname(destImage), { recursive: true })
    await fsExtra.copyFile(sourceImage, destImage)
  }
  console.log(`Done`)
}