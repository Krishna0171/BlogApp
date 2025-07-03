const auditMiddleware = async (params, next) => {
  const now = new Date();

  if (params.action === 'create') {
    params.args.data.createdAt = now;
    params.args.data.updatedAt = now;
  }

  if (params.action === 'update') {
    params.args.data.updatedAt = now;
  }

  return next(params);
};

export default auditMiddleware;