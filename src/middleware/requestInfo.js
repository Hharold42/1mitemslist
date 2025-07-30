const getRequestInfo = (req) => {
  const ip = req.headers['x-forwarded-for'] || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress ||
             (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
             req.ip ||
             'unknown';

  const userAgent = req.headers['user-agent'] || 'unknown';

  return {
    ip: ip.replace(/^::ffff:/, ''),
    userAgent,
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  };
};

module.exports = getRequestInfo; 