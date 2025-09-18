const React = require('./index.js');

function jsx(type, props, key) {
  if (key !== undefined) {
    props = { ...(props ?? {}), key };
  }
  return React.createElement(type, props);
}

function jsxs(type, props, key) {
  return jsx(type, props, key);
}

module.exports = {
  jsx,
  jsxs,
  Fragment: React.Fragment,
};
