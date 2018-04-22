import { pandClasses, iconTypes } from '../classes'
import { getContainer, getPopup, getContent } from './getters'
import { removeClass, getChildByClass } from './domUtils'
import { isNodeEnv } from '../isNodeEnv'
import { error } from '../utils'
import pleasantAlert from '../../pleasantalert'

const pleasantHTML = `
 <div aria-labelledby="${pandClasses.title}" aria-describedby="${pandClasses.content}" class="${pandClasses.popup}" tabindex="-1">
   <div class="${pandClasses.header}">
     <ul class="${pandClasses.progresssteps}"></ul>
     <div class="${pandClasses.icon} ${iconTypes.error}">
       <span class="padn-x-mark"><span class="padn-x-mark-line-left"></span><span class="padn-x-mark-line-right"></span></span>
     </div>
     <div class="${pandClasses.icon} ${iconTypes.question}">
       <span class="${pandClasses['icon-text']}">?</span>
      </div>
     <div class="${pandClasses.icon} ${iconTypes.warning}">
       <span class="${pandClasses['icon-text']}">!</span>
      </div>
     <div class="${pandClasses.icon} ${iconTypes.info}">
       <span class="${pandClasses['icon-text']}">i</span>
      </div>
     <div class="${pandClasses.icon} ${iconTypes.success}">
       <div class="padn-success-circular-line-left"></div>
       <span class="padn-success-line-tip"></span> <span class="padn-success-line-long"></span>
       <div class="padn-success-ring"></div> <div class="padn-success-fix"></div>
       <div class="padn-success-circular-line-right"></div>
     </div>
     <img class="${pandClasses.image}" />
     <h2 class="${pandClasses.title}" id="${pandClasses.title}"></h2>
     <button type="button" class="${pandClasses.close}">×</button>
   </div>
   <div class="${pandClasses.content}">
     <div id="${pandClasses.content}"></div>
     <input class="${pandClasses.input}" />
     <input type="file" class="${pandClasses.file}" />
     <div class="${pandClasses.range}">
       <input type="range" />
       <output></output>
     </div>
     <select class="${pandClasses.select}"></select>
     <div class="${pandClasses.radio}"></div>
     <label for="${pandClasses.checkbox}" class="${pandClasses.checkbox}">
       <input type="checkbox" />
     </label>
     <textarea class="${pandClasses.textarea}"></textarea>
     <div class="${pandClasses.validationerror}" id="${pandClasses.validationerror}"></div>
   </div>
   <div class="${pandClasses.actions}">
     <button type="button" class="${pandClasses.confirm}">OK</button>
     <button type="button" class="${pandClasses.cancel}">Cancel</button>
   </div>
   <div class="${pandClasses.footer}">
   </div>
 </div>
`.replace(/(^|\n)\s*/g, '')

/*
 * Add modal + backdrop to DOM
 */
export const init = (params) => {
  // Clean up the old popup if it exists
  const c = getContainer()
  if (c) {
    c.parentNode.removeChild(c)
    removeClass(
      [document.documentElement, document.body],
      [
        pandClasses['no-backdrop'],
        pandClasses['has-input'],
        pandClasses['toast-shown']
      ]
    )
  }

  if (isNodeEnv()) {
    error('PleasantAlert requires document to initialize')
    return
  }

  const container = document.createElement('div')
  container.className = pandClasses.container
  container.innerHTML = pleasantHTML

  let targetElement = typeof params.target === 'string' ? document.querySelector(params.target) : params.target
  targetElement.appendChild(container)

  const popup = getPopup()
  const content = getContent()
  const input = getChildByClass(content, pandClasses.input)
  const file = getChildByClass(content, pandClasses.file)
  const range = content.querySelector(`.${pandClasses.range} input`)
  const rangeOutput = content.querySelector(`.${pandClasses.range} output`)
  const select = getChildByClass(content, pandClasses.select)
  const checkbox = content.querySelector(`.${pandClasses.checkbox} input`)
  const textarea = getChildByClass(content, pandClasses.textarea)

  // a11y
  popup.setAttribute('role', params.toast ? 'alert' : 'dialog')
  popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive')
  if (!params.toast) {
    popup.setAttribute('aria-modal', 'true')
  }

  const resetValidationError = () => {
    pleasantAlert.isVisible() && pleasantAlert.resetValidationError()
  }

  input.oninput = resetValidationError
  file.onchange = resetValidationError
  select.onchange = resetValidationError
  checkbox.onchange = resetValidationError
  textarea.oninput = resetValidationError

  range.oninput = () => {
    resetValidationError()
    rangeOutput.value = range.value
  }

  range.onchange = () => {
    resetValidationError()
    range.nextSibling.value = range.value
  }

  return popup
}
