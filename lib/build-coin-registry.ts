import * as _ from 'lodash'
import * as path from 'path'
import * as _fs from 'fs'
import { ChainModel } from './models/chain.model'
import { CurrencyModel } from './models/currency.model'
import { getDirs } from './utils/get-dirs'
const fs = _fs.promises

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

    // Process each asset type
    for (let j = 0; j < chainModel.assetTypes.length; j++) {
      const assetTypeModel = chainModel.assetTypes[j]
      const assetTypeDir = path.join(chainDir, `${assetTypeModel.id}`)

      // Process each currency
      const currencyIds = (await getDirs(assetTypeDir)).map(dir => path.basename(dir))
      for (let k = 0; k< currencyIds.length; k++) {
        const currencyId = currencyIds[k]
        const currencyDir = path.join(assetTypeDir, `${currencyId}`)
        const currencyJsonFile = path.join(currencyDir, 'currency.json')
        const currencyJson = JSON.parse(await fs.readFile(currencyJsonFile, 'utf8'))
        const iconPath = path.join(currencyDir, 'logo.png')
        const iconHref = !_fs.existsSync(iconPath) ? null : path.relative(registryDir, iconPath)
        const currencyModel = CurrencyModel.fromJson(currencyJson, chainModel, assetTypeModel, currencyId, iconHref)

        assetTypeModel.currencies.push(currencyModel);
      }
    }
    chains.push(chainModel)
  }
  const compressedJson = []
  chains.forEach(chain => {
    compressedJson.push(chain.toCompressedJson())
  })

  console.log(`Done collecting data, writing registry.json`)
  const registryFile = path.join(distDir, 'registry.json')
  await fs.writeFile(registryFile, JSON.stringify(compressedJson), 'utf-8')
  console.log(`Done`)
}

/**
 * Each key in the chainsJson must have a matching directory in 
 * the registry folder.
 * Each id in the chainsJson must be unique, no duplicates allowed.
 * 
 * @param chainsJson 
 */
function validateChainsJson(chainsJson: Map<String, number>) {
  let duplicates = new Set<number>()
  let keys = Object.keys(chainsJson)
  for (let i = 0; i < keys.length; i++) {
    let name = keys[i]
    let id = chainsJson[name]
    if (!_.isNumber(id))
      throw new Error(`Invalid value in chains.json for key ${name}`)
    if (duplicates.has(id))
      throw new Error(`Duplicate id ${id} in chains.json for key ${name}`)
    duplicates.add(id)
    let dir = path.join(registryDir, name)
    if (!_fs.existsSync(dir))
      throw new Error(`Missing directory ${dir} for key ${name}`)
  }
}

/**
 * We make sure directories exist for each declared asset type.
 * We enforce no duplicate asset types exist.
 * @param chainModel 
 */
function validateChainModel(chainModel: ChainModel, chainDir: string) {
  let duplicates = new Set<number>();
  let assetTypeIds = chainModel.assetTypes.map(x => x.id)
  for (let i = 0; i < assetTypeIds.length; i++) {
    const id = assetTypeIds[i]
    if (duplicates.has(id))
      throw new Error(`Duplicate asset type id ${id} in ${chainDir}`)
    duplicates.add(id)
    let dir = path.join(chainDir, `${id}`)
    if (!_fs.existsSync(dir))
      throw new Error(`Missing directory for asset type at ${dir}`)
  }
}