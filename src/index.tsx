import React from 'react'
import _ from 'lodash'
import cx from 'classnames'
import styles from './styles.css'
import LoaderImg from './oval.svg'

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

function read(url) {
  return fetch('/read', {
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
    if (!src) return
    const img = new Image()
    img.onload = () => setReady(true)
    img.src = src
  }, [src])
  return ready ? <img src={src} /> : <span className={styles.icon}>{title?.[0]}</span>
}

export function SimpleCard({title, subtitle, description = null, compact = false, onClick = null, grow = false}) {
  const [_collapsed, setCollapsed] = React.useState(true)
  const collapsed = compact ? _collapsed : false
  return (
    <a href="#" className={cx(grow && styles.grow)}>
      <div className={cx(styles.card, styles.loading)}>
        {!collapsed && description && <section className={styles.description}>
          <p>{description}</p>
        </section>}
        <header>
          <Icon src={null} title="★" />
          <hgroup>
            <h2>{title}</h2>
            <h3>{subtitle}</h3>
          </hgroup>
        </header>
      </div>
    </a>
  )
}

export function Card({url, compact = false, onClick = null, grow = false}) {
  const [metadata, setMetadata] = React.useState(null)
  const [_collapsed, setCollapsed] = React.useState(true)
  const collapsed = compact ? _collapsed : false
  React.useEffect(() => {
    load(url).then(md => setMetadata(md))
  }, [url])
  if (_.isNil(metadata)) {
    return (
      <a href="#" className={cx(grow && styles.grow)}>
        <div className={cx(styles.card, styles.loading)}>
          <header>
            <LoaderImg viewBox="0 0 38 38" />
            <hgroup>
              <h2>Loading...</h2>
            </hgroup>
          </header>
        </div>
      </a>
    )
  }
  const title = metadata.open_graph?.title || metadata.title
  return (
    <a
      href={url}
      onClick={evt => {
        if (compact && collapsed) {
          evt.preventDefault()
          setCollapsed(false)
        } else if (onClick) {
          evt.preventDefault()
          onClick()
        }
      }}
      className={cx(grow && styles.grow)}
    >
      <div className={styles.card}>
        {!collapsed && !_.isEmpty(metadata.open_graph?.images) && <section>
          {metadata.open_graph?.images?.map(img => <img src={img.url} />)}
        </section>}
        {!collapsed && metadata.open_graph?.description && <section className={styles.description}>
          <p>{metadata.open_graph?.description}</p>
        </section>}
        <header>
          <Icon src={metadata.favicon} title={title} />
          <hgroup>
            <h2>{title}</h2>
            <h3>{readDomain(metadata.open_graph?.url || url)}</h3>
          </hgroup>
        </header>
      </div>
    </a>
  )
}

export function Document({url}) {
  const [metadata, setMetadata] = React.useState(null)
  React.useEffect(() => {
    read(url).then(md => setMetadata(md))
  }, [url])
  if (_.isNil(metadata)) {
    return (
      <div className={styles.page}>
        <h1>Loading...</h1>
        <div className={cx(styles.body, styles.loading)}>
          <LoaderImg viewBox="0 0 38 38" />
        </div>
      </div>
    )
  }
  return (
    <div className={styles.page}>
      <h1>{metadata?.title}</h1>
      {metadata?.content && <div className={styles.body} dangerouslySetInnerHTML={{__html: metadata.content}} />}
    </div>
  )
}
