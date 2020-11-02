import { build as coinBuild } from './build-coin-registry'
import { build as regBuild } from './build-asset-registry'
import { build as imgBuild } from './build-image-assets'

async function build() {
  await coinBuild()
  await regBuild()
  await imgBuild()
}
build();