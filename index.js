'use strict'

let React = require('react')
let X18N = require('x18n')
let EventEmitter = require('events')

let LanguageEventEmitter = new EventEmitter()

LanguageEventEmitter.setMaxListeners(0)

X18N.on(['lang:change', 'dict:change'], function () {
  LanguageEventEmitter.emit('updateComponents')
})

let X18NSpanElement = React.createClass({
  getInitialState: function () {
    return {}
  },

  getInitialProps: function () {
    return {isPlural: false, _args: []}
  },

  _update: function () {
    this.forceUpdate()
  },

  componentWillMount: function () {
    LanguageEventEmitter.on('updateComponents', this._update)
  },

  componentWillUnmount: function () {
    LanguageEventEmitter.removeListener('updateComponents', this._update)
  },

  render: function () {
    let result = 'error'

    if (this.props.isPlural === true) {
      let args = Array.prototype.slice.call(this.props._args)
      let key = args.shift()

      result = X18N.t(key).plural.apply(null, args)
    } else {
      result = X18N.t.apply(null, this.props._args)
    }

    return React.createElement('span', '', result)
  }
})

let react_x18n_t = function () {
  return React.createElement(X18NSpanElement, {isPlural: false, _args: arguments}, '')
}

react_x18n_t.plural = function () {
  return React.createElement(X18NSpanElement, {isPlural: true, _args: arguments}, '')
}

let react_x18n = {
  x18n: X18N,
  t: react_x18n_t
}

module.exports = react_x18n
