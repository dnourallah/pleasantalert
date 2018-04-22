/* global QUnit */
const { Pleasant } = require('../helpers')

QUnit.test('basic mixin', (assert) => {
  const done = assert.async()
  const MyPleasant = Pleasant.mixin({ title: '1_title' })
  const pleasant = MyPleasant({
    onOpen: () => {
      assert.equal(MyPleasant.getTitle().textContent, '1_title')
      MyPleasant.clickConfirm()
    }
  })
  assert.ok(pleasant instanceof MyPleasant)
  assert.ok(pleasant instanceof Pleasant)
  pleasant.then((result) => {
    assert.deepEqual(result, { value: true })
    done()
  })
})

QUnit.test('mixins and shorthand calls', (assert) => {
  const done = assert.async()
  const MyPleasant = Pleasant.mixin({
    title: 'no effect',
    html: 'no effect',
    onOpen: () => {
      assert.equal(MyPleasant.getTitle().textContent, '2_title')
      assert.equal(MyPleasant.getContent().textContent, '2_html')
      MyPleasant.clickConfirm()
      done()
    }
  })
  MyPleasant('2_title', '2_html')
})
