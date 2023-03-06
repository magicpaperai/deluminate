import React from 'react'
import ReactDOM from 'react-dom'
import {SimpleCard, Card, Document} from './index'
import styles from './styles.css'

function App() {
  return (
    <div className={styles.wrapper}>
      <SimpleCard title='New Chapter' subtitle='Document' />
      <Card url="https://github.com/magicpaperai/deluminate" />
      <Card url="https://twitter.com/simonbchen/status/1617693408340086784" />
      <Card url="https://twitter.com/simonbchen/status/1617693408340086784" compact />
      <Card url="http://paulgraham.com/read.html" />
      <Card url="http://mattneary.com" />
      <Document url="http://www.americanyawp.com/text/16-capital-and-labor/" />
    </div>
  )
}

ReactDOM.render(<App />, document.body)
