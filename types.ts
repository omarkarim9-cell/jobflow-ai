// 1. JobStatus enum (REQUIRED)
export enum JobStatus {
  DETECTED = 'detected',
  APPLIED = 'applied',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  REJECTED = 'rejected'
}

// 2. ViewState enum  
export enum ViewState {
  DASHBOARD = 'dashboard',
  SETTINGS = 'settings',
  INBOX = 'inbox',
  DEBUG = 'debug'  // For your Dev Console button
}

// 3. UserProfile interface
export interface UserProfile {
  id: string;
  fullName: string;              // Matches api/profile.ts row.full_name
  email: string;
  phone: string;
  resumeContent: string;
  resumeFileName: string;
  preferences: any;              // Matches row.preferences JSON
  connectedAccounts: any[];
  plan: string;
  dailyAiCredits: number;
  totalAiUsed: number;
}

// 4. EmailAccount interface  
export interface EmailAccount {
  email: string;
  name: string;
  provider: string;
  accessToken: string;
}

// 5. UserPreferences interface
export interface UserPreferences {
  targetRoles: string[];
  targetLocations: string[];
  minSalary: string;
  remoteOnly: boolean;
  language: string;
}

// 6. Job interface (with url - from earlier errors)
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;  // REQUIRED
  salaryRange?: string;
  description: string;
  source: string;
  detectedAt: string;
  status: JobStatus;
  matchScore: number;
  requirements: string[];
  applicationUrl?: string;
  customizedResume?: string;
  coverLetter?: string;
  notes?: string;
  logoUrl?: string;
}

// 7. NotificationType
export type NotificationType = 'success' | 'error' | 'warning' | 'info';
