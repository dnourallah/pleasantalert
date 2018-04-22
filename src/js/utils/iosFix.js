import * as dom from './dom/index'
import { pandClasses } from '../utils/classes'

// Fix iOS scrolling http://stackoverflow.com/q/39626302/1331425
export const iOSfix = () => {
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  if (iOS && !dom.hasClass(document.body, pandClasses.iosfix)) {
    const offset = document.body.scrollTop
    document.body.style.top = (offset * -1) + 'px'
    dom.addClass(document.body, pandClasses.iosfix)
  }
}

export const undoIOSfix = () => {
  if (dom.hasClass(document.body, pandClasses.iosfix)) {
    const offset = parseInt(document.body.style.top, 10)
    dom.removeClass(document.body, pandClasses.iosfix)
    document.body.style.top = ''
    document.body.scrollTop = (offset * -1)
  }
}
