async function noop() {}

module.exports = {
  click: noop,
  type: async (_element, text) => text,
  keyboard: noop,
  pointer: noop,
};
