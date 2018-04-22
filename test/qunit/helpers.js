const { detect } = require('detect-browser')

const browser = detect()
export const TIMEOUT = browser.name === 'ie' ? 100 : 0

// We *only* access `Pleasant` through this module, so that we can be sure `initialPleasantPropNames` is set properly
export const initialPleasantPropNames = Object.keys(global.Pleasant)
export const Pleasant = global.Pleasant
