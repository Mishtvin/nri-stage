export interface SystemSettings {
  id?: string;
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    maxCampaignsPerUser: number;
    maxCharactersPerUser: number;
    defaultUserRole: 'player' | 'master';
    maintenanceMode: boolean;
    allowRegistration: boolean;
    requireEmailVerification: boolean;
  };
  appearance: {
    primaryColor: string;
    accentColor: string;
    fontPrimary: string;
    fontSecondary: string;
    darkMode: boolean;
    customCss: string;
    logoUrl: string;
    faviconUrl: string;
  };
  email: {
    smtpServer: string;
    smtpPort: string;
    smtpUsername: string;
    smtpPassword?: string;
    senderName: string;
    senderEmail: string;
    enableEmailNotifications: boolean;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireStrongPasswords: boolean;
    enableTwoFactor: boolean;
    allowSocialLogin: boolean;
    enableCaptcha: boolean;
  };
}
