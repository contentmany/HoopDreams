const React = require('react');
const ReactDOMServer = require('react-dom/server');

let lastRender = null;

function render(ui) {
  const element = React.createElement(React.Fragment, null, ui);
  const html = ReactDOMServer.renderToStaticMarkup(element);
  const container = { innerHTML: html };
  lastRender = { html, container };
  return {
    container,
    rerender(newUi) {
      return render(newUi);
    },
    unmount() {
      lastRender = null;
    },
  };
}

function ensureRender() {
  if (!lastRender) {
    throw new Error('No mounted render found. Call render() before using screen queries.');
  }
  return lastRender;
}

function queryText(html, matcher) {
  if (matcher instanceof RegExp) {
    const match = html.match(matcher);
    if (!match) {
      throw new Error(`Unable to find an element with text matching ${matcher}`);
    }
    return match[0];
  }
  const text = String(matcher);
  const index = html.toLowerCase().indexOf(text.toLowerCase());
  if (index === -1) {
    throw new Error(`Unable to find an element with text: ${text}`);
  }
  return text;
}

function wrapResult(text) {
  return {
    textContent: text,
    __tl_present: true,
  };
}

const screen = {
  getByText(matcher) {
    const { html } = ensureRender();
    const text = queryText(html, matcher);
    return wrapResult(text);
  },
};

function getByText(matcher) {
  return screen.getByText(matcher);
}

module.exports = {
  render,
  screen,
  getByText,
};
