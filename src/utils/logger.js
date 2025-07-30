const fs = require('fs');
const path = require('path');

class ActionLogger {
  constructor() {
    this.logDir = path.join(__dirname, '../../logs');
    this.logFile = path.join(this.logDir, 'user-actions.log');
    this.performanceFile = path.join(this.logDir, 'performance.log');
    
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  // Логирование действий пользователя
  logAction(action, details = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      action,
      details,
      userAgent: details.userAgent || 'unknown',
      ip: details.ip || 'unknown'
    };

    const logLine = JSON.stringify(logEntry) + '\n';
    
    fs.appendFileSync(this.logFile, logLine);
  }

  // Логирование производительности операций
  logPerformance(operation, duration, details = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      operation,
      duration: `${duration}ms`,
      details
    };

    const logLine = JSON.stringify(logEntry) + '\n';
    
    fs.appendFileSync(this.performanceFile, logLine);
  }

  // Обертка для измерения времени выполнения функции
  async measurePerformance(operation, fn, details = {}) {
    const startTime = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      this.logPerformance(operation, duration, { ...details, success: true });
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logPerformance(operation, duration, { 
        ...details, 
        success: false, 
        error: error.message 
      });
      throw error;
    }
  }

  // Синхронная версия для измерения времени
  measurePerformanceSync(operation, fn, details = {}) {
    const startTime = Date.now();
    try {
      const result = fn();
      const duration = Date.now() - startTime;
      this.logPerformance(operation, duration, { ...details, success: true });
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logPerformance(operation, duration, { 
        ...details, 
        success: false, 
        error: error.message 
      });
      throw error;
    }
  }

  // Получение логов за определенный период
  getLogs(startDate, endDate, logType = 'actions') {
    const filePath = logType === 'performance' ? this.performanceFile : this.logFile;
    
    if (!fs.existsSync(filePath)) {
      return [];
    }

    const logs = fs.readFileSync(filePath, 'utf8')
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return null;
        }
      })
      .filter(log => log !== null);

    if (startDate && endDate) {
      return logs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= startDate && logDate <= endDate;
      });
    }

    return logs;
  }

  // Очистка старых логов (старше 30 дней)
  cleanupOldLogs() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    [this.logFile, this.performanceFile].forEach(filePath => {
      if (fs.existsSync(filePath)) {
        const logs = this.getLogs();
        const filteredLogs = logs.filter(log => {
          const logDate = new Date(log.timestamp);
          return logDate > thirtyDaysAgo;
        });

        const newContent = filteredLogs.map(log => JSON.stringify(log)).join('\n') + '\n';
        fs.writeFileSync(filePath, newContent);
      }
    });
  }
}

// Создаем единственный экземпляр логгера
const logger = new ActionLogger();

setInterval(() => {
  logger.cleanupOldLogs();
}, 24 * 60 * 60 * 1000);

module.exports = logger; 