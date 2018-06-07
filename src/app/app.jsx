import React from 'react'
import css from './app.css'

export default class Main extends React.Component {
  constructor(...props) {
    super(...props)
    this.state = {
    }
  }

  componentDidMount() {
    document.title = 'newTab'
  }

  render() {
    return <div className={css.root}>
      <nav className={css.navbar}>
      </nav>
    </div>
  }
}
