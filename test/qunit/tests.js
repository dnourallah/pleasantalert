/* global QUnit */
const {Pleasant} = require('./helpers')
const $ = require('jquery')
import { TIMEOUT } from './helpers.js'

QUnit.test('version is correct semver', (assert) => {
  assert.ok(Pleasant.version.match(/\d+\.\d+\.\d+/))
})

QUnit.test('modal shows up', (assert) => {
  Pleasant('Hello world!')
  assert.ok(Pleasant.isVisible())
})

QUnit.test('modal width', (assert) => {
  Pleasant({text: '300px', width: 300})
  assert.equal($('.padn-modal')[0].style.width, '300px')

  Pleasant({text: '400px', width: '400px'})
  assert.equal($('.padn-modal')[0].style.width, '400px')

  Pleasant({text: '90%', width: '90%'})
  assert.equal($('.padn-modal')[0].style.width, '90%')
})

QUnit.test('custom class', (assert) => {
  Pleasant({customClass: 'custom-class'})
  assert.ok(Pleasant.getPopup().classList.contains('custom-class'))
})

QUnit.test('window keydown handler', (assert) => {
  Pleasant('hi')
  assert.ok(window.onkeydown)
  Pleasant.close()
  assert.equal(window.onkeydown, null)

  Pleasant('first call')
  Pleasant('second call')
  assert.ok(window.onkeydown)
  Pleasant.close()
  assert.equal(window.onkeydown, null)
})

QUnit.test('getters', (assert) => {
  Pleasant('Title', 'Content')
  assert.equal(Pleasant.getTitle().innerText, 'Title')
  assert.equal(Pleasant.getContent().innerText.trim(), 'Content')

  Pleasant({
    showCancelButton: true,
    imageUrl: '/assets/padn-logo.png',
    confirmButtonText: 'Confirm button',
    confirmButtonAriaLabel: 'Confirm button aria-label',
    cancelButtonText: 'Cancel button',
    cancelButtonAriaLabel: 'Cancel button aria-label',
    footer: '<b>Footer</b>'
  })
  assert.ok(Pleasant.getImage().src.indexOf('/assets/padn-logo.png'))
  assert.equal(Pleasant.getActions().textContent, 'Confirm buttonCancel button')
  assert.equal(Pleasant.getConfirmButton().innerText, 'Confirm button')
  assert.equal(Pleasant.getCancelButton().innerText, 'Cancel button')
  assert.equal(Pleasant.getConfirmButton().getAttribute('aria-label'), 'Confirm button aria-label')
  assert.equal(Pleasant.getCancelButton().getAttribute('aria-label'), 'Cancel button aria-label')
  assert.equal(Pleasant.getFooter().innerHTML, '<b>Footer</b>')

  Pleasant({input: 'text'})
  $('.padn-input').val('input text')
  assert.equal(Pleasant.getInput().value, 'input text')

  Pleasant({
    input: 'radio',
    inputOptions: {
      'one': 'one',
      'two': 'two'
    }
  })
  $('.padn-radio input[value="two"]').prop('checked', true)
  assert.equal(Pleasant.getInput().value, 'two')
})

QUnit.test('custom buttons classes', (assert) => {
  Pleasant({
    text: 'Modal with custom buttons classes',
    confirmButtonClass: 'btn btn-success ',
    cancelButtonClass: 'btn btn-warning '
  })
  assert.ok($('.padn-confirm').hasClass('btn'))
  assert.ok($('.padn-confirm').hasClass('btn-success'))
  assert.ok($('.padn-cancel').hasClass('btn'))
  assert.ok($('.padn-cancel').hasClass('btn-warning'))

  Pleasant('Modal with default buttons classes')
  assert.notOk($('.padn-confirm').hasClass('btn'))
  assert.notOk($('.padn-confirm').hasClass('btn-success'))
  assert.notOk($('.padn-cancel').hasClass('btn'))
  assert.notOk($('.padn-cancel').hasClass('btn-warning'))
})

