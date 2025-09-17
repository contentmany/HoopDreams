const Fragment = Symbol.for('react.fragment');

function createElement(type, props, ...children) {
  const resolvedChildren = props && props.children !== undefined ? props.children : children;
  return {
    type,
    props: {
      ...props,
      children: flatten(resolvedChildren ?? []),
    },
  };
}

function flatten(value) {
  if (Array.isArray(value)) {
    return value.flatMap((child) => flatten(child));
  }
  return [value].filter((child) => child !== null && child !== false && child !== undefined);
}

function useState(initial) {
  return [typeof initial === 'function' ? initial() : initial, () => {}];
}

function useEffect() {}
function useMemo(value) {
  return typeof value === 'function' ? value() : value;
}
function useRef(initialValue = null) {
  return { current: initialValue };
}

module.exports = {
  Fragment,
  createElement,
  useState,
  useEffect,
  useMemo,
  useRef,
  version: '0.0.0-test',
};
