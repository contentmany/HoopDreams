class Node {
  constructor() {
    this.childNodes = [];
    this.parentNode = null;
  }

  appendChild(node) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
    node.parentNode = this;
    this.childNodes.push(node);
    return node;
  }

  removeChild(node) {
    const idx = this.childNodes.indexOf(node);
    if (idx >= 0) {
      this.childNodes.splice(idx, 1);
      node.parentNode = null;
    }
    return node;
  }

  get firstChild() {
    return this.childNodes[0] ?? null;
  }

  get lastChild() {
    return this.childNodes[this.childNodes.length - 1] ?? null;
  }

  get textContent() {
    return this.childNodes.map((child) => child.textContent ?? '').join('');
  }

  set textContent(value) {
    this.childNodes = [new TextNode(String(value))];
    this.childNodes[0].parentNode = this;
  }
}

class TextNode extends Node {
  constructor(text) {
    super();
    this.nodeType = 3;
    this._text = text;
  }

  get textContent() {
    return this._text;
  }

  set textContent(value) {
    this._text = String(value);
  }
}

class Element extends Node {
  constructor(tagName) {
    super();
    this.nodeType = 1;
    this.tagName = tagName.toUpperCase();
    this.attributes = new Map();
    this.style = {};
    this._innerHTML = '';
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
    if (name === 'id') this.id = String(value);
    if (name === 'class' || name === 'className') this.className = String(value);
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  get innerHTML() {
    if (this.childNodes.length === 1 && this.childNodes[0] instanceof TextNode) {
      return this.childNodes[0].textContent;
    }
    return this.childNodes.map((child) => child.outerHTML ?? child.textContent ?? '').join('');
  }

  set innerHTML(value) {
    this.childNodes = [];
    if (value && value !== '') {
      const text = new TextNode(String(value));
      text.parentNode = this;
      this.childNodes.push(text);
    }
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  querySelectorAll(selector) {
    const results = [];
    const predicate = createPredicate(selector);
    walk(this, (node) => {
      if (node instanceof Element && predicate(node)) {
        results.push(node);
      }
    });
    return results;
  }
}

class Document extends Node {
  constructor() {
    super();
    this.nodeType = 9;
    this.body = new Element('body');
    this.appendChild(this.body);
  }

  createElement(tagName) {
    return new Element(tagName);
  }

  createTextNode(text) {
    return new TextNode(text);
  }

  querySelector(selector) {
    return this.body.querySelector(selector);
  }

  querySelectorAll(selector) {
    return this.body.querySelectorAll(selector);
  }
}

function walk(node, visitor) {
  for (const child of node.childNodes) {
    visitor(child);
    walk(child, visitor);
  }
}

function createPredicate(selector) {
  if (!selector || typeof selector !== 'string') {
    return () => false;
  }
  if (selector.startsWith('#')) {
    const id = selector.slice(1);
    return (el) => el.id === id;
  }
  if (selector.startsWith('.')) {
    const cls = selector.slice(1);
    return (el) => (el.className || '').split(/\s+/).includes(cls);
  }
  const tag = selector.toUpperCase();
  return (el) => el.tagName === tag;
}

function createWindow() {
  const document = new Document();
  const window = {
    document,
    Node,
    Element,
    HTMLElement: Element,
    Text: TextNode,
    navigator: { userAgent: 'vitest-shim' },
    getComputedStyle: () => ({
      getPropertyValue: () => '',
    }),
    requestAnimationFrame: (cb) => {
      const id = setTimeout(() => cb(Date.now()), 16);
      return id;
    },
    cancelAnimationFrame: (id) => clearTimeout(id),
    close: () => {},
  };
  return window;
}

class JSDOM {
  constructor(html = '<!doctype html><html><body></body></html>') {
    this.window = createWindow();
    if (html) {
      this.window.document.body.innerHTML = html;
    }
  }
}

module.exports = { JSDOM, Element, Document, TextNode, Node };
