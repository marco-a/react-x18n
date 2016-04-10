# react-x18n: internationalisation for react [![Build status](https://travis-ci.org/marco-a/react-x18n.svg)](https://travis-ci.org/marco-a/react-x18n)
[x18n.js](//github.com/florian/x18n) is an internationalisation library for JavaScript and **react-x18n** is a helper library which takes care of updating the user interface for you.

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## How to use it

Just require the module whenever you need internationalisation:
```js
let {x18n, t} = require('react-x18n')
```
As you can see the `react-x18n` module exports two objects: `x18n` and `t`:

Use the `x18n` property to access the API provided by x18n.js (registering dictionaries, changing language, etc.).
**But instead of using the `t` function provided by x18n.js, use the `t` function provided by `react-x18n` to create self-updating elements.**

[To learn about the x18n.js API, head over to the repository.](https://github.com/florian/x18n)

## How does it work?

`t('key')` and `t.plural('key')` both will return a new react element that will take care of updating itself dynamically.
This means you don't need to worry about updating the UI when the language changes.

### Example
```js
let React = require('react')
let ReactDOM = require('react-dom')
let {x18n, t} = require('react-x18n')

// Dictionary for english language
x18n.register('en', {
  'greeting': 'Hello %{name}!',
  'users_online': {
    1: 'There is one user online.',
    n: 'There are %1 users online.'
  }
})

// Dictionary for german language
x18n.register('de', {
  'greeting': 'Hallo %{name}!',
  'users_online': {
    1: 'Es ist ein Benutzer online.',
    n: 'Es sind %1 Benuzer online.'
  }
})

// Create react element
let App = React.createClass({
  _changeDE: function () {
    // Change language to german
    x18n.set('de')
  },

  _changeEN: function () {
    // Change language to english
    x18n.set('en')
  },

  render: function () {
    return <div>
      {t('greeting', {name: 'Peter'})} <br />
      {t.plural('users_online', 10)} <br />
      {t.plural('users_online', 1)}
      <hr />
      <span onClick={this._changeDE}>Change language to DE</span> <br />
      <span onClick={this._changeEN}>Change Language to EN</span>
    </div>
  }
})

// Render the app
ReactDOM.render(<App />, document.getElementById('app'))

```

## Installation and tests
```sh
npm install react-x18n --save
```

This will automatically install the x18n.js library for you as well.

---

To run tests (standard.js compliance check and jest unit tests):

```sh
npm test
```

## Roadmap

**- Enhance API:**
- Add local language file support.
- Make more information available through the API (currentLanguage, etc.) (maybe needs push request for x18n.js)

**- Misc:**
- Better unit-tests.