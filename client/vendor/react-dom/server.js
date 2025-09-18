const React = require('react');

function renderToStaticMarkup(node) {
  return renderNode(node);
}

function renderNode(node) {
  if (node === null || node === undefined || node === false) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(renderNode).join('');
  if (node && node.type === React.Fragment) {
    return renderNode(node.props.children ?? []);
  }
  if (typeof node.type === 'function') {
    const rendered = node.type({ ...(node.props ?? {}), children: node.props?.children });
    return renderNode(rendered);
  }
  if (typeof node.type === 'string') {
    const props = node.props ?? {};
    const attrPairs = Object.entries(props)
      .filter(([name]) => name !== 'children' && name !== 'dangerouslySetInnerHTML')
      .map(([name, value]) => attributePair(name, value))
      .filter(Boolean)
      .join(' ');
    const inner = props.dangerouslySetInnerHTML?.__html ?? renderNode(props.children ?? []);
    return attrPairs.length > 0
      ? `<${node.type} ${attrPairs}>${inner}</${node.type}>`
      : `<${node.type}>${inner}</${node.type}>`;
  }
  return '';
}

function attributePair(name, value) {
  if (value === false || value === null || value === undefined) {
    return '';
  }
  if (name === 'className') name = 'class';
  if (name === 'htmlFor') name = 'for';
  if (name === 'style' && value && typeof value === 'object') {
    const styleString = Object.entries(value)
      .map(([key, val]) => `${kebabCase(key)}:${val}`)
      .join(';');
    return `style="${escapeAttr(styleString)}"`;
  }
  return `${name}="${escapeAttr(value)}"`;
}

function kebabCase(str) {
  return String(str).replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function escapeAttr(value) {
  return String(value).replace(/"/g, '&quot;');
}

module.exports = {
  renderToStaticMarkup,
};
