import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { 
  EmergencyCase, 
  RescueTeam, 
  Hospital, 
  Shelter, 
  ResourceItem, 
  DisasterAlert, 
  DisasterType,
  EmergencyStatus,
  ActivityEvent,
  HazardZone,
  BlockedRoad,
  OperationRecord,
  OperationStatus,
  AllocatableResourceItem,
  ResourceShortageAlert,
  ResourceIntelligenceItem,
  NotificationItem
} from '../types';
import { 
  initialEmergencies, 
  initialRescueTeams, 
  initialHospitals, 
  initialShelters, 
  initialResources, 
  initialAlerts,
  initialActivityEvents,
  initialHazardZones,
  initialBlockedRoads
} from '../data/mockData';
import {
  initialAllocatableResources,
  initialOperations,
  initialResourceShortages,
  initialResourceIntelligence,
  getNextOperationStatus
} from '../services/operationsEngine';

import { analyzeEmergencyAI, calculatePriorityScore } from '../services/aiEngine';
import { soundFx } from '../utils/audio';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'success' | 'info';
  timestamp: Date;
}

interface CreateEmergencyParams {
  disasterType: DisasterType;
  peopleAffected: number;
  injuredCount: number;
  medicalEmergency: boolean;
  dangers: string[];
  additionalNotes?: string;
  address?: string;
  lat?: number;
  lng?: number;
  contactName?: string;
  contactPhone?: string;
  isDemoCase?: boolean;
}

interface RescueContextType {
  emergencies: EmergencyCase[];
  rescueTeams: RescueTeam[];
  hospitals: Hospital[];
  shelters: Shelter[];
  hazardZones: HazardZone[];
  blockedRoads: BlockedRoad[];
  resources: ResourceItem[];
  alerts: DisasterAlert[];
  toasts: ToastMessage[];
  activityEvents: ActivityEvent[];
  soundEnabled: boolean;
  currentCitizenEmergencyId: string | null;
  // Operations & Resource Optimization
  operations: OperationRecord[];
  allocatableResources: AllocatableResourceItem[];
  resourceShortages: ResourceShortageAlert[];
  resourceIntelligence: ResourceIntelligenceItem[];
  // Dynamic Dashboard KPI metrics
  activeEmergenciesTotal: number;
  criticalCasesTotal: number;
  activeTeamsTotal: number;
  peopleRescuedTotal: number;
  // Summary counters for Rescue Operations
  availableTeamsCount: number;
  enRouteTeamsCount: number;
  activeRescuesCount: number;
  availableVehiclesCount: number;
  toggleSound: () => void;
  setCurrentCitizenEmergencyId: (id: string | null) => void;
  createEmergency: (params: CreateEmergencyParams) => EmergencyCase;
  triggerFloodDemo: () => EmergencyCase;
  assignTeamToEmergency: (emergencyId: string, teamId: string) => void;
  reassignTeamToEmergency: (emergencyId: string, newTeamId: string) => void;
  updateEmergencyStatus: (emergencyId: string, newStatus: EmergencyStatus) => void;
  markRescueCompleted: (emergencyId: string) => void;
  broadcastNewAlert: (alertData: Omit<DisasterAlert, 'id' | 'timestamp' | 'active'>) => DisasterAlert;
  updateResourceQuantity: (resourceId: string, change: number) => void;
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  addActivityEvent: (event: Omit<ActivityEvent, 'id'>) => void;
  // Operations & Resource Actions
  advanceOperationStatus: (operationId: string, targetStatus?: OperationStatus) => void;
  assignRecommendedTeam: (emergencyId: string, teamId: string, reason?: string) => void;
  allocateResourcesToOperation: (operationId: string, resourceIds: string[]) => void;
  optimizeResourceShortage: (alertId: string) => void;
  executeResourceIntelligenceAction: (actionKey: string) => void;
  deployCommandRecommendation: () => void;
  // Notifications & Demo Reset
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markAllNotificationsRead: () => void;
  resetDemo: () => void;
  selectedShelterId: string | null;
  setSelectedShelterId: (id: string | null) => void;
}

const RescueContext = createContext<RescueContextType | undefined>(undefined);

