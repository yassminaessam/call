// API Response types and endpoint interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp: string;
  };
}

// Call Center API
export interface CallCreateRequest {
  caller: string;
  callerPhone?: string;
  receiver: string;
  receiverDepartment: string;
  type: 'incoming' | 'outgoing';
}

export interface CallUpdateRequest {
  endTime?: string;
  duration?: number;
  status?: 'completed' | 'missed' | 'transferred';
  notes?: string;
  tags?: string[];
  recording?: {
    url: string;
    duration: number;
    format: string;
    size: number;
  };
  followUp?: {
    scheduled: boolean;
    date: string;
    assigned: string;
    notes: string;
  };
}

export interface CallLogsRequest {
  department?: string;
  type?: 'incoming' | 'outgoing' | 'missed';
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface CallLogsResponse {
  calls: Call[];
  total: number;
  page: number;
  limit: number;
}

// AI Answering API
export interface AIAnsweringUpdateRequest {
  department: string;
  enabled?: boolean;
  message?: {
    text: string;
    language: string;
    tone: 'professional' | 'friendly' | 'formal' | 'casual';
  };
  voiceSettings?: {
    provider: 'elevenlabs' | 'google' | 'playht' | 'aws';
    model: string;
    speed: 'slow' | 'normal' | 'fast';
    pitch: 'low' | 'normal' | 'high';
    emotion: 'neutral' | 'happy' | 'calm' | 'excited';
  };
  autoGenerate?: boolean;
  triggers?: ('missed_calls' | 'outside_hours' | 'chatbot_inquiries')[];
}

export interface AIAnsweringTriggerRequest {
  department: string;
  callId: string;
  trigger: 'missed_call' | 'outside_hours' | 'chatbot_inquiry';
  callerInfo: {
    name?: string;
    phone?: string;
    company?: string;
  };
}

export interface AIVoiceGenerationRequest {
  text: string;
  provider: 'elevenlabs' | 'google' | 'playht' | 'aws';
  voice: string;
  settings: {
    speed: 'slow' | 'normal' | 'fast';
    pitch: 'low' | 'normal' | 'high';
    emotion: 'neutral' | 'happy' | 'calm' | 'excited';
  };
}

export interface AIVoiceGenerationResponse {
  voiceUrl: string;
  duration: number;
  format: string;
  size: number;
  generatedAt: string;
}

// Sales CRM API
export interface LeadCreateRequest {
  clientId?: string;
  title: string;
  description: string;
  value: number;
  currency: string;
  stage: 'new' | 'qualified' | 'proposal' | 'negotiation';
  source: string;
  assignedAgent: string;
  expectedCloseDate: string;
  notes?: string;
  tags?: string[];
}

export interface LeadUpdateRequest {
  title?: string;
  description?: string;
  value?: number;
  stage?: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  probability?: number;
  assignedAgent?: string;
  expectedCloseDate?: string;
  notes?: string;
  tags?: string[];
}

export interface DealsRequest {
  stage?: string;
  assignedAgent?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// Client Management API
export interface ClientCreateRequest {
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
  contacts?: {
    name: string;
    role: string;
    email: string;
    phone?: string;
    isPrimary: boolean;
  }[];
  source: string;
  assignedAgent?: string;
  tags?: string[];
  notes?: string;
}

export interface ClientsRequest {
  status?: 'active' | 'inactive' | 'potential' | 'churned';
  assignedAgent?: string;
  tags?: string[];
  search?: string;
  page?: number;
  limit?: number;
}

// HR API
export interface EmployeeCreateRequest {
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
    salary: number;
    manager: string;
  };
}

export interface AttendanceCreateRequest {
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  breakTime?: number;
  status: 'present' | 'absent' | 'late' | 'half_day';
  notes?: string;
}

export interface LeaveRequestCreateRequest {
  employeeId: string;
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity';
  startDate: string;
  endDate: string;
  reason: string;
}

export interface PerformanceReviewRequest {
  employeeId: string;
  reviewPeriod: {
    start: string;
    end: string;
  };
  reviewer: string;
  goals: {
    title: string;
    description: string;
    targetDate: string;
  }[];
  ratings: {
    category: string;
    score: number;
    feedback: string;
  }[];
  overallRating: number;
  feedback: string;
  improvementAreas: string[];
  nextReviewDate: string;
}

// Marketing API
export interface CampaignCreateRequest {
  name: string;
  description: string;
  type: 'email' | 'sms' | 'social' | 'web' | 'mixed';
  audience: {
    segmentId?: string;
    criteria: any;
  };
  content: {
    subject?: string;
    message: string;
    template?: string;
    personalization?: Record<string, string>;
  };
  schedule: {
    startDate: string;
    endDate?: string;
    timezone: string;
    frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  };
  budget?: {
    allocated: number;
    currency: string;
  };
}

export interface CampaignReportRequest {
  campaignId: string;
  dateFrom?: string;
  dateTo?: string;
  metrics?: ('sent' | 'delivered' | 'opened' | 'clicked' | 'converted')[];
}

// Manufacturing API
export interface InventoryCreateRequest {
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
}

export interface WorkOrderCreateRequest {
  title: string;
  description: string;
  type: 'production' | 'maintenance' | 'repair' | 'quality_check';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string[];
  estimatedHours: number;
  materials: {
    inventoryId: string;
    quantity: number;
    unit: string;
  }[];
  startDate: string;
  dueDate: string;
  notes?: string;
}

export interface InventoryStatusRequest {
  category?: string;
  location?: string;
  status?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  page?: number;
  limit?: number;
}

// Support API
export interface TicketCreateRequest {
  clientId: string;
  title: string;
  description: string;
  category: 'technical' | 'billing' | 'general' | 'feature_request' | 'bug_report';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
  attachments?: {
    fileName: string;
    fileSize: number;
    fileType: string;
    url: string;
  }[];
}

export interface TicketUpdateRequest {
  status?: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  assignedAgent?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
}

export interface TicketCommentRequest {
  ticketId: string;
  content: string;
  isInternal?: boolean;
  attachments?: {
    fileName: string;
    fileSize: number;
    fileType: string;
    url: string;
  }[];
}

export interface TicketsRequest {
  status?: string;
  category?: string;
  priority?: string;
  assignedAgent?: string;
  clientId?: string;
  page?: number;
  limit?: number;
}

// Webhook Events
export interface WebhookCallEndedPayload {
  callId: string;
  call: Call;
  duration: number;
  recording?: string;
}

export interface WebhookNewLeadPayload {
  leadId: string;
  lead: Lead;
  source: string;
  assignedAgent: string;
}

export interface WebhookNewClientPayload {
  clientId: string;
  client: Client;
  source: string;
  assignedAgent?: string;
}

export interface WebhookTicketClosedPayload {
  ticketId: string;
  ticket: SupportTicket;
  resolution: {
    summary: string;
    resolvedBy: string;
    satisfaction?: number;
  };
}

export interface WebhookNewHirePayload {
  employeeId: string;
  employee: Employee;
  department: string;
  startDate: string;
}

export interface WebhookCampaignSentPayload {
  campaignId: string;
  campaign: Campaign;
  recipients: number;
  sentAt: string;
}

export interface WebhookStockLowPayload {
  inventoryId: string;
  item: Inventory;
  currentStock: number;
  reorderLevel: number;
}

// Import types from firebase.ts
import type { 
  Call, 
  Lead, 
  Client, 
  SupportTicket, 
  Employee, 
  Campaign, 
  Inventory 
} from './firebase';

// Demo Response (existing)
export interface DemoResponse {
  message: string;
}

// CDR (Call Detail Records)
export interface CDRRecord {
  id: number | string; // Prisma BigInt -> serialized
  calldate?: string;
  src?: string;
  dst?: string;
  disposition?: string; // ANSWERED, NO ANSWER, BUSY, etc.
  duration?: number; // total seconds
  billsec?: number;  // billable seconds
  actionType?: string;
  accountcode?: string;
  uniqueid: string;
  channel?: string;
  dcontext?: string;
  dstchannel?: string;
  lastapp?: string;
  lastdata?: string;
  amaflags?: number;
  userfield?: string;
}

export interface CDRQuery {
  page?: number;
  limit?: number;
  src?: string;
  dst?: string;
  disposition?: string;
  actionType?: string;
  dateFrom?: string; // ISO
  dateTo?: string;   // ISO
}

export interface CDRRecordsResponse {
  success: boolean;
  data: CDRRecord[];
  pagination: { page: number; limit: number; total: number; pages: number };
  stats?: Record<string, number>;
  filters?: Partial<CDRQuery>;
  error?: any;
}
