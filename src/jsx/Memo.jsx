/* global chrome */
import React from 'react'
import styles from './Memo.css'
import remark from 'remark'
import reactRenderer from 'remark-react'
const processor = remark().use(reactRenderer, {sanitize: false})

export default class Memo extends React.Component {
  constructor (...props) {
    super(...props)
    this.state = {
      markdown: '',
      contents: '',
      edit: false
    }
    this.changeToRender = this.changeToRender.bind(this)
    this.changeToEditor = this.changeToEditor.bind(this)
    this.editor = React.createRef()
  }
  componentDidMount () {
    Promise.resolve()
      .then(() => new Promise((resolve) => {
        chrome.storage.sync.get('data', ({data}) => {
          resolve(data)
        })
      }))
      .then((markdown) => {
        this.setState({markdown})
        return processor.process(markdown)
      })
      .then(({contents}) => {
        this.setState({contents})
      })
  }

  changeToRender () {
    const markdown = this.editor.current.innerText
    this.setState({markdown})
    processor.process(markdown).then(({contents}) => {
      this.setState({contents, edit: false})
    })
    chrome.storage.sync.set({'data': markdown})
  }

  changeToEditor () {
    this.setState({edit: true})
  }

  render () {
    return <div className={styles.Memo}>
      {(() => {
        if (this.state.edit) {
          return <div
            className={styles.Editor}
            ref={this.editor}
            contentEditable='plaintext-only'
            onKeyDown={(e) => {
              if (e.keyCode === 27) {
                this.changeToRender()
                e.preventDefault()
              }
            }}
            tabIndex="0">
            {this.state.markdown}
          </div>
        } else {
          return <div
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                this.changeToEditor()
                e.preventDefault()
              }
            }}
            className={styles.Render}
            tabIndex="0">
            {this.state.contents}
          </div>
        }
      })()}
    </div>
  }
}
