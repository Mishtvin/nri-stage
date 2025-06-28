/**
 * Утилиты для форматирования данных
 */

export const formatDate = (date: string | Date, locale = 'ru-RU'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale);
};

export const formatDateTime = (date: string | Date, locale = 'ru-RU'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString(locale);
};

export const formatCurrency = (amount: number, currency = 'золото'): string => {
  return `${amount.toLocaleString()} ${currency}`;
};

export const formatExperience = (exp: number): string => {
  if (exp >= 1000000) {
    return `${(exp / 1000000).toFixed(1)}M`;
  }
  if (exp >= 1000) {
    return `${(exp / 1000).toFixed(1)}K`;
  }
  return exp.toString();
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}м`;
  }
  if (mins === 0) {
    return `${hours}ч`;
  }
  return `${hours}ч ${mins}м`;
};

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};