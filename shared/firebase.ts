// Firebase configuration and database schema types
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Database Schema Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'agent' | 'employee';
  departments: string[];
  permissions: Permission[];
  createdAt: string;
  lastLogin: string;
  status: 'active' | 'inactive';
}

export interface Permission {
  module: string;
  actions: ('read' | 'write' | 'delete' | 'admin')[];
}

export interface Department {
  id: string;
  name: string;
  type: 'sales' | 'hr' | 'marketing' | 'manufacturing' | 'support';
  assignedUsers: string[];
  aiAnswering: AIAnsweringConfig;
  settings: DepartmentSettings;
  createdAt: string;
  updatedAt: string;
}

export interface AIAnsweringConfig {
  enabled: boolean;
  defaultMessage: {
    text: string;
    voiceUrl?: string;
    language: string;
    tone: 'professional' | 'friendly' | 'formal' | 'casual';
  };
  voiceSettings: {
    provider: 'elevenlabs' | 'google' | 'playht' | 'aws';
    model: string;
    speed: 'slow' | 'normal' | 'fast';
    pitch: 'low' | 'normal' | 'high';
    emotion: 'neutral' | 'happy' | 'calm' | 'excited';
  };
  autoGenerate: boolean;
  triggers: ('missed_calls' | 'outside_hours' | 'chatbot_inquiries')[];
  analytics: {
    messagesPlayed: number;
    callbackRate: number;
    avgListenTime: number;
    lastUpdated: string;
  };
}

export interface DepartmentSettings {
  workingHours: {
    start: string;
    end: string;
    timezone: string;
    workDays: number[];
  };
  notifications: {
    email: boolean;
    sms: boolean;
    webhook: boolean;
  };
}

export interface Call {
  id: string; // Twilio Call SID (CAxxxx format)
  from: string; // Caller phone number
  to: string; // Receiver phone number (CRM number)
  caller: string; // Caller name if known
  callerPhone?: string;
  receiver: string;
  receiverDepartment: string;
  type: 'incoming' | 'outgoing' | 'missed';
  startTime: string;
  endTime?: string;
  duration: number; // in seconds
  status: 'completed' | 'missed' | 'ongoing' | 'transferred' | 'no-answer' | 'busy' | 'failed';
  // Twilio Integration
  twilioSid: string; // Twilio Call SID
  twilioStatus: string; // Twilio call status
  accountSid: string; // Twilio Account SID
  direction: 'inbound' | 'outbound';
  // Recording
  recording?: {
    url: string; // Twilio recording URL
    duration: number;
    format: string; // mp3, wav, etc
    size: number;
    sid: string; // Twilio Recording SID
  };
  // Speech-to-Text Processing
  transcription?: {
    text: string; // Google Speech-to-Text result
    language: string; // 'ar' | 'en' | 'auto'
    confidence: number; // 0-1 confidence score
    processedAt: string;
    segments?: {
      text: string;
      startTime: number;
      endTime: number;
      confidence: number;
    }[];
    status: 'pending' | 'processing' | 'completed' | 'failed';
    errorMessage?: string;
  };
  // AI Response System
  aiAnalysis?: {
    summary: string; // GPT-4 generated summary
    sentiment: 'positive' | 'negative' | 'neutral';
    intent: string; // customer intent
    category: 'sales' | 'support' | 'complaint' | 'inquiry' | 'other';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    suggestedActions: string[];
    keywords: string[];
    processedAt: string;
  };
  aiReply?: {
    text: string; // GPT-4 generated professional response
    tone: 'professional' | 'friendly' | 'apologetic' | 'sales';
    department: string; // Customized for department
    voiceGenerated?: {
      url: string; // Generated voice file URL
      provider: 'elevenlabs' | 'google' | 'aws';
      duration: number;
      generatedAt: string;
    };
    status: 'generated' | 'sent' | 'delivered';
    sentAt?: string;
  };
  notes: string;
  tags: string[];
  followUp?: {
    scheduled: boolean;
    date: string;
    assigned: string;
    notes: string;
    priority: 'low' | 'medium' | 'high';
    aiSuggested: boolean;
  };
  aiHandled: boolean;
  webhookProcessed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contacts: Contact[];
  status: 'active' | 'inactive' | 'potential' | 'churned';
  source: string;
  assignedAgent?: string;
  tags: string[];
  notes: string;
  calls: string[]; // Call IDs
  deals: string[]; // Deal IDs
  tickets: string[]; // Ticket IDs
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  isPrimary: boolean;
}

