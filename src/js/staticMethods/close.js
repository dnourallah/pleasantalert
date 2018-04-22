import {undoScrollbar} from '../utils/scrollbarFix'
import {undoIOSfix} from '../utils/iosFix'
import * as dom from '../utils/dom/index'
import { pandClasses } from '../utils/classes.js'
import globalState from '../globalState'

/*
 * Global function to close pleasantAlert
 */
const close = (onClose, onAfterClose) => {
  const container = dom.getContainer()
  const popup = dom.getPopup()
  if (!popup) {
    return
  }

  if (onClose !== null && typeof onClose === 'function') {
    onClose(popup)
  }

  dom.removeClass(popup, pandClasses.show)
  dom.addClass(popup, pandClasses.hide)
  clearTimeout(popup.timeout)

  if (!dom.isToast()) {
    dom.resetPrevState()
    window.onkeydown = globalState.previousWindowKeyDown
    globalState.windowOnkeydownOverridden = false
  }

  const removePopupAndResetState = () => {
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
    dom.removeClass(
      [document.documentElement, document.body],
      [
        pandClasses.shown,
        pandClasses['no-backdrop'],
        pandClasses['has-input'],
        pandClasses['toast-shown']
      ]
    )

    if (dom.isModal()) {
      undoScrollbar()
      undoIOSfix()
    }

    if (onAfterClose !== null && typeof onAfterClose === 'function') {
      setTimeout(() => {
        onAfterClose()
      })
    }
  }

  // If animation is supported, animate
  if (dom.animationEndEvent && !dom.hasClass(popup, pandClasses.noanimation)) {
    popup.addEventListener(dom.animationEndEvent, function pandCloseEventFinished () {
      popup.removeEventListener(dom.animationEndEvent, pandCloseEventFinished)
      if (dom.hasClass(popup, pandClasses.hide)) {
        removePopupAndResetState()
      }
    })
  } else {
    // Otherwise, remove immediately
    removePopupAndResetState()
  }
}
export {
  close,
  close as closePopup,
  close as closeModal,
  close as closeToast
}
