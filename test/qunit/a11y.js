/* global QUnit */
const {Pleasant} = require('./helpers')
const $ = require('jquery')

QUnit.test('dialog aria attributes', (assert) => {
  Pleasant('Modal dialog')
  assert.equal($('.padn-modal').attr('role'), 'dialog')
  assert.equal($('.padn-modal').attr('aria-live'), 'assertive')
  assert.equal($('.padn-modal').attr('aria-modal'), 'true')
})

QUnit.test('toast aria attributes', (assert) => {
  Pleasant({title: 'Toast', toast: true})
  assert.equal($('.padn-toast').attr('role'), 'alert')
  assert.equal($('.padn-toast').attr('aria-live'), 'polite')
  assert.notOk($('.padn-toast').attr('aria-modal'))
})
