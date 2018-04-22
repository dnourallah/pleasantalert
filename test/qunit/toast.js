/* global QUnit */
const {Pleasant} = require('./helpers')
const $ = require('jquery')

QUnit.test('.padn-toast-shown', (assert) => {
  Pleasant({toast: true})
  assert.ok(document.body.classList.contains('padn-toast-shown'))
  assert.ok(document.documentElement.classList.contains('padn-toast-shown'))
  Pleasant({toast: false})
  assert.notOk(document.body.classList.contains('padn-toast-shown'))
  assert.notOk(document.documentElement.classList.contains('padn-toast-shown'))
})

QUnit.test('.padn-has-input', (assert) => {
  var inputs = ['text', 'email', 'password', 'number', 'tel', 'range', 'textarea', 'select', 'radio', 'checkbox', 'file', 'url']
  inputs.forEach((input) => {
    Pleasant({input: input})
    assert.ok(document.body.classList.contains('padn-has-input'), input)
  })
})

QUnit.test('should not overrie window.onkeydown', (assert) => {
  Pleasant({toast: true})
  assert.equal(null, window.onkeydown)
})

QUnit.test('toast click closes when no buttons or input are specified', (assert) => {
  const done = assert.async()

  Pleasant({
    title: 'toast click close',
    animation: false,
    toast: true,
    showConfirmButton: false
  }).then((result) => {
    assert.deepEqual(result, {dismiss: Pleasant.DismissReason.close})
    done()
  })

  $('.padn-popup').click()
})

QUnit.test('toast click does not close if cancel button is present', (assert) => {
  const done = assert.async()

  Pleasant({
    title: 'toast no close with button present',
    animation: false,
    toast: true,
    showConfirmButton: false,
    showCancelButton: true
  })

  $('.padn-popup').click()

  setTimeout(() => {
    assert.ok(Pleasant.isVisible())
    done()
  })
})

QUnit.test('toast click does not close if input option is specified', (assert) => {
  const done = assert.async()

  Pleasant({
    title: 'toast no close with input present',
    animation: false,
    toast: true,
    showConfirmButton: false,
    showCancelButton: false,
    input: 'text'
  })

  $('.padn-popup').click()

  setTimeout(() => {
    assert.ok(Pleasant.isVisible())
    done()
  })
})
