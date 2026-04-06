import * as log4js from 'log4js';
import path from 'path'


import { workerData, isMainThread } from 'worker_threads';
// import {  LOGS_DIR  } from '../constants/Constants';






// let log_file_path = null;
// if (isMainThread) {
//   log_file_path = path.join(LOGS_DIR, 'main.log');
// }
// else {
//   if (typeof workerData == 'object' && workerData != null && 'worker-name' in workerData) {
//     log_file_path = path.join(LOGS_DIR, workerData['worker-name'] + '.log');
//   }
//   else {
//     log_file_path = path.join(LOGS_DIR, 'js-worker.log');
//   }
// }

// log4js.configure({
//   appenders: {
//     file: {
//       type: 'file',
//       filename: log_file_path,
//       maxLogSize: '20M',
//       backups: 10
//     },
//     console: { type: 'console' }
//   },
//   categories: { default: { appenders: ['file', 'console'], level: 'info' } }
// });
// export const logger = log4js.getLogger('default');