export interface Lead {
  id: string;
  clientId: string;
  title: string;
  description: string;
  value: number;
  currency: string;
  stage: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  probability: number; // 0-100
  source: string;
  assignedAgent: string;
  expectedCloseDate: string;
  activities: Activity[];
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  description: string;
  date: string;
  userId: string;
  outcome?: string;
}

export interface Employee {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  employment: {
    employeeId: string;
    department: string;
    position: string;
    startDate: string;
    endDate?: string;
    status: 'active' | 'inactive' | 'terminated' | 'on_leave';
    salary: number;
    manager: string;
  };
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  performance: PerformanceReview[];
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  breakTime: number; // in minutes
  totalHours: number;
  status: 'present' | 'absent' | 'late' | 'half_day';
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface PerformanceReview {
  id: string;
  reviewPeriod: {
    start: string;
    end: string;
  };
  reviewer: string;
  goals: Goal[];
  ratings: Rating[];
  overallRating: number; // 1-5
  feedback: string;
  improvementAreas: string[];
  nextReviewDate: string;
  status: 'draft' | 'submitted' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  progress: number; // 0-100
}

export interface Rating {
  category: string;
  score: number; // 1-5
  feedback: string;
}

export interface Inventory {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  supplier?: {
    name: string;
    contact: string;
    email: string;
  };
  pricing: {
    cost: number;
    price: number;
    currency: string;
  };
  reorderLevel: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  bom?: BillOfMaterials[];
  lastUpdated: string;
  createdAt: string;
}

export interface BillOfMaterials {
  componentId: string;
  componentName: string;
  quantity: number;
  unit: string;
  cost: number;
}

export interface WorkOrder {
  id: string;
  orderNumber: string;
  title: string;
  description: string;
  type: 'production' | 'maintenance' | 'repair' | 'quality_check';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  assignedTo: string[];
  estimatedHours: number;
  actualHours?: number;
  materials: MaterialRequirement[];
  startDate: string;
  dueDate: string;
  completedDate?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialRequirement {
  inventoryId: string;
  quantity: number;
  unit: string;
  allocated: boolean;
}

export interface SupportTicket {
  id: string;
  clientId: string;
  title: string;
  description: string;
  category: 'technical' | 'billing' | 'general' | 'feature_request' | 'bug_report';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  assignedAgent?: string;
  tags: string[];
  attachments: Attachment[];
  comments: TicketComment[];
  resolution?: {
    summary: string;
    resolvedBy: string;
    resolvedAt: string;
    satisfaction?: number; // 1-5
    feedback?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TicketComment {
  id: string;
  userId: string;
  userName: string;
  userType: 'agent' | 'customer';
  content: string;
  isInternal: boolean;
  attachments: Attachment[];
  createdAt: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'sms' | 'social' | 'web' | 'mixed';
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'cancelled';
  audience: {
    segmentId?: string;
    totalRecipients: number;
    criteria: AudienceCriteria;
  };
  content: CampaignContent;
  schedule: {
    startDate: string;
    endDate?: string;
    timezone: string;
    frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  };
  analytics: CampaignAnalytics;
  budget?: {
    allocated: number;
    spent: number;
    currency: string;
  };
  abTest?: ABTest;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AudienceCriteria {
  demographics?: {
    ageRange?: [number, number];
    gender?: string[];
    location?: string[];
  };
  behavioral?: {
    lastPurchase?: string;
    engagementLevel?: 'high' | 'medium' | 'low';
    tags?: string[];
  };
  customFilters?: Record<string, any>;
}

export interface CampaignContent {
  subject?: string;
  message: string;
  images?: string[];
  links?: {
    text: string;
    url: string;
    tracking: boolean;
  }[];
  template?: string;
  personalization?: Record<string, string>;
}

export interface CampaignAnalytics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  converted: number;
  revenue: number;
  lastUpdated: string;
}

export interface ABTest {
  enabled: boolean;
  variants: {
    id: string;
    name: string;
    content: CampaignContent;
    allocation: number; // percentage
    performance: CampaignAnalytics;
  }[];
  winner?: string;
  testDuration: number; // days
  significance: number;
}

// Firebase Database Structure
export interface FirebaseDatabase {
  users: Record<string, User>;
  departments: Record<string, Department>;
  calls: Record<string, Call>;
  clients: Record<string, Client>;
  leads: Record<string, Lead>;
  employees: Record<string, Employee>;
  inventory: Record<string, Inventory>;
  workOrders: Record<string, WorkOrder>;
  tickets: Record<string, SupportTicket>;
  campaigns: Record<string, Campaign>;
  aiAnsweringSystem: Record<string, AIAnsweringConfig>;
  systemLogs: Record<string, SystemLog>;
  // New Advanced Call System Tables
  twilioConfig: TwilioConfig;
  googleSpeechConfig: GoogleSpeechConfig;
  openaiConfig: OpenAIConfig;
  departmentAIConfigs: Record<string, DepartmentAIConfig>;
  callTranscriptions: Record<string, SpeechToTextResponse>;
  aiAnalyses: Record<string, any>; // AI analysis results
  voiceGenerations: Record<string, VoiceGenerationResponse>;
  webhookLogs: Record<string, WebhookEvent>;
  processingQueue: Record<string, {
    id: string;
    type: 'transcription' | 'ai_analysis' | 'voice_generation';
    callId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
    processedAt?: string;
    error?: string;
  }>;
}

export interface SystemLog {
  id: string;
  type: 'user_action' | 'system_event' | 'error' | 'webhook' | 'ai_processing' | 'external_api';
  module: string;
  action: string;
  userId?: string;
  details: Record<string, any>;
  timestamp: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

// Twilio Integration Interfaces
export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string; // Main CRM phone number
  webhookUrl: string;
  recordingEnabled: boolean;
  recordingFormat: 'mp3' | 'wav';
}

export interface TwilioCallWebhook {
  CallSid: string;
  AccountSid: string;
  From: string;
  To: string;
  CallStatus: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'busy' | 'failed' | 'no-answer' | 'canceled';
  Direction: 'inbound' | 'outbound-api' | 'outbound-dial';
  Duration?: string;
  RecordingUrl?: string;
  RecordingSid?: string;
  RecordingDuration?: string;
  Timestamp: string;
}

// Google Speech-to-Text Interfaces
export interface GoogleSpeechConfig {
  apiKey: string;
  languageCodes: string[]; // ['ar-SA', 'en-US']
  model: 'latest_long' | 'latest_short' | 'command_and_search';
  enableAutomaticPunctuation: boolean;
  enableSpeakerDiarization: boolean;
  maxSpeakers: number;
}

export interface SpeechToTextRequest {
  audioUrl: string;
  languageCode: string;
  callId: string;
  encoding: 'MP3' | 'WAV' | 'FLAC';
  sampleRateHertz: number;
}

export interface SpeechToTextResponse {
  transcription: string;
  confidence: number;
  languageCode: string;
  segments: {
    text: string;
    startTime: number;
    endTime: number;
    confidence: number;
    speakerTag?: number;
  }[];
  processedAt: string;
}

// OpenAI Integration Interfaces
export interface OpenAIConfig {
  apiKey: string;
  model: 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo';
  maxTokens: number;
  temperature: number;
}

export interface AIAnalysisRequest {
  transcription: string;
  callMetadata: {
    duration: number;
    department: string;
    callerPhone: string;
    direction: 'inbound' | 'outbound';
  };
  departmentContext?: {
    type: 'sales' | 'hr' | 'marketing' | 'manufacturing' | 'support';
    specialInstructions?: string;
  };
}

export interface AIReplyGenerationRequest {
  transcription: string;
  analysis: {
    summary: string;
    sentiment: string;
    intent: string;
    category: string;
  };
  department: string;
  companyInfo: {
    name: string;
    businessHours: string;
    contactInfo: string;
  };
  customInstructions?: string;
}

// Voice Generation (Text-to-Speech) Interfaces
export interface VoiceGenerationConfig {
  provider: 'elevenlabs' | 'google' | 'aws' | 'azure';
  voiceId: string;
  language: string;
  speed: number; // 0.5 - 2.0
  pitch: number; // -20 to 20
  stability?: number; // ElevenLabs specific
  similarityBoost?: number; // ElevenLabs specific
}

export interface VoiceGenerationRequest {
  text: string;
  config: VoiceGenerationConfig;
  callId: string;
  department: string;
}

export interface VoiceGenerationResponse {
  audioUrl: string;
  duration: number;
  format: 'mp3' | 'wav';
  size: number;
  generatedAt: string;
  provider: string;
  cost?: number;
}

// Department-specific AI Configurations
export interface DepartmentAIConfig {
  departmentId: string;
  departmentType: 'sales' | 'hr' | 'marketing' | 'manufacturing' | 'support';
  aiEnabled: boolean;
  autoResponseEnabled: boolean;
  responseDelay: number; // minutes to wait before auto-response
  customPrompts: {
    analysisPrompt: string;
    replyPrompt: string;
    voiceInstructions: string;
  };
  voiceConfig: VoiceGenerationConfig;
  businessRules: {
    escalationKeywords: string[];
    priorityKeywords: string[];
    autoFollowUpTriggers: string[];
  };
  responseTemplates: {
    [key: string]: {
      text: string;
      voiceGenerated: boolean;
      triggers: string[];
    };
  };
}

// Webhook Events
export interface WebhookEvent {
  event: string;
  data: any;
  timestamp: string;
  source: string;
}

export const WEBHOOK_EVENTS = {
  // Twilio Webhooks
  TWILIO_CALL_INITIATED: 'twilio.call.initiated',
  TWILIO_CALL_ANSWERED: 'twilio.call.answered',
  TWILIO_CALL_ENDED: 'twilio.call.ended',
  TWILIO_RECORDING_READY: 'twilio.recording.ready',
  TWILIO_CALL_FAILED: 'twilio.call.failed',
  // Speech Processing
  SPEECH_TO_TEXT_STARTED: 'speech.transcription.started',
  SPEECH_TO_TEXT_COMPLETED: 'speech.transcription.completed',
  SPEECH_TO_TEXT_FAILED: 'speech.transcription.failed',
  // AI Processing
  AI_ANALYSIS_STARTED: 'ai.analysis.started',
  AI_ANALYSIS_COMPLETED: 'ai.analysis.completed',
  AI_REPLY_GENERATED: 'ai.reply.generated',
  AI_VOICE_GENERATED: 'ai.voice.generated',
  // CRM Events
  CALL_ENDED: 'call.ended',
  NEW_LEAD: 'lead.created',
  NEW_CLIENT: 'client.created',
  TICKET_CLOSED: 'ticket.closed',
  NEW_HIRE: 'employee.hired',
  CAMPAIGN_SENT: 'campaign.sent',
  STOCK_LOW: 'inventory.low_stock'
} as const;

// Firebase Security Rules Template
export const FIREBASE_RULES = `
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'"
      }
    },
    "departments": {
      ".read": "auth != null",
      "$deptId": {
        ".write": "root.child('users').child(auth.uid).child('departments').child($deptId).exists() || root.child('users').child(auth.uid).child('role').val() === 'admin'"
      }
    },
    "calls": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "clients": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "leads": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "employees": {
      ".read": "root.child('users').child(auth.uid).child('departments').child('hr').exists() || root.child('users').child(auth.uid).child('role').val() === 'admin'",
      ".write": "root.child('users').child(auth.uid).child('departments').child('hr').exists() || root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "inventory": {
      ".read": "auth != null",
      ".write": "root.child('users').child(auth.uid).child('departments').child('manufacturing').exists() || root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "workOrders": {
      ".read": "auth != null",
      ".write": "root.child('users').child(auth.uid).child('departments').child('manufacturing').exists() || root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "tickets": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "campaigns": {
      ".read": "root.child('users').child(auth.uid).child('departments').child('marketing').exists() || root.child('users').child(auth.uid).child('role').val() === 'admin'",
      ".write": "root.child('users').child(auth.uid).child('departments').child('marketing').exists() || root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "aiAnsweringSystem": {
      ".read": "auth != null",
      ".write": "root.child('users').child(auth.uid).child('role').val() === 'admin' || root.child('users').child(auth.uid).child('role').val() === 'manager'"
    },
    "systemLogs": {
      ".read": "root.child('users').child(auth.uid).child('role').val() === 'admin'",
      ".write": false
    }
  }
}
`;
