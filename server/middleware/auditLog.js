// middleware/auditLog.js
import logger from '../config/logger.js';
import { AuditLog } from '../models/index.js';

export const auditLog = async (req, res, next) => {
  const originalSend = res.send;
  res.send = function (data) {
    res.send = originalSend;
    try {
      AuditLog.create({
        userId: req.user?.id,
        action: req.method + ' ' + req.originalUrl,
        details: JSON.stringify({
          body: req.body,
          params: req.params,
          query: req.query,
          response: data
        }),
        timestamp: new Date()
      });
    } catch (error) {
      logger.error('Error creating audit log:', error);
    }
    return res.send(data);
  };
  next();
};