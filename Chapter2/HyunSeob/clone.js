function clone(target) {
  if (Array.isArray(target)) {
    return [...target];
  }

  if (typeof target === "object") {
    return { ...target };
  }

  return target;
}

module.exports = clone;
