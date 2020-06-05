import * as path from 'path'
import * as _fs from 'fs'
import { getDirs } from './utils/get-dirs'
import { HeatPoolModel } from './models/heat-pool.model'
import { isString } from 'util'
const fs = _fs.promises

const distDir = path.join(__dirname, '..', 'dist')
const heatPoolDir = path.join(__dirname, '..', 'asset-registry', 'heat-pool')

export async function build() {
  await buildHeatPool();
}

async function buildHeatPool() {
  const poolAddresses = (await getDirs(heatPoolDir)).map(dir => path.basename(dir))
  const pools: Array<HeatPoolModel> = []

  console.log(`Processing a total of ${poolAddresses.length} pool`)
  for (let i=0; i<poolAddresses.length; i++) {
    const poolAddress = poolAddresses[i];
    console.log(`[${i+1} of ${poolAddresses.length}] Processing pool "${poolAddress}"`)    
    const poolDir = path.join(heatPoolDir, poolAddress)
    const poolJson = JSON.parse(await fs.readFile(path.join(poolDir, 'pool.json'), 'utf8'));  
    if (!isString(poolJson.name)) throw new Error(`Invalid heat-pool name for ${poolDir}`)
    if (!isString(poolJson.subtitle)) throw new Error(`Invalid heat-pool subtitle for ${poolDir}`)
    const iconPath = path.join(poolDir, 'logo.png')
    const iconHref = !_fs.existsSync(iconPath) ? null : path.relative(heatPoolDir, iconPath)
    const textFile = path.join(poolDir, 'text.md')
    const textContent = !_fs.existsSync(textFile) ? null : await fs.readFile(textFile, 'utf8');
    pools.push(new HeatPoolModel(poolAddress, poolJson.name, poolJson.subtitle, textContent, iconHref))
  }
  const compressedJson = []
  pools.forEach(pool => {
    compressedJson.push(pool.toCompressedJson())
  })

  console.log(`Done collecting data, writing heat-pool-registry.json`)
  const registryFile = path.join(distDir, 'heat-pool-registry.json')
  await fs.writeFile(registryFile, JSON.stringify(compressedJson), 'utf-8')
  console.log(`Done`)  
}