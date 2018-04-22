/* global QUnit */
const {Pleasant, initialPleasantPropNames} = require('../helpers')

QUnit.test('properties of `Pleasant` class are consistent', (assert) => {
  const done = assert.async()
  const assertConsistent = postfix => {
    const currentPleasantPropNames = Object.keys(Pleasant)
    const extraPropNames = currentPleasantPropNames.filter(key => !initialPleasantPropNames.includes(key))
    assert.deepEqual(extraPropNames.length, 0, `# of extra properties ${postfix}`)
    assert.deepEqual(extraPropNames.join(','), '', `extra property names ${postfix}`)
    const missingProps = currentPleasantPropNames.filter(key => !currentPleasantPropNames.includes(key))
    assert.deepEqual(missingProps.length, 0, `# of missing properties ${postfix}`)
    assert.deepEqual(missingProps.join(','), '', `missing property names ${postfix}`)
  }
  assertConsistent('before first pleasant')
  Pleasant({
    title: 'test',
    onOpen: () => {
      assertConsistent('after opening first pleasant')
      Pleasant.clickConfirm()
    }
  }).then(() => {
    assertConsistent('after closing first pleasant')
    done()
  })
})

QUnit.test('defaults are applied to undefined arguments in shorthand calls', (assert) => {
  const done = assert.async()
  Pleasant.setDefaults({
    html: 'foo',
    onOpen: () => {
      assert.equal(Pleasant.getTitle().textContent, 'bar')
      assert.equal(Pleasant.getContent().textContent, 'foo')
      Pleasant.resetDefaults()
      done()
    }
  })
  Pleasant('bar')
})

QUnit.test('ways to instantiate', (assert) => {
  assert.ok((new Pleasant('foo')) instanceof Pleasant)
  assert.ok(Pleasant.fire('foo') instanceof Pleasant)
  assert.ok(Pleasant('foo') instanceof Pleasant)
})

QUnit.test('instance properties and methods', (assert) => {
  const params = { input: 'text', inputValue: 'foo' }
  const pleasant = Pleasant(params)
  assert.deepEqual(Object.keys(pleasant), ['params'])
  assert.deepEqual(pleasant.params, params)
  assert.equal(pleasant.getInput().value, 'foo')
})

QUnit.test('extending pleasant', (assert) => {
  const done = assert.async()
  const MyPleasant = class extends Pleasant {
    static argsToParams (args) {
      assert.deepEqual(args, ['arg'])
      return { title: 'title' }
    }
    _main (params) {
      assert.deepEqual(params, { title: 'title' })
      return super._main({
        input: 'text',
        inputValue: 'inputValue',
        onOpen: () => MyPleasant.clickConfirm()
      }).then(result => {
        assert.deepEqual(result, { value: 'inputValue' })
        return 'result'
      })
    }
  }
  MyPleasant.fire('arg').then(result => {
    assert.equal(result, 'result')
    done()
  })
})
