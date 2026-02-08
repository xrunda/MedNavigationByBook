export interface PatientInfo {
  name: string;
  phone: string;
  age: number;
  gender: 'male' | 'female';
}

export interface ChiefComplaint {
  symptom: string;
  duration: string;
  matchedSymptom?: SymptomType;
}

export type SymptomType =
  | 'fever'
  | 'chestPain'
  | 'abdominalPain'
  | 'headache'
  | 'cough'
  | 'dyspnea'
  | 'hemoptysis'
  | 'cyanosis'
  | 'palpitation'
  | 'jaundice'
  | 'hematemesis'
  | 'nausea'
  | 'diarrhea'
  | 'dysuria'
  | 'hematuria'
  | 'oliguria'
  | 'edema'
  | 'consciousness'
  | 'febrileSeizure';

export type ConsultationRound =
  | 'registration'
  | 'presentIllness'
  | 'aggravation'
  | 'accompanying'
  | 'supplementary'
  | 'result';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  type?: 'text' | 'structured' | 'emergency' | 'result';
  structuredData?: StructuredQuestion;
  emergencyData?: EmergencyData;
  resultData?: ConsultationResult;
}

export interface StructuredQuestion {
  round: ConsultationRound;
  questionType: 'single_choice' | 'multiple_choice' | 'location' | 'severity' | 'text';
  question: string;
  description?: string;
  options?: Array<{
    label: string;
    value: string;
    description?: string;
  }>;
  allowMultiple?: boolean;
  required?: boolean;
}

export interface EmergencyData {
  triggerSymptom: string;
  description: string;
  immediateActions: string[];
  severity: 'critical' | 'urgent';
}

export interface PossibleCondition {
  name: string;
  priority: 'high' | 'medium' | 'low';
  evidence: string[];
  icon?: string;
}

export interface DifferentialPoint {
  feature: string;
  supporting: string;
  against: string;
}

export interface DepartmentRecommendation {
  department: string;
  departmentCode: string;
  reason: string;
  urgency: 'emergency' | 'urgent' | 'routine';
  urgencyLabel: string;
  suggestedChecks: string[];
  precautions: string[];
  warningSigns: string[];
  icon?: string;
}

export interface ConsultationResult {
  patientInfo: PatientInfo;
  chiefComplaint: ChiefComplaint;
  summary: {
    mainPoints: string[];
    keyFindings: string[];
  };
  diagnosisThinking: {
    possibleConditions: PossibleCondition[];
    differentialPoints: string[];
  };
  departmentRecommendation: DepartmentRecommendation;
  conversationLog: ChatMessage[];
  createdAt: number;
}

export interface ConsultationState {
  isActive: boolean;
  currentRound: ConsultationRound;
  patientInfo?: PatientInfo;
  chiefComplaint?: ChiefComplaint;
  messages: ChatMessage[];
  collectedData: {
    presentIllness?: Record<string, any>;
    aggravation?: Record<string, any>;
    accompanying?: Record<string, any>;
    supplementary?: Record<string, any>;
  };
  isLoading: boolean;
  error?: string;
}

export interface AIServiceResponse {
  success: boolean;
  message?: ChatMessage;
  result?: ConsultationResult;
  error?: string;
}

export interface SendMessageRequest {
  patientInfo?: PatientInfo;
  chiefComplaint?: string;
  currentRound: ConsultationRound;
  userInput: string;
  previousMessages: ChatMessage[];
  collectedData?: ConsultationState['collectedData'];
}