QUnit.test('content/title is set (html)', (assert) => {
  Pleasant({
    title: '<strong>Strong</strong>, <em>Emphasis</em>',
    html: '<p>Paragraph</p><img /><button></button>'
  })

  assert.equal($('strong, em', '.padn-title').length, 2)
  assert.equal($('p, img, button', '.padn-content').length, 3)
})

QUnit.test('content/title is set (text)', (assert) => {
  Pleasant({
    titleText: '<strong>Strong</strong>, <em>Emphasis</em>',
    text: '<p>Paragraph</p><img /><button></button>'
  })

  assert.equal($('.padn-title').text(), '<strong>Strong</strong>, <em>Emphasis</em>')
  assert.equal($('.padn-content').text(), '<p>Paragraph</p><img /><button></button>')
  assert.equal($('strong, em', '.padn-title').length, 0)
  assert.equal($('p, img, button', '.padn-content').length, 0)
})

QUnit.test('jQuery/js element as html param', (assert) => {
  Pleasant({
    html: $('<p>jQuery element</p>')
  })
  assert.equal($('#padn-content').html(), '<p>jQuery element</p>')

  const p = document.createElement('p')
  p.textContent = 'js element'
  Pleasant({
    html: p
  })
  assert.equal($('#padn-content').html(), '<p>js element</p>')
})

QUnit.test('set and reset defaults', (assert) => {
  Pleasant.setDefaults({confirmButtonText: 'Next >', showCancelButton: true})
  Pleasant('Modal with changed defaults')
  assert.equal($('.padn-confirm').text(), 'Next >')
  assert.ok($('.padn-cancel').is(':visible'))

  Pleasant.resetDefaults()
  Pleasant('Modal after resetting defaults')
  assert.equal($('.padn-confirm').text(), 'OK')
  assert.ok($('.padn-cancel').is(':hidden'))

  Pleasant.clickCancel()
})

QUnit.test('input text', (assert) => {
  const done = assert.async()

  const string = 'Live for yourself'
  Pleasant({input: 'text'}).then((result) => {
    assert.equal(result.value, string)
    done()
  })

  $('.padn-input').val(string)
  Pleasant.clickConfirm()
})

