function authorizeOr(...m) {
  return async function(ctx, next) {
    for (let item of m) {
      await item(ctx, next);
      if (ctx.status !== 403) {
        break;
      }
    }
  }
}

export {
  authorizeOr
};
