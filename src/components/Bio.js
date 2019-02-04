import React from 'react'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

import { rhythm } from '../utils/typography'

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: rhythm(1),
        }}
      >
        <p>
          a blog about javascript, node, and math musings.
          <br />
          <a href="https://twitter.com/alephnode" target="_blank">
            twitter plug
          </a>
        </p>
      </div>
    )
  }
}

export default Bio
