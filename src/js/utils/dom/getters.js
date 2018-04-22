import { pandClasses } from '../classes'
import { uniqueArray, warnOnce } from '../utils'

export const getContainer = () => document.body.querySelector('.' + pandClasses.container)

const elementByClass = (className) => {
  const container = getContainer()
  return container ? container.querySelector('.' + className) : null
}

export const getPopup = () => elementByClass(pandClasses.popup)

export const getIcons = () => {
  const popup = getPopup()
  return popup.querySelectorAll('.' + pandClasses.icon)
}

export const getTitle = () => elementByClass(pandClasses.title)

export const getContent = () => elementByClass(pandClasses.content)

export const getImage = () => elementByClass(pandClasses.image)

export const getProgressSteps = () => elementByClass(pandClasses.progresssteps)

export const getValidationError = () => elementByClass(pandClasses.validationerror)

export const getConfirmButton = () => elementByClass(pandClasses.confirm)

export const getCancelButton = () => elementByClass(pandClasses.cancel)

export const getButtonsWrapper = () => {
  warnOnce(`pleasant.getButtonsWrapper() is deprecated and will be removed in the next major release, use pleasant.getActions() instead`)
  return elementByClass(pandClasses.actions)
}

export const getActions = () => elementByClass(pandClasses.actions)

export const getFooter = () => elementByClass(pandClasses.footer)

export const getCloseButton = () => elementByClass(pandClasses.close)

export const getFocusableElements = () => {
  const focusableElementsWithTabindex = Array.prototype.slice.call(
    getPopup().querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')
  )
  // sort according to tabindex
    .sort((a, b) => {
      a = parseInt(a.getAttribute('tabindex'))
      b = parseInt(b.getAttribute('tabindex'))
      if (a > b) {
        return 1
      } else if (a < b) {
        return -1
      }
      return 0
    })

  // https://github.com/jkup/focusable/blob/master/index.js
  const otherFocusableElements = Array.prototype.slice.call(
    getPopup().querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable], audio[controls], video[controls]')
  )

  return uniqueArray(focusableElementsWithTabindex.concat(otherFocusableElements))
}

export const isModal = () => {
  return !document.body.classList.contains(pandClasses['toast-shown'])
}

export const isToast = () => {
  return document.body.classList.contains(pandClasses['toast-shown'])
}

export const isLoading = () => {
  return getPopup().hasAttribute('data-loading')
}
