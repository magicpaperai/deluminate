import React from 'react'
import _ from 'lodash'
import cx from 'classnames'
import styles from './styles.css'

function load(url) {
  return fetch('/scrape', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    referrerPolicy: 'no-referrer',
    body: JSON.stringify({url})
  }).then(async data => {
    const body = await data.json()
    console.log(body)
    return body
  })
}

function readDomain(url) {
  const obj = new URL(url)
  return obj.hostname
}

function Icon({src, title}) {
  const [ready, setReady] = React.useState(false)
  React.useEffect(() => {
    const img = new Image()
    img.onload = () => setReady(true)
    img.src = src
  }, [src])
  return ready ? <img src={src} /> : <span className={styles.icon}>{title?.[0]}</span>
}

export function Card({url, compact = false}) {
  const [metadata, setMetadata] = React.useState(null)
  React.useEffect(() => {
    load(url).then(md => setMetadata(md))
  }, [url])
  if (_.isNil(metadata)) {
    return (
      <div className={cx(styles.card, styles.loading)}>
        <header>
          <img src="/static/oval.svg" />
          <hgroup>
            <h2>Loading...</h2>
          </hgroup>
        </header>
      </div>
    )
  }
  const title = metadata.open_graph?.title || metadata.title
  return (
    <a href={url}>
      <div className={styles.card}>
        {!compact && !_.isEmpty(metadata.open_graph?.images) && <section>
          {metadata.open_graph?.images?.map(img => <img src={img.url} />)}
        </section>}
        {!compact && metadata.open_graph?.description && <section className={styles.description}>
          <p>{metadata.open_graph?.description}</p>
        </section>}
        <header>
          {metadata.favicon && <Icon src={metadata.favicon} title={title} />}
          <hgroup>
            <h2>{title}</h2>
            <h3>{readDomain(metadata.open_graph?.url || url)}</h3>
          </hgroup>
        </header>
      </div>
    </a>
  )
}
