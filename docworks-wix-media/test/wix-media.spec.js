import chai from 'chai'
import chaiSubset from 'chai-subset'
import tmp from 'tmp-promise'
import {pathExists} from 'fs-extra'
const expect = chai.expect
chai.use(chaiSubset)

import {setMediaDir, setLogger, ecpAfterMerge} from '../src/index'

let log = []
const logger = {
  error: (_) => log.push(_),
}


describe('wix-snippet', function() {

  beforeEach(async () => {
    setMediaDir('./test/project')
    setLogger(logger)
    log = []
  })

  it('should copy all files from the project dir to the working dir / media directory', async function() {
    const tempDir = await tmp.dir()
    const workingDir = tempDir.path

    await ecpAfterMerge(workingDir)

    const group10Exists = await pathExists(`${workingDir}/media/group-10@3x.png`)
    const menuButtonExists = await pathExists(`${workingDir}/media/menu-button.png`)
    const minusExists = await pathExists(`${workingDir}/media/minus@3x.png`)
    const plusExists = await pathExists(`${workingDir}/media/plus@3x.png`)

    expect(group10Exists).to.be.true
    expect(menuButtonExists).to.be.true
    expect(minusExists).to.be.true
    expect(plusExists).to.be.true

    // eslint-disable-next-line no-console
    console.log(workingDir)
  })
})
