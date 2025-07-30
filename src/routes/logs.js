const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

router.get('/actions', (req, res) => {
  try {
    const { start, end, limit = 100 } = req.query;
    
    let startDate = null;
    let endDate = null;
    
    if (start) {
      startDate = new Date(start);
    }
    if (end) {
      endDate = new Date(end);
    }
    
    const logs = logger.getLogs(startDate, endDate, 'actions');
    
    const limitedLogs = logs.slice(-parseInt(limit));
    
    res.json({
      logs: limitedLogs,
      total: logs.length,
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get action logs' });
  }
});

// GET /api/logs/performance - Получение логов производительности
router.get('/performance', (req, res) => {
  try {
    const { start, end, limit = 100 } = req.query;
    
    let startDate = null;
    let endDate = null;
    
    if (start) {
      startDate = new Date(start);
    }
    if (end) {
      endDate = new Date(end);
    }
    
    const logs = logger.getLogs(startDate, endDate, 'performance');
    
    const limitedLogs = logs.slice(-parseInt(limit));
    
    res.json({
      logs: limitedLogs,
      total: logs.length,
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get performance logs' });
  }
});

// GET /api/logs/stats - Получение статистики по логам
router.get('/stats', (req, res) => {
  try {
    const { start, end } = req.query;
    
    let startDate = null;
    let endDate = null;
    
    if (start) {
      startDate = new Date(start);
    }
    if (end) {
      endDate = new Date(end);
    }
    
    const actionLogs = logger.getLogs(startDate, endDate, 'actions');
    const performanceLogs = logger.getLogs(startDate, endDate, 'performance');
    
    const actionStats = {};
    actionLogs.forEach(log => {
      if (!actionStats[log.action]) {
        actionStats[log.action] = 0;
      }
      actionStats[log.action]++;
    });
    
    const performanceStats = {};
    performanceLogs.forEach(log => {
      if (!performanceStats[log.operation]) {
        performanceStats[log.operation] = {
          count: 0,
          totalDuration: 0,
          avgDuration: 0,
          minDuration: Infinity,
          maxDuration: 0
        };
      }
      
      const duration = parseInt(log.duration);
      const stats = performanceStats[log.operation];
      stats.count++;
      stats.totalDuration += duration;
      stats.avgDuration = stats.totalDuration / stats.count;
      stats.minDuration = Math.min(stats.minDuration, duration);
      stats.maxDuration = Math.max(stats.maxDuration, duration);
    });
    
    res.json({
      period: { start: startDate, end: endDate },
      actionStats,
      performanceStats,
      totalActions: actionLogs.length,
      totalPerformanceLogs: performanceLogs.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get log statistics' });
  }
});

module.exports = router; 