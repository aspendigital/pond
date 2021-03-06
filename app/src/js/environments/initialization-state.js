import LogState from '../projects/log-state'

/**
 * Keeps project initialization state
 */

const DOWNLOADING = 0
const PROVISIONING = 1
const INSTALLING = 2
const DONE = 3

class InitializationState {
    constructor () {
        this.textLog = new LogState()
        this.step = DOWNLOADING
    }
}

export default {
    Tracker: InitializationState,
    DOWNLOADING,
    PROVISIONING,
    INSTALLING,
    DONE
}