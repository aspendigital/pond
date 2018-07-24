import path from 'path'
import config from '../config'

function getDistDir() {
    return __static//require('electron').remote.process.cwd() + '/dist'
}

function getAssetsDir() {
    return getDistDir() + '/assets'
}

function getPhpBinDir() {
    return getDistDir() + '/assets-bin-php'
}

export default {
    getAssetsDir,
    getPhpBinDir
}
