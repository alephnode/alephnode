import React from 'react'
import addToMailchimp from 'gatsby-plugin-mailchimp'

import { rhythm } from '../utils/typography'

export default class EmailForm extends React.Component {
  constructor() {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.changeStatus = this.changeStatus.bind(this)
    this.state = {
      email: '',
      status: 'unsubscribed',
    }
  }
  handleChange({ target: { value } }) {
    this.setState({
      email: value,
    })
  }
  handleSubmit(e) {
    e.preventDefault()
    addToMailchimp(this.state.email)
      .then(({ result }) => this.changeStatus(result))
      .catch(() => {
        this.changeStatus('error')
      })
  }
  changeStatus(status) {
    this.setState({ status })
  }
  render() {
    let { status } = this.state

    const unsubscribedTpl = (
      <div>
        <p>Subscribe to get my latest content by email.</p>
        <form onSubmit={this.handleSubmit}>
          <input
            style={{ height: '2.1rem', paddingLeft: '7px' }}
            onChange={this.handleChange}
            type="email"
            value={this.state.email}
            aria-label="email"
          />
          <button id="newsletterBtn" type="submit" value="Submit">
            subscribe
          </button>
        </form>
        <p>No spam. Unsubscribe at any time.</p>
      </div>
    )

    const errorTpl = (
      <p>
        There was an issue adding your email to the newsletter. Please try again
        later.
      </p>
    )

    const successTpl = <p>Success! You're subscribed.</p>

    return (
      <div
        style={{
          marginBottom: rhythm(2.5),
          border: '1px solid hsla(0,0%,0%,0.2)',
          padding: '2rem',
        }}
      >
        <h3>Join the Newsletter</h3>
        {status === 'unsubscribed' && unsubscribedTpl}
        {status === 'error' && errorTpl}
        {status === 'success' && successTpl}
      </div>
    )
  }
}
