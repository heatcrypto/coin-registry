import { build as coinBuild } from './build-coin-registry'
import { build as regBuild } from './build-asset-registry'

async function build() {
  await coinBuild()
  await regBuild()
}
build();