import React from 'react'
import Memo from './memo.jsx'
import './app.css'

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
    return <div className="app--root">
      {/* <nav className="app--navbar">
      </nav> */}
      <Memo/>
    </div>
  }
}
