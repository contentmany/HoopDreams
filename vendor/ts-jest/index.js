export function createTransformer() {
  return {
    process(src) {
      return src;
    },
  };
}

export default {
  createTransformer,
};
