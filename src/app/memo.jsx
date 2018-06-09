import React, {Component} from 'react'
import Editor from 'draft-js-plugins-editor'
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin'
import Draft, {
  convertToRaw,
  convertFromRaw,
  EditorState,
} from 'draft-js'
import Prism from 'prismjs'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-scala'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-perl'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-swift'
import createPrismPlugin from 'draft-js-prism-plugin'
import 'draft-js/dist/Draft.css'
// import 'prismjs/themes/Prism.css'
import 'prism-themes/themes/prism-vs.css'
import './memo.css'
const plugins = [
  createPrismPlugin({prism: Prism}),
  createMarkdownShortcutsPlugin(),
]

export default class DemoEditor extends Component {
  constructor(...props) {
    super(...props)

    this.state = {
      editorState: EditorState.createEmpty(),
      initialized: false,
    }
    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
    Promise.resolve()
      .then(() => new Promise((resolve) => {
        chrome.storage.sync.get('data', ({data}) => {
          resolve(data)
        })
      }))
      .then((raw) => {
        console.log(raw)
        let editorState
        if (raw == null || raw.length == 0) {
          editorState = EditorState.createEmpty()
        } else {
          const fromRaw = convertFromRaw(raw)
          editorState = EditorState.createWithContent(fromRaw)
        }
        this.setState({initialized: true, editorState})
      })
  }

  onChange(editorState) {
    this.setState({
      editorState,
    })
    if (this.state.initialized) {
      const raw = convertToRaw(this.state.editorState.getCurrentContent())
      chrome.storage.sync.set({'data': raw})
    }
  }

  render() {
    return <div className='memo--root'>
      <div className='memo--editor' onClick={this.focus}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          spellCheck
          autoFocus
          placeholder="Write something here..."
        />
      </div>
    </div>
  }
}
