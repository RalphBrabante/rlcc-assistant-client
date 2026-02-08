export const baseUrl = '/api/v1';
const hasWindow = typeof window !== 'undefined';
const isNgServe = hasWindow && window.location.port === '4200';
export const socketUrl = isNgServe
  ? 'http://localhost:3000'
  : hasWindow
    ? window.location.origin
    : 'http://localhost:3000';

// export const baseUrl = 'https://api.bulkqrcodegenerator.online/api/v1';
