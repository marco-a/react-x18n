'use strict'
// make standard.js happy:
/* global jest, describe, it, expect */

console.log('')
let unmockedRequire = function (module) {
  console.log('Loading "' + module + '" without mocking it.')

  jest.dontMock(module)
  return require(module)
}

// -- Required modules for testing
let React = unmockedRequire('react')
let ReactDOM = unmockedRequire('react-dom')
let ReactTU = unmockedRequire('react-addons-test-utils')

// -- Don't mock x18n
jest.dontMock('x18n')

// -- Disable all outputs
console.log = function () {}

describe('react_x18n', function () {
  let X18NReactModule = unmockedRequire('../index.js')

  it('should be sane', function () {
    expect(React).toBeDefined()
    expect(ReactDOM).toBeDefined()
    expect(ReactTU).toBeDefined()
    expect(X18NReactModule).toBeDefined()
    expect(X18NReactModule.t).toBeDefined()
    expect(X18NReactModule.t.plural).toBeDefined()

    // Disable asynchronous events
    X18NReactModule.x18n.__asyncEvents = false

    expect(function () {
      X18NReactModule.x18n.register('l1', {
        key1: 'l1-translated-key1-%{value}',
        key2: 'l1-translated-key2-%1',
        key3: 'l1-translated-key3-%3-%1-%2',
        plural: {
          1: 'l1-plural',
          2: 'l1-plural-2',
          n: 'l1-plural-n-%1'
        }
      })

      X18NReactModule.x18n.register('l2', {
        key1: 'l2-translated-key1-%{value}',
        key2: 'l2-translated-key2-%1',
        key3: 'l2-translated-key3-%3-%1-%2',
        plural: {
          1: 'l2-plural',
          2: 'l2-plural-2',
          n: 'l2-plural-n-%1'
        }
      })

      X18NReactModule.x18n.set('l2')
    }).not.toThrow()
  })

  it('should export the x18n.js API', function () {
    expect(X18NReactModule.x18n).toBeDefined()
    expect(X18NReactModule.x18n.t).toBeDefined()
    expect(X18NReactModule.x18n.on).toBeDefined()
    expect(X18NReactModule.x18n.register).toBeDefined()
  })

  it('should export the translation API', function () {
    expect(X18NReactModule.t).toBeDefined()
    expect(X18NReactModule.t.plural).toBeDefined()
  })

  describe('t(\'key\')', function () {
    it('should return a SPAN react element', function () {
      expect(function () {
        let X18NElement = ReactDOM.findDOMNode(ReactTU.renderIntoDocument(X18NReactModule.t('key1')))

        expect(X18NElement.tagName).toEqual('SPAN')
        ReactDOM.unmountComponentAtNode(X18NElement.parentNode)
      }).not.toThrow()
    })

    describe('api passthrough', function () {
      it('should pass an object argument', function () {
        let X18NElement = ReactDOM.findDOMNode(ReactTU.renderIntoDocument(X18NReactModule.t('key1', {value: 'val'})))
        expect(X18NElement.textContent).toEqual('l2-translated-key1-val')
        ReactDOM.unmountComponentAtNode(X18NElement.parentNode)
      })

      it('should pass a single argument', function () {
        let X18NElement = ReactDOM.findDOMNode(ReactTU.renderIntoDocument(X18NReactModule.t('key2', 'val')))
        expect(X18NElement.textContent).toEqual('l2-translated-key2-val')
        ReactDOM.unmountComponentAtNode(X18NElement.parentNode)
      })

      it('should pass multiple arguments', function () {
        let X18NElement1 = ReactDOM.findDOMNode(ReactTU.renderIntoDocument(X18NReactModule.t('key3', 1, 2, 3)))
        expect(X18NElement1.textContent).toEqual('l2-translated-key3-3-1-2')
        ReactDOM.unmountComponentAtNode(X18NElement1.parentNode)

        // -- Change order
        let X18NElement2 = ReactDOM.findDOMNode(ReactTU.renderIntoDocument(X18NReactModule.t('key3', 3, 2, 1)))
        expect(X18NElement2.textContent).toEqual('l2-translated-key3-1-3-2')
        ReactDOM.unmountComponentAtNode(X18NElement2.parentNode)
      })
    })

    describe('auto update functionality', function () {
      it('should update (object as argument)', function () {
        // Object argument
        let X18NElement = ReactDOM.findDOMNode(ReactTU.renderIntoDocument(X18NReactModule.t('key1', {value: 'val'})))
        expect(X18NElement.textContent).toEqual('l2-translated-key1-val')

        // Change language
        X18NReactModule.x18n.set('l1')
        expect(X18NElement.textContent).toEqual('l1-translated-key1-val')
        ReactDOM.unmountComponentAtNode(X18NElement.parentNode)

        // Restore language
        X18NReactModule.x18n.set('l2')
        expect(X18NElement.textContent).toEqual('l1-translated-key1-val')
      })

      it('should update (single value as argument)', function () {
        let X18NElement = ReactDOM.findDOMNode(ReactTU.renderIntoDocument(X18NReactModule.t('key2', 'val')))
        expect(X18NElement.textContent).toEqual('l2-translated-key2-val')

        // Change language
        X18NReactModule.x18n.set('l1')
        expect(X18NElement.textContent).toEqual('l1-translated-key2-val')
        ReactDOM.unmountComponentAtNode(X18NElement.parentNode)

        // Restore language
        X18NReactModule.x18n.set('l2')
        expect(X18NElement.textContent).toEqual('l1-translated-key2-val')
      })

      it('should update (multiple values as argument)', function () {
        let X18NElement1 = ReactDOM.findDOMNode(ReactTU.renderIntoDocument(X18NReactModule.t('key3', 1, 2, 3)))
        expect(X18NElement1.textContent).toEqual('l2-translated-key3-3-1-2')

        // Change language
        X18NReactModule.x18n.set('l1')
        expect(X18NElement1.textContent).toEqual('l1-translated-key3-3-1-2')
        ReactDOM.unmountComponentAtNode(X18NElement1.parentNode)

        // Restore language
        X18NReactModule.x18n.set('l2')
        expect(X18NElement1.textContent).toEqual('l1-translated-key3-3-1-2')

        // --- Change order

        let X18NElement2 = ReactDOM.findDOMNode(ReactTU.renderIntoDocument(X18NReactModule.t('key3', 3, 2, 1)))
        expect(X18NElement2.textContent).toEqual('l2-translated-key3-1-3-2')

        // Change language
        X18NReactModule.x18n.set('l1')
        expect(X18NElement2.textContent).toEqual('l1-translated-key3-1-3-2')
        ReactDOM.unmountComponentAtNode(X18NElement2.parentNode)

        // Restore language
        X18NReactModule.x18n.set('l2')
        expect(X18NElement2.textContent).toEqual('l1-translated-key3-1-3-2')
      })
    })
  })

  describe('t.plural(\'key\')', function () {
    it('should return a SPAN react element', function () {
      expect(function () {
        let X18NElement = ReactDOM.findDOMNode(ReactTU.renderIntoDocument(X18NReactModule.t.plural('plural', 1)))

        expect(X18NElement.tagName).toEqual('SPAN')
        ReactDOM.unmountComponentAtNode(X18NElement.parentNode)
      }).not.toThrow()
    })

    describe('api passthrough', function () {
      it('should return the correct value for n=1', function () {
        let X18NElement = ReactDOM.findDOMNode(ReactTU.renderIntoDocument(X18NReactModule.t.plural('plural', 1)))
        expect(X18NElement.textContent).toEqual('l2-plural')
        ReactDOM.unmountComponentAtNode(X18NElement.parentNode)
      })

      it('should return the correct value for n=2', function () {
        let X18NElement = ReactDOM.findDOMNode(ReactTU.renderIntoDocument(X18NReactModule.t.plural('plural', 2)))
        expect(X18NElement.textContent).toEqual('l2-plural-2')
        ReactDOM.unmountComponentAtNode(X18NElement.parentNode)
      })

      it('should return the correct value for n=10', function () {
        let X18NElement = ReactDOM.findDOMNode(ReactTU.renderIntoDocument(X18NReactModule.t.plural('plural', 10)))
        expect(X18NElement.textContent).toEqual('l2-plural-n-10')
        ReactDOM.unmountComponentAtNode(X18NElement.parentNode)
      })
    })

    describe('auto update functionality', function () {
      it('should update for the correct value (n=1)', function () {
        let X18NElement = ReactDOM.findDOMNode(ReactTU.renderIntoDocument(X18NReactModule.t.plural('plural', 1)))
        expect(X18NElement.textContent).toEqual('l2-plural')

        // Change language
        X18NReactModule.x18n.set('l1')
        expect(X18NElement.textContent).toEqual('l1-plural')
        ReactDOM.unmountComponentAtNode(X18NElement.parentNode)

        // Restore language
        X18NReactModule.x18n.set('l2')
        expect(X18NElement.textContent).toEqual('l1-plural')
      })

      it('should update for the correct value (n=2)', function () {
        let X18NElement = ReactDOM.findDOMNode(ReactTU.renderIntoDocument(X18NReactModule.t.plural('plural', 2)))
        expect(X18NElement.textContent).toEqual('l2-plural-2')

        // Change language
        X18NReactModule.x18n.set('l1')
        expect(X18NElement.textContent).toEqual('l1-plural-2')
        ReactDOM.unmountComponentAtNode(X18NElement.parentNode)

        // Restore language
        X18NReactModule.x18n.set('l2')
        expect(X18NElement.textContent).toEqual('l1-plural-2')
      })

      it('should update for the correct value (n=10)', function () {
        let X18NElement = ReactDOM.findDOMNode(ReactTU.renderIntoDocument(X18NReactModule.t.plural('plural', 10)))
        expect(X18NElement.textContent).toEqual('l2-plural-n-10')

        // Change language
        X18NReactModule.x18n.set('l1')
        expect(X18NElement.textContent).toEqual('l1-plural-n-10')
        ReactDOM.unmountComponentAtNode(X18NElement.parentNode)

        // Restore language
        X18NReactModule.x18n.set('l2')
        expect(X18NElement.textContent).toEqual('l1-plural-n-10')
      })
    })
  })
})