QUnit.test('validation error', (assert) => {
  const done = assert.async()
  const inputValidator = (value) => Promise.resolve(!value && 'no falsy values')

  Pleasant({input: 'text', animation: false, inputValidator})
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

QUnit.test('built-in email validation', (assert) => {
  const done = assert.async()

  var validEmailAddress = 'team+support+a.b@example.com'
  Pleasant({input: 'email'}).then((result) => {
    assert.equal(result.value, validEmailAddress)
    done()
  })

  $('.padn-input').val(validEmailAddress)
  Pleasant.clickConfirm()
})

QUnit.test('input select', (assert) => {
  const done = assert.async()

  const selected = 'dos'
  Pleasant({
    input: 'select',
    inputOptions: {uno: 1, dos: 2}
  }).then((result) => {
    assert.equal(result.value, selected)
    done()
  })

  $('.padn-select').val(selected)
  Pleasant.clickConfirm()
})

QUnit.test('input checkbox', (assert) => {
  const done = assert.async()

  Pleasant({input: 'checkbox', inputAttributes: {name: 'test-checkbox'}}).then((result) => {
    assert.equal(checkbox.attr('name'), 'test-checkbox')
    assert.equal(result.value, '1')
    done()
  })

  const checkbox = $('.padn-checkbox input')
  checkbox.prop('checked', true)
  Pleasant.clickConfirm()
})

QUnit.test('input range', (assert) => {
  Pleasant({input: 'range', inputAttributes: {min: 1, max: 10}, inputValue: 5})
  const input = $('.padn-range input')
  assert.equal(input.attr('min'), '1')
  assert.equal(input.attr('max'), '10')
  assert.equal(input.val(), '5')
})

QUnit.test('input type "select", inputOptions Map', (assert) => {
  const inputOptions = new Map()
  inputOptions.set(2, 'Richard Stallman')
  inputOptions.set(1, 'Linus Torvalds')
  Pleasant({
    input: 'select',
    inputOptions,
    inputValue: 1,
    animation: false
  })
  assert.equal($('.padn-select option').length, 2)
  assert.equal($('.padn-select option')[0].innerHTML, 'Richard Stallman')
  assert.equal($('.padn-select option')[0].value, '2')
  assert.equal($('.padn-select option')[1].innerHTML, 'Linus Torvalds')
  assert.equal($('.padn-select option')[1].value, '1')
  assert.equal($('.padn-select option')[1].selected, true)
})

QUnit.test('input type "radio", inputOptions Map', (assert) => {
  const inputOptions = new Map()
  inputOptions.set(2, 'Richard Stallman')
  inputOptions.set(1, 'Linus Torvalds')
  Pleasant({
    input: 'radio',
    inputOptions,
    inputValue: 1
  })
  assert.equal($('.padn-radio label').length, 2)
  assert.equal($('.padn-radio label')[0].textContent, 'Richard Stallman')
  assert.equal($('.padn-radio input')[0].value, '2')
  assert.equal($('.padn-radio label')[1].textContent, 'Linus Torvalds')
  assert.equal($('.padn-radio input')[1].value, '1')
  assert.equal($('.padn-radio input')[1].checked, true)
})

QUnit.test('queue', (assert) => {
  const done = assert.async()
  const steps = ['Step 1', 'Step 2']

  assert.equal(Pleasant.getQueueStep(), null)

  Pleasant.setDefaults({animation: false})
  Pleasant.queue(steps).then(() => {
    Pleasant('All done!')
  })

  assert.equal($('.padn-modal h2').text(), 'Step 1')
  assert.equal(Pleasant.getQueueStep(), 0)
  Pleasant.clickConfirm()

  setTimeout(() => {
    assert.equal($('.padn-modal h2').text(), 'Step 2')
    assert.equal(Pleasant.getQueueStep(), 1)
    Pleasant.clickConfirm()

    setTimeout(() => {
      assert.equal($('.padn-modal h2').text(), 'All done!')
      assert.equal(Pleasant.getQueueStep(), null)
      Pleasant.clickConfirm()

      // test queue is cancelled on first step, other steps shouldn't be shown
      Pleasant.queue(steps)
      Pleasant.clickCancel()
      assert.notOk(Pleasant.isVisible())
      done()
    }, TIMEOUT)
  }, TIMEOUT)
})

QUnit.test('dymanic queue', (assert) => {
  const done = assert.async()
  const steps = [
    {
      title: 'Step 1',
      preConfirm: () => {
        return new Promise((resolve) => {
          // insert to the end by default
          Pleasant.insertQueueStep('Step 3')
          // step to be deleted
          Pleasant.insertQueueStep('Step to be deleted')
          // insert with positioning
          Pleasant.insertQueueStep({
            title: 'Step 2',
            preConfirm: () => {
              return new Promise((resolve) => {
                Pleasant.deleteQueueStep(3)
                resolve()
              })
            }
          }, 1)
          resolve()
        })
      }
    }
  ]

  Pleasant.setDefaults({animation: false})
  setTimeout(() => {
    Pleasant.queue(steps).then(() => {
      Pleasant('All done!')
    })

    assert.equal($('.padn-modal h2').text(), 'Step 1')
    Pleasant.clickConfirm()

    setTimeout(() => {
      assert.equal($('.padn-modal h2').text(), 'Step 2')
      assert.equal(Pleasant.getQueueStep(), 1)
      Pleasant.clickConfirm()

      setTimeout(() => {
        assert.equal($('.padn-modal h2').text(), 'Step 3')
        assert.equal(Pleasant.getQueueStep(), 2)
        Pleasant.clickConfirm()

        setTimeout(() => {
          assert.equal($('.padn-modal h2').text(), 'All done!')
          assert.equal(Pleasant.getQueueStep(), null)
          Pleasant.clickConfirm()
          done()
        }, TIMEOUT)
      }, TIMEOUT)
    }, TIMEOUT)
  }, TIMEOUT)
})

QUnit.test('showLoading and hideLoading', (assert) => {
  Pleasant.showLoading()
  assert.ok($('.padn-actions').hasClass('padn-loading'))
  assert.ok($('.padn-cancel').is(':disabled'))

  Pleasant.hideLoading()
  assert.notOk($('.padn-actions').hasClass('padn-loading'))
  assert.notOk($('.padn-cancel').is(':disabled'))

  Pleasant({
    title: 'test loading state',
    showConfirmButton: false
  })

  Pleasant.showLoading()
  assert.ok($('.padn-actions').is(':visible'))
  assert.ok($('.padn-actions').hasClass('padn-loading'))

  Pleasant.hideLoading()
  assert.notOk($('.padn-actions').is(':visible'))
  assert.notOk($('.padn-actions').hasClass('padn-loading'))
})

QUnit.test('disable/enable buttons', (assert) => {
  Pleasant('test disable/enable buttons')

  Pleasant.disableButtons()
  assert.ok($('.padn-confirm').is(':disabled'))
  assert.ok($('.padn-cancel').is(':disabled'))

  Pleasant.enableButtons()
  assert.notOk($('.padn-confirm').is(':disabled'))
  assert.notOk($('.padn-cancel').is(':disabled'))

  Pleasant.disableConfirmButton()
  assert.ok($('.padn-confirm').is(':disabled'))

  Pleasant.enableConfirmButton()
  assert.notOk($('.padn-confirm').is(':disabled'))
})

QUnit.test('input radio', (assert) => {
  Pleasant({
    input: 'radio',
    inputOptions: {
      'one': 'one',
      'two': 'two'
    }
  })

  assert.equal($('.padn-radio label').length, 2)
  assert.equal($('.padn-radio input[type="radio"]').length, 2)
})

QUnit.test('disable/enable input', (assert) => {
  Pleasant({
    input: 'text'
  })

  Pleasant.disableInput()
  assert.ok($('.padn-input').is(':disabled'))
  Pleasant.enableInput()
  assert.notOk($('.padn-input').is(':disabled'))

  Pleasant({
    input: 'radio',
    inputOptions: {
      'one': 'one',
      'two': 'two'
    }
  })

  Pleasant.disableInput()
  $('.padn-radio radio').each((radio) => {
    assert.ok(radio.is(':disabled'))
  })
  Pleasant.enableInput()
  $('.padn-radio radio').each((radio) => {
    assert.notOk(radio.is(':disabled'))
  })
})

QUnit.test('default focus', (assert) => {
  const done = assert.async()

  Pleasant('Modal with the Confirm button only')
  assert.ok(document.activeElement === $('.padn-confirm')[0])

  Pleasant({
    text: 'Modal with two buttons',
    showCancelButton: true
  })
  assert.ok(document.activeElement === $('.padn-confirm')[0])

  Pleasant({
    text: 'Modal with an input',
    input: 'text'
  })
  setTimeout(() => {
    assert.ok(document.activeElement === $('.padn-input')[0])
    done()
  })
})

QUnit.test('reversed buttons', (assert) => {
  Pleasant({
    text: 'Modal with reversed buttons',
    reverseButtons: true
  })
  assert.ok($('.padn-confirm').index() - $('.padn-cancel').index() === 1)

  Pleasant('Modal with buttons')
  assert.ok($('.padn-cancel').index() - $('.padn-confirm').index() === 1)
})

QUnit.test('focusConfirm', (assert) => {
  Pleasant({
    showCancelButton: true
  })
  assert.ok(document.activeElement === $('.padn-confirm')[0])

  const anchor = $('<a href>link</a>')
  Pleasant({
    html: anchor,
    showCancelButton: true,
    focusConfirm: false
  })
  assert.ok(document.activeElement.outerHTML === anchor[0].outerHTML)
})

QUnit.test('focusCancel', (assert) => {
  Pleasant({
    text: 'Modal with Cancel button focused',
    showCancelButton: true,
    focusCancel: true
  })
  assert.ok(document.activeElement === $('.padn-cancel')[0])
})

QUnit.test('image alt text and custom class', (assert) => {
  Pleasant({
    text: 'Custom class is set',
    imageUrl: '/assets/padn-logo.png',
    imageAlt: 'Custom icon',
    imageClass: 'image-custom-class'
  })
  assert.ok($('.padn-image').hasClass('image-custom-class'))
  assert.equal($('.padn-image').attr('alt'), 'Custom icon')

  Pleasant({
    text: 'Custom class isn\'t set',
    imageUrl: '/assets/padn-logo.png'
  })
  assert.notOk($('.padn-image').hasClass('image-custom-class'))
})

QUnit.test('modal vertical offset', (assert) => {
  const done = assert.async(1)
  // create a modal with dynamic-height content
  Pleasant({
    imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNikAQAACIAHF/uBd8AAAAASUVORK5CYII=',
    title: 'Title',
    html: '<hr><div style="height: 50px"></div><p>Text content</p>',
    type: 'warning',
    input: 'text',
    animation: false
  })

  // listen for image load
  $('.padn-image').on('load', () => {
    const box = $('.padn-modal')[0].getBoundingClientRect()
    const delta = box.top - (box.bottom - box.height)
    // allow 1px difference, in case of uneven height
    assert.ok(Math.abs(delta) <= 1)
    done()
  })
})

QUnit.test('target', (assert) => {
  const warn = console.warn // Suppress the warnings
  console.warn = () => true // Suppress the warnings
  Pleasant('Default target')
  assert.equal(document.body, document.querySelector('.padn-container').parentNode)
  Pleasant.close()

  const dummyTargetElement = Object.assign(document.createElement('div'), {id: 'dummy-target'})
  document.body.appendChild(dummyTargetElement)

  Pleasant({title: 'Custom valid target (string)', target: '#dummy-target'}) // switch targets
  assert.equal(document.querySelector('.padn-container').parentNode, dummyTargetElement)
  Pleasant.close()

  Pleasant({title: 'Custom invalid target (string)', target: 'lorem_ipsum'}) // switch targets
  assert.equal(document.querySelector('.padn-container').parentNode, document.body)
  Pleasant.close()

  Pleasant({title: 'Custom valid target (element)', target: dummyTargetElement})
  assert.equal(document.querySelector('.padn-container').parentNode, dummyTargetElement)
  Pleasant.close()

  Pleasant({title: 'Custom invalid target (element)', target: true})
  assert.equal(document.body, document.querySelector('.padn-container').parentNode)
  Pleasant.close()
  console.warn = warn // Suppress the warnings
})

QUnit.test('onOpen', (assert) => {
  const done = assert.async()

  // create a modal with an onOpen callback
  Pleasant({
    title: 'onOpen test',
    onOpen: ($modal) => {
      assert.ok($('.padn-modal').is($modal))
      done()
    }
  })
})

QUnit.test('onBeforeOpen', (assert) => {
  const done = assert.async()

  // create a modal with an onBeforeOpen callback
  Pleasant({
    title: 'onBeforeOpen test',
    onBeforeOpen: ($modal) => {
      assert.ok($('.padn-modal').is($modal))
    }
  })

  // check that onBeforeOpen calls properly
  const dynamicTitle = 'Set onBeforeOpen title'
  Pleasant({
    title: 'onBeforeOpen test',
    onBeforeOpen: ($modal) => {
      $('.padn-title').html(dynamicTitle)
    },
    onOpen: () => {
      assert.equal($('.padn-title').html(), dynamicTitle)
      done()
    }
  })
})

QUnit.test('onAfterClose', (assert) => {
  const done = assert.async()
  let onCloseFinished = false

  // create a modal with an onAfterClose callback
  Pleasant({
    title: 'onAfterClose test',
    onClose: () => {
      onCloseFinished = true
    },
    onAfterClose: () => {
      assert.ok(onCloseFinished)
      assert.ok(!$('.padn-container').length)
      done()
    }
  })

  $('.padn-close').click()
})

QUnit.test('onClose', (assert) => {
  const done = assert.async()

  // create a modal with an onClose callback
  Pleasant({
    title: 'onClose test',
    onClose: (_$modal) => {
      assert.ok($modal.is(_$modal))
      assert.ok($('.padn-container').length)
      done()
    }
  })

  const $modal = $('.padn-modal')
  $('.padn-close').click()
})
QUnit.test('esc key', (assert) => {
  const done = assert.async()

  Pleasant({
    title: 'Esc me'
  }).then((result) => {
    assert.deepEqual(result, {dismiss: Pleasant.DismissReason.esc})
    done()
  })

  $(document).trigger($.Event('keydown', {
    key: 'Escape'
  }))
})

QUnit.test('allowEscapeKey as a function', (assert) => {
  const done = assert.async()

  let functionWasCalled = false
  const allowEscapeKey = () => {
    functionWasCalled = true
    return false
  }

  Pleasant({
    title: 'allowEscapeKey as a function',
    allowEscapeKey,
    animation: false,
    onOpen: () => {
      assert.equal(functionWasCalled, false)

      $(document).trigger($.Event('keydown', {
        key: 'Escape'
      }))

      setTimeout(() => {
        assert.equal(functionWasCalled, true)
        assert.ok(Pleasant.isVisible())

        done()
      })
    }
  })
})
QUnit.test('close button', (assert) => {
  const done = assert.async()

  Pleasant({
    title: 'Close button test',
    showCloseButton: true
  }).then((result) => {
    assert.deepEqual(result, {dismiss: Pleasant.DismissReason.close})
    done()
  })

  const $closeButton = $('.padn-close')
  assert.ok($closeButton.is(':visible'))
  assert.equal($closeButton.attr('aria-label'), 'Close this dialog')
  $closeButton.click()
})
QUnit.test('cancel button', (assert) => {
  const done = assert.async()

  Pleasant({
    title: 'Cancel me'
  }).then((result) => {
    assert.deepEqual(result, {dismiss: Pleasant.DismissReason.cancel})
    done()
  })

  Pleasant.clickCancel()
})
QUnit.test('timer', (assert) => {
  const done = assert.async()

  Pleasant({
    title: 'Timer test',
    timer: 10,
    animation: false
  }).then((result) => {
    assert.deepEqual(result, {dismiss: Pleasant.DismissReason.timer})
    done()
  })
})
QUnit.test('confirm button', (assert) => {
  const done = assert.async()
  Pleasant({
    input: 'radio',
    inputOptions: {
      'one': 'one',
      'two': 'two'
    }
  }).then((result) => {
    assert.deepEqual(result, {value: 'two'})
    done()
  })
  $('.padn-radio input[value="two"]').prop('checked', true)
  Pleasant.clickConfirm()
})

QUnit.test('on errors in *async* user-defined functions, cleans up and propagates the error', (assert) => {
  const done = assert.async()

  const expectedError = new Error('my bad')
  const erroringFunction = () => {
    return Promise.reject(expectedError)
  }

  // inputValidator
  const rejectedPromise = Pleasant({input: 'text', expectRejections: false, inputValidator: erroringFunction})
  Pleasant.clickConfirm()
  rejectedPromise.catch((error) => {
    assert.equal(error, expectedError) // error is bubbled up back to user code
    setTimeout(() => {
      assert.notOk(Pleasant.isVisible()) // display is cleaned up

      // preConfirm
      const rejectedPromise = Pleasant({expectRejections: false, preConfirm: erroringFunction})
      Pleasant.clickConfirm()
      rejectedPromise.catch((error) => {
        assert.equal(error, expectedError) // error is bubbled up back to user code
        setTimeout(() => {
          assert.notOk(Pleasant.isVisible()) // display is cleaned up

          done()
        })
      })
    })
  })
})

QUnit.test('params validation', (assert) => {
  assert.ok(Pleasant.isValidParameter('title'))
  assert.notOk(Pleasant.isValidParameter('foobar'))
})

QUnit.test('addition and removal of backdrop', (assert) => {
  Pleasant({backdrop: false})
  assert.ok(document.body.classList.contains('padn-no-backdrop'))
  assert.ok(document.documentElement.classList.contains('padn-no-backdrop'))
  Pleasant({title: 'test'})
  assert.notOk(document.body.classList.contains('padn-no-backdrop'))
  assert.notOk(document.documentElement.classList.contains('padn-no-backdrop'))
})

QUnit.test('footer', (assert) => {
  Pleasant({title: 'Modal with footer', footer: 'I am footer'})
  assert.ok($('.padn-footer').is(':visible'))

  Pleasant('Modal w/o footer')
  assert.notOk($('.padn-footer').is(':visible'))
})

QUnit.test('null values', (assert) => {
  const defaultParams = require('../../src/js/utils/params').default
  const params = {}
  Object.keys(defaultParams).forEach(key => {
    params[key] = null
  })
  Pleasant(params)
  assert.ok(Pleasant.isVisible())
})

QUnit.test('backdrop accepts css background param', (assert) => {
  let backdrop = 'rgb(123, 123, 123)'
  Pleasant({
    title: 'I have no backdrop',
    backdrop: false
  })
  assert.notOk($('.padn-container')[0].style.background)

  Pleasant({
    title: 'I have a custom backdrop',
    backdrop: backdrop
  })
  assert.ok($('.padn-container')[0].style.background.includes(backdrop))
})

QUnit.test('preConfirm return false', (assert) => {
  Pleasant({
    preConfirm: () => {
      return false
    },
    animation: false
  })

  Pleasant.clickConfirm()
  assert.ok(Pleasant.isVisible())
})

QUnit.test('animation param evaluates a function', (assert) => {
  Pleasant({
    animation: () => false
  })
  assert.ok($('.padn-popup').hasClass('padn-noanimation'))

  Pleasant({
    animation: () => true
  })
  assert.notOk($('.padn-popup').hasClass('padn-noanimation'))
})

QUnit.test('Custom content', (assert) => {
  const done = assert.async()
  Pleasant({
    showCancelButton: true,
    onOpen: () => {
      Pleasant.getContent().textContent = 'Custom content'
      Pleasant.clickConfirm()
    },
    preConfirm: () => {
      return 'Some data from custom control'
    }
  }).then(result => {
    assert.ok(result.value)
    done()
  })
})

QUnit.test('inputValue as a Promise', (assert) => {
  const inputTypes = ['text', 'email', 'number', 'tel', 'textarea']
  const done = assert.async(inputTypes.length)
  const value = '1.1 input value'
  const inputValue = new Promise((resolve, reject) => {
    resolve('1.1 input value')
  })
  inputTypes.forEach(input => {
    Pleasant({
      input,
      inputValue,
      animation: false,
      onOpen: (modal) => {
        setTimeout(() => {
          const inputEl = input === 'textarea' ? modal.querySelector('.padn-textarea') : modal.querySelector('.padn-input')
          assert.equal(inputEl.value, input === 'number' ? parseFloat(value) : value)
          done()
        }, TIMEOUT)
      }
    })
  })
})