export const RescueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [emergencies, setEmergencies] = useState<EmergencyCase[]>(() => {
    const saved = localStorage.getItem('rescueai_emergencies');
    return saved ? JSON.parse(saved) : initialEmergencies;
  });

  const [rescueTeams, setRescueTeams] = useState<RescueTeam[]>(() => {
    const saved = localStorage.getItem('rescueai_teams');
    return saved ? JSON.parse(saved) : initialRescueTeams;
  });

  const [hospitals] = useState<Hospital[]>(() => {
    const saved = localStorage.getItem('rescueai_hospitals');
    return saved ? JSON.parse(saved) : initialHospitals;
  });

  const [shelters] = useState<Shelter[]>(() => {
    const saved = localStorage.getItem('rescueai_shelters');
    return saved ? JSON.parse(saved) : initialShelters;
  });

  const [hazardZones] = useState<HazardZone[]>(initialHazardZones);
  const [blockedRoads] = useState<BlockedRoad[]>(initialBlockedRoads);

  const [resources, setResources] = useState<ResourceItem[]>(() => {
    const saved = localStorage.getItem('rescueai_resources');
    return saved ? JSON.parse(saved) : initialResources;
  });

  const [alerts, setAlerts] = useState<DisasterAlert[]>(() => {
    const saved = localStorage.getItem('rescueai_alerts');
    return saved ? JSON.parse(saved) : initialAlerts;
  });

  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>(initialActivityEvents);

  // Dynamic KPI Metrics
  const [activeEmergenciesTotal, setActiveEmergenciesTotal] = useState<number>(122);
  const [criticalCasesTotal, setCriticalCasesTotal] = useState<number>(18);
  const [activeTeamsTotal, setActiveTeamsTotal] = useState<number>(14);
  const [peopleRescuedTotal, setPeopleRescuedTotal] = useState<number>(86);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [currentCitizenEmergencyId, setCurrentCitizenEmergencyId] = useState<string | null>('RA-1024');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem('rescueai_emergencies', JSON.stringify(emergencies));
  }, [emergencies]);

  useEffect(() => {
    localStorage.setItem('rescueai_teams', JSON.stringify(rescueTeams));
  }, [rescueTeams]);

  useEffect(() => {
    localStorage.setItem('rescueai_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('rescueai_alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Operations & Resource Optimization State
  const [operations, setOperations] = useState<OperationRecord[]>(() => {
    const saved = localStorage.getItem('rescueai_operations');
    return saved ? JSON.parse(saved) : initialOperations;
  });

  const [allocatableResources, setAllocatableResources] = useState<AllocatableResourceItem[]>(() => {
    const saved = localStorage.getItem('rescueai_alloc_resources');
    return saved ? JSON.parse(saved) : initialAllocatableResources;
  });

  const [resourceShortages, setResourceShortages] = useState<ResourceShortageAlert[]>(initialResourceShortages);
  const [resourceIntelligence, setResourceIntelligence] = useState<ResourceIntelligenceItem[]>(initialResourceIntelligence);

  useEffect(() => {
    localStorage.setItem('rescueai_operations', JSON.stringify(operations));
  }, [operations]);

  useEffect(() => {
    localStorage.setItem('rescueai_alloc_resources', JSON.stringify(allocatableResources));
  }, [allocatableResources]);

  // Summary counters for Rescue Operations Center
  const availableTeamsCount = rescueTeams.filter((t) => t.status === 'Available').length;
  const enRouteTeamsCount = rescueTeams.filter((t) => t.status === 'En Route').length;
  const activeRescuesCount = rescueTeams.filter((t) => t.status === 'Assigned' || t.status === 'On Scene' || t.status === 'En Route').length;
  const availableVehiclesCount = 11;

  // Notifications & Shelters
  const initialNotifications: NotificationItem[] = [
    { id: 'n1', title: 'New Critical Emergency', message: 'RA-1031 reported in Sector 18.', time: '4m ago', type: 'critical', read: false },
    { id: 'n2', title: 'Team Update', message: 'R-07 arrived at RA-1024.', time: '12m ago', type: 'team', read: false },
    { id: 'n3', title: 'Hospital Update', message: 'Emergency Medical Center capacity changed.', time: '25m ago', type: 'hospital', read: false },
    { id: 'n4', title: 'Resource Warning', message: 'Medical kits below recommended level.', time: '38m ago', type: 'resource', read: false },
  ];
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [selectedShelterId, setSelectedShelterId] = useState<string | null>('S-04');

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('Notifications Cleared', 'All notifications marked as read.', 'info');
  };

  const resetDemo = () => {
    setEmergencies(initialEmergencies);
    setRescueTeams(initialRescueTeams);
    setResources(initialResources);
    setAlerts(initialAlerts);
    setOperations(initialOperations);
    setAllocatableResources(initialAllocatableResources);
    setResourceShortages(initialResourceShortages);
    setResourceIntelligence(initialResourceIntelligence);
    setActiveEmergenciesTotal(122);
    setCriticalCasesTotal(18);
    setActiveTeamsTotal(14);
    setPeopleRescuedTotal(86);
    setToasts([]);
    setActivityEvents(initialActivityEvents);
    setNotifications(initialNotifications);
    setSelectedShelterId('S-04');
    localStorage.removeItem('rescueai_emergencies');
    localStorage.removeItem('rescueai_teams');
    localStorage.removeItem('rescueai_resources');
    localStorage.removeItem('rescueai_alerts');
    localStorage.removeItem('rescueai_operations');
    localStorage.removeItem('rescueai_alloc_resources');
    soundFx.playSuccessPing();
    addToast('Demo State Reset', 'Restored complete prototype to baseline demonstration state.', 'success');
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.enabled = next;
    if (next) soundFx.playSuccessPing();
  };

  const addToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, title, message, type, timestamp: new Date() };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addActivityEvent = (event: Omit<ActivityEvent, 'id'>) => {
    const id = `ACT-${Date.now()}`;
    const newEvent: ActivityEvent = { ...event, id, isNew: true };
    setActivityEvents((prev) => [newEvent, ...prev.slice(0, 20)]);
  };

  const createEmergency = (params: CreateEmergencyParams): EmergencyCase => {
    const isDemo =
      params.isDemoCase ||
      (params.disasterType === 'Flood' &&
        params.peopleAffected === 4 &&
        params.injuredCount === 2 &&
        params.medicalEmergency);

    const targetId = isDemo ? 'RA-1024' : `RA-${Math.floor(1000 + Math.random() * 9000)}`;

    const priorityCalc = calculatePriorityScore({
      disasterType: params.disasterType,
      peopleAffected: params.peopleAffected,
      injuredCount: params.injuredCount,
      medicalEmergency: params.medicalEmergency,
      dangers: params.dangers,
      locationText: params.address,
      isDemoCase: isDemo,
    });

    const newCase: EmergencyCase = {
      id: targetId,
      timestamp: 'Just now',
      disasterType: params.disasterType,
      location: {
        lat: params.lat || 23.0338,
        lng: params.lng || 72.5467,
        address: params.address || 'Sector 14 Block C, Ahmedabad',
        sector: 'Sector 14',
        landmark: 'Near GPS Ping',
      },
      peopleAffected: params.peopleAffected,
      injuredCount: params.injuredCount,
      medicalEmergency: params.medicalEmergency,
      dangers: params.dangers,
      additionalNotes: params.additionalNotes || 'Citizen reported emergency via RescueAI portal.',
      contactName: params.contactName || 'Citizen Distress Caller',
      contactPhone: params.contactPhone || '+91 98765 43210',
      aiScore: priorityCalc.score,
      priority: priorityCalc.priority,
      status: 'Reported',
      assignedTeamId: undefined,
      recommendedHospitalId: priorityCalc.recommendedHospitalId,
      recommendedShelterId: 'S-01',
      safeRouteNotes: priorityCalc.safeRoute,
      aiReasoning: priorityCalc.reasoning,
      etaMinutes: priorityCalc.recommendedTeamEta,
    };

    setEmergencies((prev) => [newCase, ...prev.filter((e) => e.id !== targetId)]);
    setCurrentCitizenEmergencyId(targetId);

    // Update KPI counters
    setActiveEmergenciesTotal((prev) => prev + 1);
    if (priorityCalc.priority === 'CRITICAL') {
      setCriticalCasesTotal((prev) => prev + 1);
    }

    addActivityEvent({
      time: 'Just now',
      icon: '🚨',
      message: `Emergency #${targetId} registered in Sector 14 (${priorityCalc.priority} - Score ${priorityCalc.score}/100)`,
      type: 'status',
    });

    return newCase;
  };

  const triggerFloodDemo = (): EmergencyCase => {
    const demoCase: EmergencyCase = {
      id: 'RA-1024',
      timestamp: 'Just now',
      disasterType: 'Flood',
      location: {
        lat: 23.0338,
        lng: 72.5467,
        address: 'Sector 14 Block C, Ahmedabad',
        sector: 'Sector 14',
        landmark: 'Near Community Park Gate 2',
      },
      peopleAffected: 4,
      injuredCount: 2,
      medicalEmergency: true,
      dangers: ['Rising water', 'Trapped', 'Road blocked'],
      additionalNotes: 'Flood waters entered ground floor rapidly. 2 persons injured. Trapped on rooftop with rising current.',
      contactName: 'Rohit Sharma',
      contactPhone: '+91 98765 43210',
      aiScore: 92,
      priority: 'CRITICAL',
      status: 'Assigned',
      assignedTeamId: 'R-07',
      recommendedHospitalId: 'H-01',
      recommendedShelterId: 'S-01',
      safeRouteNotes: 'Sector 14 Ring Arterial via Elevated Bypass 4B (avoid Submerged Underpass 14).',
      aiReasoning: [
        'Multiple people affected (4 trapped civilians)',
        '2 injured persons requiring urgent medical attention',
        'Medical assistance required (ALS Protocol)',
        'Rising flood water approaching critical depth',
        'Limited evacuation access (Submerged Underpass 14)',
      ],
      etaMinutes: 8,
    };

    setEmergencies((prev) => [demoCase, ...prev.filter((e) => e.id !== 'RA-1024')]);
    setCurrentCitizenEmergencyId('RA-1024');

    // Update Team R-07 to En Route
    setRescueTeams((prev) =>
      prev.map((t) =>
        t.id === 'R-07'
          ? {
              ...t,
              status: 'En Route',
              assignedEmergencyId: 'RA-1024',
              etaMinutes: 8,
              distanceKm: 2.4,
            }
          : t
      )
    );

    soundFx.playCriticalAlert();
    addToast(
      '🌊 FLOOD DEMO SCENARIO INITIALIZED',
      'Sector 14: 4 Trapped, 2 Injured. AI Score: 92/100 (CRITICAL). Team R-07 En Route (ETA 8m).',
      'critical'
    );

    addActivityEvent({
      time: 'Just now',
      icon: '🚨',
      message: 'Demo Scenario Activated: Emergency #RA-1024 in Sector 14 (CRITICAL 92/100). Team R-07 dispatched.',
      type: 'assignment',
    });

    return demoCase;
  };

  const assignTeamToEmergency = (emergencyId: string, teamId: string) => {
    setEmergencies((prev) =>
      prev.map((e) => {
        if (e.id === emergencyId) {
          return {
            ...e,
            assignedTeamId: teamId,
            status: 'Assigned',
            etaMinutes: e.etaMinutes || 8,
          };
        }
        return e;
      })
    );

    setRescueTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          return {
            ...t,
            status: 'Assigned',
            assignedEmergencyId: emergencyId,
            etaMinutes: 8,
          };
        }
        return t;
      })
    );

    soundFx.playRadioChirp();
    addToast(
      `Team ${teamId} assigned successfully.`,
      `Team ${teamId} assigned to emergency #${emergencyId}. Status: ASSIGNED.`,
      'success'
    );

    addActivityEvent({
      time: 'Just now',
      icon: '🚑',
      message: `Team ${teamId} assigned to emergency #${emergencyId}`,
      type: 'assignment',
    });
  };

  const reassignTeamToEmergency = (emergencyId: string, newTeamId: string) => {
    // Release previous team
    setRescueTeams((prev) =>
      prev.map((t) => {
        if (t.assignedEmergencyId === emergencyId && t.id !== newTeamId) {
          return { ...t, status: 'Available', assignedEmergencyId: undefined, etaMinutes: undefined };
        }
        if (t.id === newTeamId) {
          return { ...t, status: 'Assigned', assignedEmergencyId: emergencyId, etaMinutes: 8 };
        }
        return t;
      })
    );

    setEmergencies((prev) =>
      prev.map((e) => (e.id === emergencyId ? { ...e, assignedTeamId: newTeamId } : e))
    );

    soundFx.playRadioChirp();
    addToast('Team Reassigned', `Emergency #${emergencyId} reassigned to Team ${newTeamId}.`, 'info');
    addActivityEvent({
      time: 'Just now',
      icon: '🔄',
      message: `Emergency #${emergencyId} reassigned to Team ${newTeamId}`,
      type: 'assignment',
    });
  };

  const updateEmergencyStatus = (emergencyId: string, newStatus: EmergencyStatus) => {
    let assignedTeamId: string | undefined;

    setEmergencies((prev) =>
      prev.map((e) => {
        if (e.id === emergencyId) {
          assignedTeamId = e.assignedTeamId;
          return {
            ...e,
            status: newStatus,
            etaMinutes: newStatus === 'Resolved' || newStatus === 'Closed' ? 0 : e.etaMinutes,
          };
        }
        return e;
      })
    );

    // Synchronize team status
    if (assignedTeamId) {
      if (newStatus === 'En Route') {
        setRescueTeams((prev) =>
          prev.map((t) => (t.id === assignedTeamId ? { ...t, status: 'En Route' } : t))
        );
      } else if (newStatus === 'In Progress') {
        setRescueTeams((prev) =>
          prev.map((t) => (t.id === assignedTeamId ? { ...t, status: 'On Scene' } : t))
        );
      } else if (newStatus === 'Resolved' || newStatus === 'Closed') {
        setRescueTeams((prev) =>
          prev.map((t) =>
            t.id === assignedTeamId
              ? { ...t, status: 'Available', assignedEmergencyId: undefined, etaMinutes: undefined }
              : t
          )
        );
      }
    }

    if (newStatus === 'Resolved' || newStatus === 'Closed') {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      soundFx.playSuccessPing();
      addToast('Incident Resolved', `Emergency #${emergencyId} marked as ${newStatus}.`, 'success');
    } else {
      soundFx.playRadioChirp();
      addToast('Emergency status updated.', `Emergency #${emergencyId} progressed to ${newStatus}.`, 'info');
    }

    addActivityEvent({
      time: 'Just now',
      icon: '⏱️',
      message: `Emergency #${emergencyId} transitioned to ${newStatus}`,
      type: 'status',
    });
  };

  const markRescueCompleted = (emergencyId: string) => {
    const targetCase = emergencies.find((e) => e.id === emergencyId);
    const peopleCount = targetCase?.peopleAffected || 4;
    const teamId = targetCase?.assignedTeamId || 'R-07';

    // 1. Update Emergency Status to Resolved
    setEmergencies((prev) =>
      prev.map((e) =>
        e.id === emergencyId
          ? {
              ...e,
              status: 'Resolved',
              etaMinutes: 0,
            }
          : e
      )
    );

    // 2. Free the assigned team to Available
    setRescueTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? {
              ...t,
              status: 'Available',
              assignedEmergencyId: undefined,
              etaMinutes: undefined,
            }
          : t
      )
    );

    // 3. Update Dashboard KPI Counters
    setActiveEmergenciesTotal((prev) => Math.max(0, prev - 1));
    if (targetCase?.priority === 'CRITICAL') {
      setCriticalCasesTotal((prev) => Math.max(0, prev - 1));
    }
    setPeopleRescuedTotal((prev) => prev + peopleCount);

    // 4. Add Activity Event
    addActivityEvent({
      time: 'Just now',
      icon: '✅',
      message: `Team ${teamId} successfully rescued ${peopleCount} people from Emergency #${emergencyId}.`,
      type: 'resolution',
    });

    // 5. Celebration & Feedback
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
    });
    soundFx.playSuccessPing();
    addToast(
      'Rescue Operation Completed',
      `Team ${teamId} successfully rescued ${peopleCount} people from Emergency #${emergencyId}. Team is now AVAILABLE.`,
      'success'
    );
  };

  const broadcastNewAlert = (alertData: Omit<DisasterAlert, 'id' | 'timestamp' | 'active'>): DisasterAlert => {
    const newAlert: DisasterAlert = {
      ...alertData,
      id: `ALT-${Math.floor(900 + Math.random() * 99)}`,
      timestamp: 'Just now',
      active: true,
    };

    setAlerts((prev) => [newAlert, ...prev]);
    soundFx.playCriticalAlert();
    addToast(
      `🚨 BROADCAST ISSUED: ${newAlert.title}`,
      `Severity: ${newAlert.severity} | Target Zones: ${newAlert.affectedZones.join(', ')}`,
      'critical'
    );
    return newAlert;
  };

  const updateResourceQuantity = (resourceId: string, change: number) => {
    let isLow = false;
    setResources((prev) =>
      prev.map((r) => {
        if (r.id === resourceId) {
          const nextVal = Math.max(0, Math.min(r.total, r.available + change));
          if (nextVal <= 10 || nextVal < r.total * 0.25) {
            isLow = true;
          }
          return { ...r, available: nextVal };
        }
        return r;
      })
    );
    if (isLow) {
      addToast('Low Inventory Alert', 'Medical kit inventory is low.', 'warning');
    } else {
      addToast('Inventory Updated', 'Resource inventory adjusted.', 'info');
    }
  };

  const assignRecommendedTeam = (emergencyId: string, teamId: string, reason?: string) => {
    setEmergencies((prev) =>
      prev.map((e) =>
        e.id === emergencyId
          ? { ...e, assignedTeamId: teamId, status: 'Assigned', etaMinutes: e.etaMinutes || 8 }
          : e
      )
    );

    setRescueTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? { ...t, status: 'Assigned', assignedEmergencyId: emergencyId, etaMinutes: 8 }
          : t
      )
    );

    setOperations((prev) => {
      const exists = prev.find((o) => o.emergencyId === emergencyId);
      if (exists) {
        return prev.map((o) =>
          o.emergencyId === emergencyId
            ? {
                ...o,
                status: 'TEAM ASSIGNED',
                assignedTeamId: teamId,
                updatedAt: 'Just now',
                history: [
                  ...o.history,
                  {
                    status: 'TEAM ASSIGNED',
                    time: 'Just now',
                    note: reason || `Team ${teamId} assigned by RescueAI Optimization Engine.`
                  }
                ]
              }
            : o
        );
      } else {
        const newOp: OperationRecord = {
          id: `OP-${emergencyId.replace('RA-', '')}`,
          emergencyId,
          status: 'TEAM ASSIGNED',
          priority: 'CRITICAL',
          victimsCount: 4,
          injuredCount: 2,
          assignedTeamId: teamId,
          allocatedResources: [
            { name: 'Rescue Boat', serial: 'Rescue Boat R-B04', assigned: true },
            { name: 'Medical Kit', serial: 'Medical Kit M-23', assigned: true },
            { name: 'Life Jackets', serial: 'Life Jackets L-18', assigned: true },
            { name: 'Emergency Radio', serial: 'Emergency Radio RAD-09', assigned: true }
          ],
          hospitalId: 'H-01',
          hospitalName: 'Civil Hospital',
          availableBeds: 18,
          availableIcu: 4,
          routeType: 'Safe Route (Elevated Bypass 4B)',
          distanceKm: 5.2,
          etaMinutes: 8,
          risk: 'LOW',
          updatedAt: 'Just now',
          history: [
            { status: 'PENDING', time: '10 mins ago', note: 'Emergency reported.' },
            { status: 'TEAM ASSIGNED', time: 'Just now', note: reason || `Team ${teamId} assigned.` }
          ]
        };
        return [newOp, ...prev];
      }
    });

    soundFx.playRadioChirp();
    addToast(
      `Team ${teamId} assigned successfully.`,
      `Team ${teamId} assigned to Emergency #${emergencyId}. Status updated to ASSIGNED.`,
      'success'
    );
    addActivityEvent({
      time: 'Just now',
      icon: '🚑',
      message: `${teamId} assigned to #${emergencyId}`,
      type: 'assignment'
    });
  };

  const advanceOperationStatus = (operationId: string, targetStatus?: OperationStatus) => {
    const targetOp = operations.find((o) => o.id === operationId);
    if (!targetOp) return;

    const nextStatus = targetStatus || getNextOperationStatus(targetOp.status);
    if (!nextStatus) return;

    setOperations((prev) =>
      prev.map((o) => {
        if (o.id === operationId) {
          return {
            ...o,
            status: nextStatus,
            updatedAt: 'Just now',
            history: [
              ...o.history,
              {
                status: nextStatus,
                time: 'Just now',
                note: `Operation progressed to ${nextStatus}`
              }
            ]
          };
        }
        return o;
      })
    );

    // Propagate state based on nextStatus
    if (nextStatus === 'TEAM ASSIGNED') {
      assignTeamToEmergency(targetOp.emergencyId, targetOp.assignedTeamId);
    } else if (nextStatus === 'RESOURCES ALLOCATED') {
      setAllocatableResources((prev) =>
        prev.map((r) =>
          ['AL-01', 'AL-02', 'AL-03', 'AL-04'].includes(r.id)
            ? { ...r, status: 'ASSIGNED', assignedToTeamId: targetOp.assignedTeamId, assignedToEmergencyId: targetOp.emergencyId }
            : r
        )
      );
      addToast(
        'Resources Allocated',
        `Equipment locked and mobilized for Team ${targetOp.assignedTeamId}.`,
        'success'
      );
      addActivityEvent({
        time: 'Just now',
        icon: '📦',
        message: `Resources allocated to ${targetOp.assignedTeamId} for #${targetOp.emergencyId}`,
        type: 'assignment'
      });
    } else if (nextStatus === 'EN ROUTE') {
      updateEmergencyStatus(targetOp.emergencyId, 'En Route');
      setRescueTeams((prev) =>
        prev.map((t) => (t.id === targetOp.assignedTeamId ? { ...t, status: 'En Route', etaMinutes: 6 } : t))
      );
      addToast(
        'Team En Route',
        `Team ${targetOp.assignedTeamId} underway to #${targetOp.emergencyId} via Elevated Bypass 4B (ETA 6m).`,
        'info'
      );
    } else if (nextStatus === 'ARRIVED') {
      setRescueTeams((prev) =>
        prev.map((t) => (t.id === targetOp.assignedTeamId ? { ...t, status: 'On Scene', etaMinutes: 0 } : t))
      );
      addToast(
        'Team On Scene',
        `Team ${targetOp.assignedTeamId} arrived at Sector 14 rooftop. Preparing watercraft extraction.`,
        'info'
      );
      addActivityEvent({
        time: 'Just now',
        icon: '📍',
        message: `Team ${targetOp.assignedTeamId} arrived on scene at Emergency #${targetOp.emergencyId}`,
        type: 'status'
      });
    } else if (nextStatus === 'RESCUE IN PROGRESS') {
      updateEmergencyStatus(targetOp.emergencyId, 'In Progress');
      addToast(
        'Rescue In Progress',
        `Extraction of 4 trapped civilians in progress using Zodiac rescue boat.`,
        'warning'
      );
    } else if (nextStatus === 'VICTIMS RESCUED') {
      setPeopleRescuedTotal((prev) => prev + targetOp.victimsCount);
      soundFx.playSuccessPing();
      addToast(
        'Victims Extricated',
        `All ${targetOp.victimsCount} victims successfully rescued from rooftop! Medical stabilization initiated.`,
        'success'
      );
      addActivityEvent({
        time: 'Just now',
        icon: '🛡️',
        message: `${targetOp.victimsCount} victims safely extricated from #${targetOp.emergencyId} by ${targetOp.assignedTeamId}`,
        type: 'rescue'
      });
    } else if (nextStatus === 'HOSPITAL TRANSFER') {
      updateEmergencyStatus(targetOp.emergencyId, 'Evacuating');
      addToast(
        'Casualty Transfer Underway',
        `Transferring 2 injured casualties to ${targetOp.hospitalName} Trauma Unit.`,
        'info'
      );
      addActivityEvent({
        time: 'Just now',
        icon: '🏥',
        message: `Transferring injured from #${targetOp.emergencyId} to ${targetOp.hospitalName}`,
        type: 'hospital'
      });
    } else if (nextStatus === 'OPERATION COMPLETED') {
      markRescueCompleted(targetOp.emergencyId);
    }
  };

  const allocateResourcesToOperation = (operationId: string, resourceIds: string[]) => {
    const targetOp = operations.find((o) => o.id === operationId);
    const teamId = targetOp?.assignedTeamId || 'R-07';

    setAllocatableResources((prev) =>
      prev.map((r) =>
        resourceIds.includes(r.id)
          ? { ...r, status: 'ASSIGNED', assignedToTeamId: teamId, assignedToEmergencyId: targetOp?.emergencyId }
          : r
      )
    );

    setOperations((prev) =>
      prev.map((o) =>
        o.id === operationId
          ? {
              ...o,
              status: 'RESOURCES ALLOCATED',
              allocatedResources: o.allocatedResources.map((res) => ({ ...res, assigned: true })),
              updatedAt: 'Just now',
              history: [
                ...o.history,
                {
                  status: 'RESOURCES ALLOCATED',
                  time: 'Just now',
                  note: `Resources allocated: Rescue Boat R-B04, Medical Kit M-23, Life Jackets L-18, Radio RAD-09.`
                }
              ]
            }
          : o
      )
    );

    soundFx.playRadioChirp();
    addToast('Resources Allocated', 'Resources allocated successfully.', 'success');
    addActivityEvent({
      time: 'Just now',
      icon: '📦',
      message: `Resources successfully allocated to Team ${teamId} for #${targetOp?.emergencyId || 'RA-1024'}`,
      type: 'assignment'
    });
  };

  const optimizeResourceShortage = (alertId: string) => {
    setResourceShortages((prev) =>
      prev.map((s) => (s.id === alertId ? { ...s, resolved: true } : s))
    );

    updateResourceQuantity('RES-05', 10);

    soundFx.playSuccessPing();
    addToast(
      'Resource Optimized',
      'Move 10 medical kits from Sector 18 to Sector 14 completed.',
      'success'
    );
    addActivityEvent({
      time: 'Just now',
      icon: '⚡',
      message: 'Logistics Optimization: Dispatched 10 Medical Kits from Sector 18 to Sector 14',
      type: 'system'
    });
  };

  const executeResourceIntelligenceAction = (actionKey: string) => {
    setResourceIntelligence((prev) =>
      prev.map((item) => (item.actionKey === actionKey ? { ...item, applied: true } : item))
    );

    soundFx.playSuccessPing();
    addToast('Optimization Directive Applied', `Action executed: ${actionKey}`, 'success');
    addActivityEvent({
      time: 'Just now',
      icon: '🤖',
      message: `Resource Intelligence directive executed (${actionKey})`,
      type: 'system'
    });
  };

  const deployCommandRecommendation = () => {
    setRescueTeams((prev) =>
      prev.map((t) =>
        t.id === 'R-09' || t.id === 'R-11'
          ? { ...t, status: 'En Route', etaMinutes: 6 }
          : t
      )
    );

    soundFx.playCriticalAlert();
    addToast(
      'Command Recommendation Deployed',
      'Deployed 2 additional rescue teams and 1 ambulance to Sector 14.',
      'critical'
    );
    addActivityEvent({
      time: 'Just now',
      icon: '🚨',
      message: 'Command Directive: 2 Additional Rescue Teams (R-09, R-11) and 1 Ambulance deployed to Sector 14',
      type: 'assignment'
    });
  };

  return (
    <RescueContext.Provider
      value={{
        emergencies,
        rescueTeams,
        hospitals,
        shelters,
        hazardZones,
        blockedRoads,
        resources,
        alerts,
        toasts,
        activityEvents,
        soundEnabled,
        currentCitizenEmergencyId,
        // Operations & Resource Optimization
        operations,
        allocatableResources,
        resourceShortages,
        resourceIntelligence,
        // Dynamic Dashboard KPI metrics
        activeEmergenciesTotal,
        criticalCasesTotal,
        activeTeamsTotal,
        peopleRescuedTotal,
        // Summary counters for Rescue Operations Center
        availableTeamsCount,
        enRouteTeamsCount,
        activeRescuesCount,
        availableVehiclesCount,
        toggleSound,
        setCurrentCitizenEmergencyId,
        createEmergency,
        triggerFloodDemo,
        assignTeamToEmergency,
        reassignTeamToEmergency,
        updateEmergencyStatus,
        markRescueCompleted,
        broadcastNewAlert,
        updateResourceQuantity,
        addToast,
        removeToast,
        addActivityEvent,
        // Operations & Resource actions
        advanceOperationStatus,
        assignRecommendedTeam,
        allocateResourcesToOperation,
        optimizeResourceShortage,
        executeResourceIntelligenceAction,
        deployCommandRecommendation,
        // Notifications & Demo Reset
        notifications,
        unreadNotificationCount,
        markAllNotificationsRead,
        resetDemo,
        selectedShelterId,
        setSelectedShelterId,
      }}
    >
      {children}
    </RescueContext.Provider>
  );
};

export const useRescue = (): RescueContextType => {
  const context = useContext(RescueContext);
  if (!context) {
    throw new Error('useRescue must be used within a RescueProvider');
  }
  return context;
};
