(function () {
  const g = globalThis;
  if (!g.expect || typeof g.expect.extend !== 'function') {
    throw new Error('@testing-library/jest-dom: global expect with extend() is required.');
  }

  g.expect.extend({
    toBeInTheDocument(received) {
      const pass = !!(received && (received.__tl_present || received.nodeType === 1));
      return {
        pass,
        message: () =>
          pass
            ? 'Expected element not to be in the document'
            : 'Expected element to be present in the document',
      };
    },
  });
})();
