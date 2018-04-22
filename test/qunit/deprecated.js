/* global QUnit */
const {Pleasant} = require('./helpers')
const $ = require('jquery')
import { TIMEOUT } from './helpers.js'

QUnit.test('confirm button /w useRejections: true', (assert) => {
  const done = assert.async()

  Pleasant({
    title: 'Confirm me',
    useRejections: true,
    animation: false
  }).then((result) => {
    assert.equal(result, true)
    done()
  })

  Pleasant.clickConfirm()
})

QUnit.test('cancel button /w useRejections: true', (assert) => {
  const done = assert.async()

  Pleasant({
    title: 'Cancel me',
    useRejections: true
  }).then(
    () => {},
    (dismiss) => {
      assert.equal(dismiss, Pleasant.DismissReason.cancel)
      done()
    }
  )

  Pleasant.clickCancel()
})

QUnit.test('esc key /w useRejections: true', (assert) => {
  const done = assert.async()

  Pleasant({
    title: 'Esc me',
    useRejections: true
  }).then(
    () => {},
    (dismiss) => {
      assert.equal(dismiss, Pleasant.DismissReason.esc)
      done()
    }
  )

  $(document).trigger($.Event('keydown', {
    key: 'Escape'
  }))
})

QUnit.test('backdrop click /w useRejections: true', (assert) => {
  const done = assert.async()

  Pleasant({
    title: 'Backdrop click',
    useRejections: true
  }).then(
    () => {},
    (dismiss) => {
      assert.equal(dismiss, Pleasant.DismissReason.backdrop)
      done()
    }
  )

  $('.padn-container').click()
})

QUnit.test('timer /w useRejections: true', (assert) => {
  const done = assert.async()

  Pleasant({
    title: 'Timer test',
    timer: 10,
    animation: false,
    useRejections: true
  }).then(
    () => {},
    (dismiss) => {
      assert.equal(dismiss, Pleasant.DismissReason.timer)
      done()
    }
  )
})

QUnit.test('close button /w useRejections: true', (assert) => {
  const done = assert.async()

  Pleasant({
    title: 'Close button test',
    showCloseButton: true,
    useRejections: true
  }).then(
    () => {},
    (dismiss) => {
      assert.equal(dismiss, Pleasant.DismissReason.close)
      done()
    }
  )

  const $closeButton = $('.padn-close')
  assert.ok($closeButton.is(':visible'))
  $closeButton.click()
})

QUnit.test('input text /w useRejections: true', (assert) => {
  const done = assert.async()

  const string = 'Live for yourself'
  Pleasant({
    input: 'text',
    useRejections: true
  }).then((result) => {
    assert.equal(result, string)
    done()
  })

  $('.padn-input').val(string)
  Pleasant.clickConfirm()
})

QUnit.test('built-in email validation /w useRejections: true', (assert) => {
  const done = assert.async()

  var validEmailAddress = 'team+support+a.b@example.com'
  Pleasant({
    input: 'email',
    useRejections: true
  }).then((result) => {
    assert.equal(result, validEmailAddress)
    done()
  })

  $('.padn-input').val(validEmailAddress)
  Pleasant.clickConfirm()
})

QUnit.test('input select /w useRejections: true', (assert) => {
  const done = assert.async()

  const selected = 'dos'
  Pleasant({
    input: 'select',
    inputOptions: {uno: 1, dos: 2},
    useRejections: true
  }).then((result) => {
    assert.equal(result, selected)
    done()
  })

  $('.padn-select').val(selected)
  Pleasant.clickConfirm()
})

QUnit.test('input checkbox /w useRejections: true', (assert) => {
  const done = assert.async()

  Pleasant({
    input: 'checkbox',
    inputAttributes: {
      name: 'test-checkbox'
    },
    useRejections: true
  }).then((result) => {
    assert.equal(checkbox.attr('name'), 'test-checkbox')
    assert.equal(result, '1')
    done()
  })

  const checkbox = $('.padn-checkbox input')
  checkbox.prop('checked', true)
  Pleasant.clickConfirm()
})

QUnit.test('validation error /w expectRejections: true', (assert) => {
  const done = assert.async()
  const inputValidator = (value) => !value ? Promise.reject('no falsy values') : Promise.resolve()

  Pleasant({input: 'text', animation: false, inputValidator, expectRejections: true})
  assert.ok($('.padn-validationerror').is(':hidden'))
  setTimeout(() => {
    const initialModalHeight = $('.padn-modal').outerHeight()

    Pleasant.clickConfirm()
    setTimeout(() => {
      assert.ok($('.padn-validationerror').is(':visible'))
      assert.equal($('.padn-validationerror').text(), 'no falsy values')
      assert.ok($('.padn-input').attr('aria-invalid'))
      assert.ok($('.padn-modal').outerHeight() > initialModalHeight)

      $('.padn-input').val('blah-blah').trigger('input')
      assert.ok($('.padn-validationerror').is(':hidden'))
      assert.notOk($('.padn-input').attr('aria-invalid'))
      assert.ok($('.padn-modal').outerHeight() === initialModalHeight)
      done()
    }, TIMEOUT)
  }, TIMEOUT)
})
