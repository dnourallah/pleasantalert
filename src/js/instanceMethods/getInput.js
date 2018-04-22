import * as dom from '../utils/dom/index'
import { pandClasses } from '../utils/classes'
import privateProps from '../privateProps'

// Get input element by specified type or, if type isn't specified, by params.input
export function getInput (inputType) {
  const innerParams = privateProps.innerParams.get(this)
  const domCache = privateProps.domCache.get(this)
  inputType = inputType || innerParams.input
  if (!inputType) {
    return null
  }
  switch (inputType) {
    case 'select':
    case 'textarea':
    case 'file':
      return dom.getChildByClass(domCache.content, pandClasses[inputType])
    case 'checkbox':
      return domCache.popup.querySelector(`.${pandClasses.checkbox} input`)
    case 'radio':
      return domCache.popup.querySelector(`.${pandClasses.radio} input:checked`) ||
        domCache.popup.querySelector(`.${pandClasses.radio} input:first-child`)
    case 'range':
      return domCache.popup.querySelector(`.${pandClasses.range} input`)
    default:
      return dom.getChildByClass(domCache.content, pandClasses.input)
  }
}
