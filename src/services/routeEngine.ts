import { RouteOption } from '../types';

export interface RouteAnalysisResult {
  emergencyId: string;
  teamId: string;
  teamName: string;
  hospitalId: string;
  hospitalName: string;
  fastestRoute: RouteOption;
  safestRoute: RouteOption;
  recommendedType: 'safest';
  aiAnalysisSummary: string;
  hazardsAvoidedList: string[];
  blockedRoadsAvoidedList: string[];
  safeRouteWaypoints: {
    step: number;
    instruction: string;
    distance: string;
    hazardAlert?: string;
  }[];
}

export function analyzeRescueRoutes(
  emergencyId: string = 'RA-1024',
  teamId: string = 'R-07',
  hospitalId: string = 'H-01'
): RouteAnalysisResult {
  return {
    emergencyId,
    teamId,
    teamName: 'Team R-07 (Amphibious SAR)',
    hospitalId,
    hospitalName: 'Civil Hospital',
    fastestRoute: {
      type: 'fastest',
      name: 'Direct Central Arterial (via Underpass 14)',
      distanceKm: 4.1,
      etaMinutes: 6,
      risk: 'HIGH',
      recommended: false,
      hazardsAvoided: 0,
      blockedRoadsAvoided: 0,
      reason: 'Crosses active flash flood zone and Submerged Underpass 14 with 2.1m water depth.',
      pathDescription: 'Bypass 4B → Underpass 14 (Submerged) → Sector 14 Gate',
    },
    safestRoute: {
      type: 'safest',
      name: 'Elevated Bypass 4B Corridor (Recommended)',
      distanceKm: 5.2,
      etaMinutes: 8,
      risk: 'LOW',
      recommended: true,
      hazardsAvoided: 3,
      blockedRoadsAvoided: 2,
      reason: 'Route minimizes exposure to active flood zones and blocked roads.',
      pathDescription: 'Elevated Bypass 4B → North Perimeter Elevated Ramp → Sector 14 Rooftop Access',
    },
    recommendedType: 'safest',
    aiAnalysisSummary:
      'Fastest route crosses a high-risk flood zone. RescueAI recommends the safer route despite the additional 2 minutes.',
    hazardsAvoidedList: [
      'Submerged Underpass 14 (Water depth 2.1m)',
      'Sector 14 Canal Basin Surge (Swift currents)',
      'Damaged High-Voltage Transformer Cable',
    ],
    blockedRoadsAvoidedList: [
      'Sector 14 Main Underpass Arterial (Blocked)',
      'Riverbank Low Arterial East (Impassable)',
    ],
    safeRouteWaypoints: [
      {
        step: 1,
        instruction: 'Deploy from Staging Base onto Elevated Bypass 4B ramp',
        distance: '0.8 km',
      },
      {
        step: 2,
        instruction: 'Maintain elevated arterial route; bypass Submerged Underpass 14 exit',
        distance: '2.4 km',
        hazardAlert: 'Avoid Underpass Exit 3 (Submerged 2.1m)',
      },
      {
        step: 3,
        instruction: 'Arrive at Sector 14 Block C Rooftop Extraction Point (#RA-1024)',
        distance: '2.0 km',
      },
      {
        step: 4,
        instruction: 'Transfer stabilized casualties onto Trauma Arterial corridor toward Civil Hospital',
        distance: '3.8 km',
      },
    ],
  };
}
