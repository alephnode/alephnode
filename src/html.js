import React from 'react'
import PropTypes from 'prop-types'

export default class HTML extends React.Component {
  render() {
    return (
      <html {...this.props.htmlAttributes}>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          {this.props.headComponents}
        </head>
        <body {...this.props.bodyAttributes} className="light">
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (() => {
                /* Dark theme logic mostly pulled from Dan Abramov's blog: https://overreacted.io */
                window.__onThemeChange = function() {};
                const setTheme = newTheme => {
                  window.__theme = newTheme;
                  preferredTheme = newTheme;
                  document.body.className = newTheme;
                  window.__onThemeChange(newTheme);
                }

                let preferredTheme = localStorage.getItem('theme');

                window.__setPreferredTheme = newTheme => {
                  setTheme(newTheme);
                  localStorage.setItem('theme', newTheme);
                }

                let dark = window.matchMedia('(prefers-color-scheme: dark)');
                dark.addListener(e => window.__setPreferredTheme(e.matches ? 'dark' : 'light'));

                setTheme(preferredTheme || (dark.matches ? 'dark' : 'light'));
              })();
            `,
            }}
          />
          {this.props.preBodyComponents}
          <div
            key={`body`}
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: this.props.body }}
          />
          {this.props.postBodyComponents}
        </body>
      </html>
    )
  }
}
