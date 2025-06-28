/**
 * Утилиты для валидации
 */

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidCharacterName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 50 && /^[a-zA-Zа-яА-Я\s'-]+$/.test(name);
};

export const isValidCampaignName = (name: string): boolean => {
  return name.length >= 3 && name.length <= 100;
};

export const isValidLevel = (level: number): boolean => {
  return level >= 1 && level <= 20;
};

export const isValidAbilityScore = (score: number): boolean => {
  return score >= 1 && score <= 30;
};

export const isValidChallengeRating = (cr: string): boolean => {
  const validCRs = [
    '0', '1/8', '1/4', '1/2', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'
  ];
  return validCRs.includes(cr);
};

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} обязательно для заполнения`;
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): string | null => {
  if (value.length < minLength) {
    return `${fieldName} должно содержать минимум ${minLength} символов`;
  }
  return null;
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string | null => {
  if (value.length > maxLength) {
    return `${fieldName} должно содержать максимум ${maxLength} символов`;
  }
  return null;
};

export const validateRange = (value: number, min: number, max: number, fieldName: string): string | null => {
  if (value < min || value > max) {
    return `${fieldName} должно быть между ${min} и ${max}`;
  }
  return null;
};