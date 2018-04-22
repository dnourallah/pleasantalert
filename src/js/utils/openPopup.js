import * as dom from './dom/index'
import { pandClasses } from './classes'
import { fixScrollbar } from './scrollbarFix'
import { iOSfix } from './iosFix'

/**
 * Animations
 *
 * @param animation
 * @param onBeforeOpen
 * @param onComplete
 */
export const openPopup = (animation, onBeforeOpen, onOpen) => {
  const container = dom.getContainer()
  const popup = dom.getPopup()

  if (onBeforeOpen !== null && typeof onBeforeOpen === 'function') {
    onBeforeOpen(popup)
  }

  if (animation) {
    dom.addClass(popup, pandClasses.show)
    dom.addClass(container, pandClasses.fade)
    dom.removeClass(popup, pandClasses.hide)
  } else {
    dom.removeClass(popup, pandClasses.fade)
  }
  dom.show(popup)

  // scrolling is 'hidden' until animation is done, after that 'auto'
  container.style.overflowY = 'hidden'
  if (dom.animationEndEvent && !dom.hasClass(popup, pandClasses.noanimation)) {
    popup.addEventListener(dom.animationEndEvent, function pandCloseEventFinished () {
      popup.removeEventListener(dom.animationEndEvent, pandCloseEventFinished)
      container.style.overflowY = 'auto'
    })
  } else {
    container.style.overflowY = 'auto'
  }

  dom.addClass([document.documentElement, document.body, container], pandClasses.shown)
  if (dom.isModal()) {
    fixScrollbar()
    iOSfix()
  }
  dom.states.previousActiveElement = document.activeElement
  if (onOpen !== null && typeof onOpen === 'function') {
    setTimeout(() => {
      onOpen(popup)
    })
  }
}
