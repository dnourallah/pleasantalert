/* global QUnit */
const {Pleasant} = require('./helpers')
const $ = require('jquery')

const simulateMouseEvent = (x, y, eventType) => {
  var event = $.Event(eventType)
  event.clientX = x
  event.clientY = y
  $(document.elementFromPoint(x, y)).trigger(event)
}

QUnit.test('backdrop click', (assert) => {
  const done = assert.async()

  Pleasant({
    title: 'Backdrop click',
    animation: false
  }).then((result) => {
    assert.deepEqual(result, {dismiss: Pleasant.DismissReason.backdrop})
    done()
  })

  $('.padn-container').click()
})

QUnit.test('popup mousedown, backdrop mouseup', (assert) => {
  const done = assert.async()

  Pleasant({
    title: 'popup mousedown, backdrop mouseup',
    animation: false
  })

  simulateMouseEvent(1, 1, 'mousedown')
  simulateMouseEvent(window.innerWidth / 2, window.innerHeight / 2, 'mouseup')

  setTimeout(() => {
    assert.ok(Pleasant.isVisible())
    done()
  })
})

QUnit.test('backdrop mousedown, popup mouseup', (assert) => {
  const done = assert.async()

  Pleasant({
    title: 'backdrop mousedown, popup mouseup',
    animation: false
  })

  simulateMouseEvent(window.innerWidth / 2, window.innerHeight / 2, 'mousedown')
  simulateMouseEvent(1, 1, 'mouseup')

  setTimeout(() => {
    assert.ok(Pleasant.isVisible())
    done()
  })
})

QUnit.test('allowOutsideClick: false', (assert) => {
  const done = assert.async()

  Pleasant({
    title: 'allowOutsideClick: false',
    allowOutsideClick: false,
    animation: false
  })

  $('.padn-container').click()

  setTimeout(() => {
    assert.ok(Pleasant.isVisible())
    done()
  })
})

QUnit.test('allowOutsideClick: () => !pleasant.isLoading()', (assert) => {
  const done = assert.async()

  Pleasant({
    title: 'allowOutsideClick: () => !pleasant.isLoading()',
    allowOutsideClick: () => !Pleasant.isLoading(),
    animation: false
  }).then((result) => {
    assert.deepEqual(result, {dismiss: Pleasant.DismissReason.backdrop})
    done()
  })

  Pleasant.showLoading()

  $('.padn-container').click()

  setTimeout(() => {
    assert.ok(Pleasant.isVisible())
    Pleasant.hideLoading()
    $('.padn-container').click()
  })
})
