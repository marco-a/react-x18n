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
