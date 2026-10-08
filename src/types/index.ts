export type DisasterType = 
  | 'Flood'
  | 'Earthquake'
  | 'Cyclone'
  | 'Landslide'
  | 'Fire'
  | 'Building Collapse'
  | 'Chemical / Hazmat'
  | 'Other';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export type EmergencyStatus = 
  | 'Reported' 
  | 'Analyzing' 
  | 'Assigned' 
  | 'En Route' 
  | 'In Progress' 
  | 'Evacuating' 
  | 'Resolved'
  | 'Closed';

export type TeamStatus = 'Available' | 'Assigned' | 'En Route' | 'On Scene' | 'Standby';

export type HospitalStatus = 'Accepting' | 'Limited' | 'Full';

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'INFO';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  address: string;
  sector?: string;
  landmark?: string;
}

export interface EmergencyCase {
  id: string; // e.g. RA-1024
  timestamp: string;
  disasterType: DisasterType;
  location: LocationCoordinates;
  peopleAffected: number;
  injuredCount: number;
  medicalEmergency: boolean;
  dangers: string[];
  additionalNotes?: string;
  contactName?: string;
  contactPhone?: string;
  aiScore: number; // 0-100
  priority: PriorityLevel;
  status: EmergencyStatus;
  assignedTeamId?: string;
  recommendedHospitalId?: string;
  recommendedShelterId?: string;
  safeRouteNotes?: string;
  aiReasoning: string[];
  etaMinutes?: number;
  imageUrl?: string;
}

export interface RescueTeam {
  id: string; // e.g. R-07
  name: string;
  callSign: string;
  status: TeamStatus;
  currentLocation: LocationCoordinates;
  vehicle: string;
  equipment: string[];
  membersCount: number;
  leaderName: string;
  specialization: string;
  assignedEmergencyId?: string;
  etaMinutes?: number;
  distanceKm?: number;
  batteryOrFuelPercent: number;
}

export interface Hospital {
  id: string;
  name: string;
  location: LocationCoordinates;
  distanceKm: number;
  totalBeds: number;
  availableBeds: number;
  totalIcu: number;
  availableIcu: number;
  ambulances: number;
  status: HospitalStatus;
  traumaCenterLevel: number;
  contactPhone: string;
}

export interface Shelter {
  id: string;
  name: string;
  location: LocationCoordinates;
  capacity: number;
  occupied: number;
  availableCapacity: number;
  foodSuppliesDays: number;
  waterSuppliesLiters: number;
  medicalStation: boolean;
  status: 'Open' | 'Near Capacity' | 'Full' | 'Standby';
}

export interface ResourceItem {
  id: string;
  name: string;
  category: 'Fleet' | 'Medical' | 'Food & Water' | 'Shelter' | 'Heavy Gear';
  available: number;
  total: number;
  unit: string;
  locationBase: string;
}

export interface DisasterAlert {
  id: string;
  title: string;
  disasterType: DisasterType;
  severity: AlertSeverity;
  affectedZones: string[];
  timestamp: string;
  message: string;
  instructions: string[];
  issuedBy: string;
  channels: ('SMS' | 'SIREN' | 'RADIO' | 'APP_PUSH')[];
  active: boolean;
}

export interface AIAnalysisResult {
  score: number;
  priority: PriorityLevel;
  factors: {
    name: string;
    weight: number;
    description: string;
  }[];
  reasoning: string[];
  recommendedAction: string;
  recommendedTeamId: string;
  recommendedHospitalId: string;
  safeRoute: string;
}

export interface ActivityEvent {
  id: string;
  time: string;
  icon: string;
  message: string;
  type: 'assignment' | 'alert' | 'hospital' | 'rescue' | 'system' | 'status' | 'resolution';
  isNew?: boolean;
}

export interface HazardZone {
  id: string;
  name: string;
  type: 'flood' | 'collapse' | 'fire' | 'landslide' | 'electrical';
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  sector: string;
  waterDepth?: string;
  vehicleAccess: 'BLOCKED' | 'RESTRICTED' | 'HIGH CLEARANCE ONLY';
  pedestrianAccess: 'DANGEROUS' | 'IMPASSABLE' | 'CAUTION';
  description: string;
  coordinates: { lat: number; lng: number };
  svgPolygon?: string;
}

export interface BlockedRoad {
  id: string;
  name: string;
  sector: string;
  reason: string;
  since: string;
  estimatedClearance: string;
  severity: 'BLOCKED' | 'RESTRICTED';
  coordinates: { lat: number; lng: number };
}

export interface RouteOption {
  type: 'safest' | 'fastest';
  name: string;
  distanceKm: number;
  etaMinutes: number;
  risk: 'LOW' | 'HIGH' | 'MODERATE';
  recommended: boolean;
  hazardsAvoided: number;
  blockedRoadsAvoided: number;
  reason: string;
  pathDescription: string;
}

export type OperationStatus =
  | 'PENDING'
  | 'TEAM ASSIGNED'
  | 'RESOURCES ALLOCATED'
  | 'EN ROUTE'
  | 'ARRIVED'
  | 'RESCUE IN PROGRESS'
  | 'VICTIMS RESCUED'
  | 'HOSPITAL TRANSFER'
  | 'OPERATION COMPLETED';

export interface AllocatableResourceItem {
  id: string;
  name: string;
  category: string;
  serial: string;
  status: 'AVAILABLE' | 'ASSIGNED';
  assignedToTeamId?: string;
  assignedToEmergencyId?: string;
  depotLocation: string;
}

export interface OperationRecord {
  id: string; // e.g. OP-1024
  emergencyId: string; // e.g. RA-1024
  status: OperationStatus;
  priority: PriorityLevel;
  victimsCount: number;
  injuredCount: number;
  assignedTeamId: string;
  allocatedResources: {
    name: string;
    serial: string;
    assigned: boolean;
  }[];
  hospitalId: string;
  hospitalName: string;
  availableBeds: number;
  availableIcu: number;
  routeType: string;
  distanceKm: number;
  etaMinutes: number;
  risk: 'LOW' | 'HIGH' | 'MODERATE';
  updatedAt: string;
  history: {
    status: OperationStatus;
    time: string;
    note: string;
  }[];
}

export interface TeamRecommendation {
  teamId: string;
  name: string;
  matchScore: number;
  distanceKm: number;
  etaMinutes: number;
  membersCount: number;
  vehicle: string;
  equipment: string[];
  routeRisk: 'LOW' | 'MODERATE' | 'HIGH';
  isBestMatch: boolean;
  reasoning: string[];
}

export interface HospitalRecommendation {
  hospitalId: string;
  name: string;
  matchScore: number;
  distanceKm: number;
  availableBeds: number;
  availableIcu: number;
  ambulances: number;
  status: HospitalStatus;
  isRecommended: boolean;
  reasoning: string[];
}

export interface ResourceShortageAlert {
  id: string;
  item: string;
  current: number;
  projected: number;
  shortage: number;
  recommendation: string;
  fromSector: string;
  toSector: string;
  transferAmount: number;
  resolved?: boolean;
}

export interface ResourceIntelligenceItem {
  id: string;
  title: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  reason: string;
  recommendedAction: string;
  actionKey: string;
  applied?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'critical' | 'team' | 'hospital' | 'resource';
  read: boolean;
}

export interface AIInsightCard {
  id: string;
  category: string;
  title: string;
  description: string;
  recommendation: string;
  confidence: number;
  priority: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  reason: string;
  actionText: string;
  actionKey: string;
  sector?: string;
  applied?: boolean;
}



