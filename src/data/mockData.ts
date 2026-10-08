import { 
  EmergencyCase, 
  RescueTeam, 
  Hospital, 
  Shelter, 
  ResourceItem, 
  DisasterAlert,
  HazardZone,
  BlockedRoad 
} from '../types';

export const initialEmergencies: EmergencyCase[] = [
  {
    id: 'RA-1024',
    timestamp: '2 mins ago',
    disasterType: 'Flood',
    location: {
      lat: 28.5355,
      lng: 77.3910,
      address: 'Plot 42, Green Avenue, Sector 14',
      sector: 'Sector 14',
      landmark: 'Near Community Park Gate 2'
    },
    peopleAffected: 4,
    injuredCount: 2,
    medicalEmergency: true,
    dangers: ['Rising water', 'Trapped', 'Road blocked'],
    additionalNotes: 'Water entered 1st floor. Elderly person with breathing difficulty and child with cut injury.',
    contactName: 'Rohit Sharma',
    contactPhone: '+91 98765 43210',
    aiScore: 92,
    priority: 'CRITICAL',
    status: 'En Route',
    assignedTeamId: 'R-07',
    recommendedHospitalId: 'H-01',
    recommendedShelterId: 'S-01',
    safeRouteNotes: 'Sector 14 Ring Arterial via Elevated Bypass 4B (avoid Submerged Underpass 14).',
    aiReasoning: [
      'Multiple casualties (2 injured, 4 affected civilians)',
      'Immediate threat to life from fast-rising flood waters',
      'Urgent medical paramedic assistance requested',
      'Sector 14 access roads partially submerged; amphibious craft required',
      'High hypothermia and structural entrapment risk'
    ],
    etaMinutes: 8
  },
  {
    id: 'RA-1027',
    timestamp: '8 mins ago',
    disasterType: 'Building Collapse',
    location: {
      lat: 28.5480,
      lng: 77.3750,
      address: 'B-Block Market Complex, Sector 11',
      sector: 'Sector 11',
      landmark: 'Old Commercial Tower'
    },
    peopleAffected: 5,
    injuredCount: 3,
    medicalEmergency: true,
    dangers: ['Building collapse', 'Trapped'],
    additionalNotes: 'Structural masonry collapse. 3 injured civilians pinned under debris. Extrication unit needed.',
    contactName: 'Anil Verma',
    contactPhone: '+91 98112 34567',
    aiScore: 89,
    priority: 'CRITICAL',
    status: 'En Route',
    assignedTeamId: 'R-03',
    recommendedHospitalId: 'H-02',
    recommendedShelterId: 'S-02',
    safeRouteNotes: 'Approach from Western Service Road to avoid debris perimeter.',
    aiReasoning: [
      'Crush trauma injuries reported under structural masonry',
      'High danger of secondary collapse tremors',
      'Surgical triage unit required on scene'
    ],
    etaMinutes: 12
  },
  {
    id: 'RA-1031',
    timestamp: '12 mins ago',
    disasterType: 'Flood',
    location: {
      lat: 28.5700,
      lng: 77.3450,
      address: 'Tower 4, Metro Heights, Sector 18',
      sector: 'Sector 18',
      landmark: 'Near Ring Road Metro Gate'
    },
    peopleAffected: 3,
    injuredCount: 1,
    medicalEmergency: true,
    dangers: ['Rising water', 'Trapped'],
    additionalNotes: 'Severe asthma patient with oxygen concentrator failure due to power cutoff.',
    contactName: 'Deepak Joshi',
    contactPhone: '+91 98450 67890',
    aiScore: 86,
    priority: 'CRITICAL',
    status: 'Assigned',
    assignedTeamId: 'R-05',
    recommendedHospitalId: 'H-03',
    recommendedShelterId: 'S-04',
    safeRouteNotes: 'Ring Road elevated connector clear for high-clearance response vehicle.',
    aiReasoning: [
      'Critical oxygen depletion risk for chronic patient',
      'Power blackout in Sector 18 sector pocket',
      'ALS paramedic with portable O2 concentrator dispatched'
    ],
    etaMinutes: 15
  },
  {
    id: 'RA-1035',
    timestamp: '19 mins ago',
    disasterType: 'Flood',
    location: {
      lat: 28.5290,
      lng: 77.4100,
      address: 'Lane 4, River View Colony, Sector 16',
      sector: 'Sector 16',
      landmark: 'Near River Embankment'
    },
    peopleAffected: 4,
    injuredCount: 1,
    medicalEmergency: true,
    dangers: ['Rising water', 'Trapped'],
    additionalNotes: 'Deep water inundation in residential dwelling. 1 casualty with head laceration.',
    contactName: 'Sunita Devi',
    contactPhone: '+91 97654 32109',
    aiScore: 84,
    priority: 'CRITICAL',
    status: 'En Route',
    assignedTeamId: 'R-02',
    recommendedHospitalId: 'H-01',
    recommendedShelterId: 'S-01',
    safeRouteNotes: 'Take Eastern Embankment bypass with amphibious transport.',
    aiReasoning: [
      'Rapid water elevation inside residential dwelling',
      'Head trauma casualty requiring paramedic suture/dressing',
      'Water current increasing at 1.2 m/s'
    ],
    etaMinutes: 18
  },
  {
    id: 'RA-1021',
    timestamp: '25 mins ago',
    disasterType: 'Building Collapse',
    location: {
      lat: 28.5480,
      lng: 77.3750,
      address: 'B-Block Market Complex, Sector 11',
      sector: 'Sector 11',
      landmark: 'Old Commercial Tower'
    },
    peopleAffected: 6,
    injuredCount: 3,
    medicalEmergency: true,
    dangers: ['Building collapse', 'Trapped'],
    additionalNotes: 'Commercial balcony facade collapsed after heavy rain. Civilians trapped under rubble.',
    contactName: 'Anil Verma',
    contactPhone: '+91 98112 34567',
    aiScore: 88,
    priority: 'CRITICAL',
    status: 'In Progress',
    assignedTeamId: 'R-03',
    recommendedHospitalId: 'H-02',
    recommendedShelterId: 'S-02',
    safeRouteNotes: 'Approach from Western Service Road to avoid debris perimeter.',
    aiReasoning: [
      'Crush trauma injuries reported under structural masonry',
      'High danger of secondary collapse tremors',
      'Surgical triage unit required on scene'
    ],
    etaMinutes: 4
  },
  {
    id: 'RA-1019',
    timestamp: '28 mins ago',
    disasterType: 'Flood',
    location: {
      lat: 28.5290,
      lng: 77.4100,
      address: 'House 88, River View Colony, Sector 16',
      sector: 'Sector 16',
      landmark: 'Backside of Primary School'
    },
    peopleAffected: 5,
    injuredCount: 1,
    medicalEmergency: true,
    dangers: ['Rising water', 'Trapped'],
    additionalNotes: 'Water level reached 4 feet. Ground floor completely inundated.',
    contactName: 'Sunita Devi',
    contactPhone: '+91 97654 32109',
    aiScore: 78,
    priority: 'HIGH',
    status: 'Assigned',
    assignedTeamId: 'R-02',
    recommendedHospitalId: 'H-01',
    recommendedShelterId: 'S-01',
    safeRouteNotes: 'Take Eastern Embankment Road using high-clearance 4x4.',
    aiReasoning: [
      'Rapid water elevation inside residential dwelling',
      'Senior citizen requiring mobility assistance',
      'Access feasible via Zodiac boat'
    ],
    etaMinutes: 12
  },
  {
    id: 'RA-1015',
    timestamp: '42 mins ago',
    disasterType: 'Fire',
    location: {
      lat: 28.5620,
      lng: 77.3500,
      address: 'Warehouse 12, Industrial Area Ph-2',
      sector: 'Phase 2',
      landmark: 'Adjacent to Chemical Storage'
    },
    peopleAffected: 3,
    injuredCount: 1,
    medicalEmergency: true,
    dangers: ['Fire', 'Road blocked'],
    additionalNotes: 'Electrical transformer spark ignited storage yard. Heavy black smoke.',
    contactName: 'Karan Mehra',
    contactPhone: '+91 99887 76655',
    aiScore: 74,
    priority: 'HIGH',
    status: 'In Progress',
    assignedTeamId: 'R-05',
    recommendedHospitalId: 'H-02',
    recommendedShelterId: 'S-04',
    safeRouteNotes: 'Access via Sector 7 Gate 3; stay upwind of smoke plume.',
    aiReasoning: [
      'Chemical smoke inhalation threat',
      'Thermal perimeter expanding rapidly',
      'Fire suppression unit already engaging'
    ],
    etaMinutes: 5
  },
  {
    id: 'RA-1012',
    timestamp: '1 hour ago',
    disasterType: 'Landslide',
    location: {
      lat: 28.5100,
      lng: 77.4250,
      address: 'Ridge Road Hillside Settlement',
      sector: 'Ridge Area',
      landmark: 'Near Water Reservoir Tank'
    },
    peopleAffected: 8,
    injuredCount: 0,
    medicalEmergency: false,
    dangers: ['Road blocked', 'Trapped'],
    additionalNotes: 'Mudslide blocked single exit lane. 2 families unable to evacuate cars.',
    contactName: 'Vikram Joshi',
    contactPhone: '+91 98450 12345',
    aiScore: 54,
    priority: 'MODERATE',
    status: 'Assigned',
    assignedTeamId: 'R-06',
    recommendedHospitalId: 'H-04',
    recommendedShelterId: 'S-03',
    safeRouteNotes: 'Ridge Northern path clear for foot evacuation.',
    aiReasoning: [
      'No immediate physical casualties reported',
      'Vehicular road blocked, foot egress viable with guide team',
      'Unstable hillside requires earth-moving clearance'
    ],
    etaMinutes: 18
  },
  {
    id: 'RA-1008',
    timestamp: '2 hours ago',
    disasterType: 'Flood',
    location: {
      lat: 28.5750,
      lng: 77.3800,
      address: 'Shanti Vihar, Sector 8 Market',
      sector: 'Sector 8',
      landmark: 'Near Metro Pillar 142'
    },
    peopleAffected: 2,
    injuredCount: 0,
    medicalEmergency: false,
    dangers: ['Rising water'],
    additionalNotes: 'Water logging on road 1.5 feet. Need transport assistance to reach shelter.',
    contactName: 'Pooja Agarwal',
    contactPhone: '+91 98223 99887',
    aiScore: 24,
    priority: 'LOW',
    status: 'Resolved',
    assignedTeamId: 'R-01',
    recommendedHospitalId: 'H-01',
    recommendedShelterId: 'S-01',
    safeRouteNotes: 'Main boulevard open for civilian transit.',
    aiReasoning: [
      'Low water depth, no immediate entrapment or injury',
      'Civilian safely transported to Sector 9 Community Center'
    ],
    etaMinutes: 0
  }
];

export const initialRescueTeams: RescueTeam[] = [
  {
    id: 'R-07',
    name: 'Team R-07 (Amphibious Rapid SAR)',
    callSign: 'WATER-HAWK 7',
    status: 'Assigned',
    currentLocation: {
      lat: 28.5410,
      lng: 77.3820,
      address: 'Sector 12',
      sector: 'Sector 12'
    },
    vehicle: 'Rescue Boat',
    equipment: ['Life Jackets', 'Medical Kit', 'Rope', 'Emergency Radio'],
    membersCount: 6,
    leaderName: 'Capt. Rajesh Nayak',
    specialization: 'Flood Rescue & Swift-Water Extraction',
    assignedEmergencyId: 'RA-1024',
    etaMinutes: 8,
    distanceKm: 2.4,
    batteryOrFuelPercent: 94
  },
  {
    id: 'R-01',
    name: 'Team R-01 (Flood Rescue Alpha)',
    callSign: 'NEPTUNE 1',
    status: 'Available',
    currentLocation: {
      lat: 28.5600,
      lng: 77.3700,
      address: 'Central Disaster Relief Station 1',
      sector: 'Sector 9'
    },
    vehicle: 'Zodiac Rescue Boat',
    equipment: ['Life Jackets', 'Water Diving Gear', 'Medical Kit', 'Emergency Radio'],
    membersCount: 5,
    leaderName: 'Lt. Amit Saxena',
    specialization: 'Shallow Water Evacuation',
    batteryOrFuelPercent: 88
  },
  {
    id: 'R-02',
    name: 'Team R-02 (Mobile Paramedic Unit)',
    callSign: 'MEDIC-ONE',
    status: 'Assigned',
    currentLocation: {
      lat: 28.5320,
      lng: 77.4050,
      address: 'Sector 15 Main Crossroad',
      sector: 'Sector 15'
    },
    vehicle: 'ALS 4WD Ambulance',
    equipment: ['Defibrillator', 'Oxygen Cylinders', 'Trauma Surgery Kit', 'Emergency Radio'],
    membersCount: 4,
    leaderName: 'Dr. Priya Sen',
    specialization: 'Critical Emergency Triage & Resuscitation',
    assignedEmergencyId: 'RA-1019',
    etaMinutes: 12,
    distanceKm: 3.1,
    batteryOrFuelPercent: 82
  },
  {
    id: 'R-03',
    name: 'Team R-03 (Heavy Urban SAR)',
    callSign: 'TITAN 3',
    status: 'On Scene',
    currentLocation: {
      lat: 28.5480,
      lng: 77.3750,
      address: 'Sector 11 Market Complex',
      sector: 'Sector 11'
    },
    vehicle: 'Tactical Extrication Truck',
    equipment: ['Hydraulic Jaws of Life', 'Acoustic Listening Devices', 'Pneumatic Shoring Jacks', 'Medical Kit'],
    membersCount: 5,
    leaderName: 'Commander Sandeep Rawat',
    specialization: 'Structural Collapse & Heavy Extrication',
    assignedEmergencyId: 'RA-1021',
    etaMinutes: 2,
    distanceKm: 0.8,
    batteryOrFuelPercent: 76
  },
  {
    id: 'R-04',
    name: 'Team R-04 (Aviation Air Ambulance SAR)',
    callSign: 'EAGLE 4',
    status: 'Available',
    currentLocation: {
      lat: 28.5800,
      lng: 77.3400,
      address: 'Heliport Alpha, Regional Base',
      sector: 'North Base'
    },
    vehicle: 'Eurocopter EC145 Rescue Helicopter',
    equipment: ['Rescue Hoist Cable', 'Trauma Stretcher Pod', 'Night FLIR Pod', 'Emergency Radio'],
    membersCount: 4,
    leaderName: 'Wing Cdr. Neil Roy',
    specialization: 'Aerial Winch Evacuation & Fast Transit',
    batteryOrFuelPercent: 92
  },
  {
    id: 'R-05',
    name: 'Team R-05 (Hazmat & Fire Tactical)',
    callSign: 'VULCAN 5',
    status: 'On Scene',
    currentLocation: {
      lat: 28.5620,
      lng: 77.3500,
      address: 'Industrial Area Ph-2',
      sector: 'Phase 2'
    },
    vehicle: 'Rescue Vehicle',
    equipment: ['Level-A Hazmat Suits', 'Thermal Imaging Seekers', 'Foam Induction Unit', 'Emergency Radio'],
    membersCount: 4,
    leaderName: 'Station Officer Farooq Khan',
    specialization: 'Industrial Fire & Chemical Spills',
    assignedEmergencyId: 'RA-1015',
    etaMinutes: 3,
    distanceKm: 1.1,
    batteryOrFuelPercent: 68
  },
  {
    id: 'R-06',
    name: 'Team R-06 (Hillside Landslide Unit)',
    callSign: 'ALPINE 6',
    status: 'En Route',
    currentLocation: {
      lat: 28.5150,
      lng: 77.4180,
      address: 'Ridge Access Highway',
      sector: 'Ridge Area'
    },
    vehicle: 'Twin Polaris 6x6 Rovers',
    equipment: ['High-Tension Winches', 'Terrain Clearing Chainsaws', 'Canine Search Unit', 'Medical Kit'],
    membersCount: 5,
    leaderName: 'Inspector Gurpreet Singh',
    specialization: 'Mountain, Slope & Earth Movement SAR',
    assignedEmergencyId: 'RA-1012',
    etaMinutes: 14,
    distanceKm: 4.2,
    batteryOrFuelPercent: 85
  },
  {
    id: 'R-08',
    name: 'Team R-08 (Recon Drone Swarm)',
    callSign: 'SCANNER 8',
    status: 'Available',
    currentLocation: {
      lat: 28.5400,
      lng: 77.3600,
      address: 'Command Drone Dock Station',
      sector: 'Sector 10'
    },
    vehicle: 'Mobile Command Van',
    equipment: ['LIDAR Bathymetry Pods', 'Loudspeaker Megaphones', 'Emergency Supply Drop Kits', 'Emergency Radio'],
    membersCount: 3,
    leaderName: 'Tech Lead Ananya Bose',
    specialization: 'Autonomous Aerial Survey & Lifeline Delivery',
    batteryOrFuelPercent: 96
  },
  {
    id: 'R-09',
    name: 'Team R-09 (Swiftwater Delta)',
    callSign: 'DELTA 9',
    status: 'En Route',
    currentLocation: {
      lat: 28.5350,
      lng: 77.3950,
      address: 'Sector 14 East Ingress',
      sector: 'Sector 14'
    },
    vehicle: 'Rescue Boat',
    equipment: ['Life Jackets', 'Inflatable Sleds', 'Throw Ropes', 'Medical Kit'],
    membersCount: 5,
    leaderName: 'Sub-Inspector Mohan Rao',
    specialization: 'Submerged Zone Extraction',
    etaMinutes: 6,
    distanceKm: 1.8,
    batteryOrFuelPercent: 91
  },
  {
    id: 'R-10',
    name: 'Team R-10 (Civil Defense Squad)',
    callSign: 'DEFENDER 10',
    status: 'Available',
    currentLocation: {
      lat: 28.5680,
      lng: 77.3820,
      address: 'North Regional Depot',
      sector: 'Sector 18'
    },
    vehicle: '4x4 Transport Carrier',
    equipment: ['First Aid Kits', 'Stretchers', 'Megaphones', 'Emergency Radios'],
    membersCount: 6,
    leaderName: 'Capt. Rakesh Sharma',
    specialization: 'Crowd Evacuation & Safe Harbor Transit',
    batteryOrFuelPercent: 89
  },
  {
    id: 'R-11',
    name: 'Team R-11 (Rapid Triage Unit)',
    callSign: 'TRIAGE 11',
    status: 'En Route',
    currentLocation: {
      lat: 28.5440,
      lng: 77.4100,
      address: 'Sector 16 Ring Road',
      sector: 'Sector 16'
    },
    vehicle: 'ALS 4WD Ambulance',
    equipment: ['Portable Ventilators', 'Trauma Packs', 'Defibrillator', 'Life Jackets'],
    membersCount: 4,
    leaderName: 'Dr. Alok Verma',
    specialization: 'On-Site Stabilization',
    etaMinutes: 10,
    distanceKm: 2.9,
    batteryOrFuelPercent: 84
  },
  {
    id: 'R-12',
    name: 'Team R-12 (Canine & Acoustic SAR)',
    callSign: 'TRACKER 12',
    status: 'Available',
    currentLocation: {
      lat: 28.5200,
      lng: 77.3500,
      address: 'West Staging Ground',
      sector: 'Sector 8'
    },
    vehicle: 'All-Terrain Van',
    equipment: ['Acoustic Probes', 'Canine Search Units', 'Fiberoptic Scopes', 'Radio Set'],
    membersCount: 4,
    leaderName: 'Officer Maya Das',
    specialization: 'Debris & Voids Search',
    batteryOrFuelPercent: 95
  },
  {
    id: 'R-13',
    name: 'Team R-13 (Water Rescue Bravo)',
    callSign: 'RIVER-BRAVO',
    status: 'En Route',
    currentLocation: {
      lat: 28.5280,
      lng: 77.4220,
      address: 'River Embankment Dock',
      sector: 'Sector 16'
    },
    vehicle: 'Rescue Boat',
    equipment: ['Life Jackets', 'Ropes', 'Medical Kit', 'Emergency Radio'],
    membersCount: 5,
    leaderName: 'Havildar Sunil Patil',
    specialization: 'River Flood Extraction',
    etaMinutes: 7,
    distanceKm: 2.1,
    batteryOrFuelPercent: 88
  },
  {
    id: 'R-14',
    name: 'Team R-14 (Logistics Mobilization)',
    callSign: 'SUPPLY 14',
    status: 'Available',
    currentLocation: {
      lat: 28.5720,
      lng: 77.3650,
      address: 'Central Depot Reserve',
      sector: 'Sector 20'
    },
    vehicle: 'Heavy Supply Transporter',
    equipment: ['Generators', 'Water Purifiers', 'Medical Crates', 'Field Tents'],
    membersCount: 5,
    leaderName: 'Supervisor Harish Kumar',
    specialization: 'Depot Logistics & Relief Conveyance',
    batteryOrFuelPercent: 98
  }
];

export const initialHospitals: Hospital[] = [
  {
    id: 'H-01',
    name: 'Civil Hospital & Trauma Emergency',
    location: {
      lat: 28.5420,
      lng: 77.3980,
      address: 'Civil Lines Road, Sector 12',
      sector: 'Sector 12'
    },
    distanceKm: 2.4,
    totalBeds: 50,
    availableBeds: 18,
    totalIcu: 10,
    availableIcu: 4,
    ambulances: 3,
    status: 'Accepting',
    traumaCenterLevel: 1,
    contactPhone: '+91 11 2345 6789'
  },
  {
    id: 'H-02',
    name: 'Apex Super Specialty Institute',
    location: {
      lat: 28.5550,
      lng: 77.3620,
      address: 'Institutional Area, Sector 62',
      sector: 'Sector 62'
    },
    distanceKm: 4.1,
    totalBeds: 120,
    availableBeds: 14,
    totalIcu: 24,
    availableIcu: 2,
    ambulances: 6,
    status: 'Limited',
    traumaCenterLevel: 1,
    contactPhone: '+91 11 4567 8901'
  },
  {
    id: 'H-03',
    name: 'Metro Emergency City Hospital',
    location: {
      lat: 28.5700,
      lng: 77.3450,
      address: 'Ring Road Boulevard, Sector 18',
      sector: 'Sector 18'
    },
    distanceKm: 6.2,
    totalBeds: 85,
    availableBeds: 0,
    totalIcu: 16,
    availableIcu: 0,
    ambulances: 4,
    status: 'Full',
    traumaCenterLevel: 2,
    contactPhone: '+91 11 8765 4321'
  },
  {
    id: 'H-04',
    name: 'Red Cross Field Relief Hospital',
    location: {
      lat: 28.5200,
      lng: 77.4080,
      address: 'Disaster Relief Staging Grounds',
      sector: 'Sector 15-B'
    },
    distanceKm: 3.8,
    totalBeds: 40,
    availableBeds: 22,
    totalIcu: 6,
    availableIcu: 5,
    ambulances: 2,
    status: 'Accepting',
    traumaCenterLevel: 2,
    contactPhone: '+91 11 9988 1122'
  },
  {
    id: 'H-05',
    name: 'St. Jude Memorial Health Center',
    location: {
      lat: 28.5850,
      lng: 77.3900,
      address: 'Grand Trunk Link, Sector 4',
      sector: 'Sector 4'
    },
    distanceKm: 7.5,
    totalBeds: 95,
    availableBeds: 31,
    totalIcu: 18,
    availableIcu: 9,
    ambulances: 5,
    status: 'Accepting',
    traumaCenterLevel: 1,
    contactPhone: '+91 11 3344 5566'
  }
];

export const initialShelters: Shelter[] = [
  {
    id: 'S-01',
    name: 'Sector 9 Community Disaster Shelter',
    location: {
      lat: 28.5490,
      lng: 28.5490,
      address: 'Community Center Ground, Sector 9',
      sector: 'Sector 9'
    },
    capacity: 350,
    occupied: 240,
    availableCapacity: 110,
    foodSuppliesDays: 5,
    waterSuppliesLiters: 12000,
    medicalStation: true,
    status: 'Open'
  },
  {
    id: 'S-02',
    name: 'Indira Stadium Mega Relief Camp',
    location: {
      lat: 28.5630,
      lng: 77.3680,
      address: 'Stadium Complex North Wing, Sector 21',
      sector: 'Sector 21'
    },
    capacity: 1200,
    occupied: 890,
    availableCapacity: 310,
    foodSuppliesDays: 7,
    waterSuppliesLiters: 45000,
    medicalStation: true,
    status: 'Open'
  },
  {
    id: 'S-03',
    name: 'Model High School Gymnasium Shelter',
    location: {
      lat: 28.5280,
      lng: 77.4150,
      address: 'Ridge Avenue School Campus',
      sector: 'Ridge East'
    },
    capacity: 250,
    occupied: 242,
    availableCapacity: 8,
    foodSuppliesDays: 2,
    waterSuppliesLiters: 4200,
    medicalStation: false,
    status: 'Near Capacity'
  },
  {
    id: 'S-04',
    name: 'Shelter A-04 (Government Relief Complex)',
    location: {
      lat: 28.5380,
      lng: 77.3750,
      address: 'Sector 13 Multi-Purpose Arena',
      sector: 'Sector 13'
    },
    capacity: 500,
    occupied: 312,
    availableCapacity: 188,
    foodSuppliesDays: 6,
    waterSuppliesLiters: 28000,
    medicalStation: true,
    status: 'Open'
  },
  {
    id: 'S-05',
    name: 'East River Community Hall',
    location: {
      lat: 28.5180,
      lng: 77.4200,
      address: 'Riverbank Road Colony',
      sector: 'Old Riverbank'
    },
    capacity: 200,
    occupied: 200,
    availableCapacity: 0,
    foodSuppliesDays: 1,
    waterSuppliesLiters: 2500,
    medicalStation: false,
    status: 'Full'
  }
];

export const initialResources: ResourceItem[] = [
  { id: 'RES-01', name: 'Emergency Ambulances (ALS/BLS)', category: 'Fleet', available: 12, total: 20, unit: 'Vehicles', locationBase: 'HQ Station & Sector Pods' },
  { id: 'RES-02', name: 'High-Speed Rescue Boats (Zodiac/Jet)', category: 'Fleet', available: 8, total: 10, unit: 'Vessels', locationBase: 'Sector 14 & River Staging' },
  { id: 'RES-03', name: 'Autonomous Rescue Drones', category: 'Fleet', available: 4, total: 6, unit: 'UAV Units', locationBase: 'Drone Command Depot' },
  { id: 'RES-04', name: 'High-Water Amphibious Trucks', category: 'Fleet', available: 9, total: 12, unit: 'Vehicles', locationBase: 'NDRF Heavy Depot' },
  { id: 'RES-05', name: 'Trauma & Paramedic Medical Kits', category: 'Medical', available: 86, total: 120, unit: 'Kits', locationBase: 'Central Medical Store' },
  { id: 'RES-06', name: 'Portable Oxygen Ventilators', category: 'Medical', available: 28, total: 40, unit: 'Units', locationBase: 'Civil Hospital Depot' },
  { id: 'RES-07', name: 'Ration / Emergency Food Packets', category: 'Food & Water', available: 3200, total: 5000, unit: 'MRE Packs', locationBase: 'Relief Logistics Hub' },
  { id: 'RES-08', name: 'Potable Drinking Water Pouches', category: 'Food & Water', available: 850, total: 1000, unit: 'Thousand Liters', locationBase: 'Water Authority Tankers' },
  { id: 'RES-09', name: 'All-Weather Emergency Tents', category: 'Shelter', available: 120, total: 200, unit: 'Tents (6-Person)', locationBase: 'Civil Defense Depot' },
  { id: 'RES-10', name: 'Thermal Blankets & Cots', category: 'Shelter', available: 600, total: 1000, unit: 'Units', locationBase: 'Red Cross Warehouse' },
  { id: 'RES-11', name: 'Hydraulic Extrication Tools (Jaws of Life)', category: 'Heavy Gear', available: 7, total: 10, unit: 'Sets', locationBase: 'Fire Command Station' },
  { id: 'RES-12', name: 'High-Capacity Water Dewatering Pumps', category: 'Heavy Gear', available: 18, total: 24, unit: 'Pumps', locationBase: 'Municipal Depot' }
];

export const initialAlerts: DisasterAlert[] = [
  {
    id: 'ALT-901',
    title: 'Flash Flood Red Warning: Yamuna Inundation Zone',
    disasterType: 'Flood',
    severity: 'CRITICAL',
    affectedZones: ['Sector 14', 'Sector 15', 'Sector 16', 'Riverview Enclave'],
    timestamp: '15 mins ago',
    message: 'Extreme water level spike detected at upstream barrage (+2.4m over danger mark). Ground-level homes in Sectors 14-16 face immediate submergence.',
    instructions: [
      'Move immediately to second floor or designated community shelters.',
      'Cut off main electrical breakers and gas cylinders.',
      'Do not attempt to cross flooded roadways or underpasses.',
      'Keep phones charged and use RescueAI 1-Tap SOS if trapped.'
    ],
    issuedBy: 'State Disaster Management Authority (SDMA)',
    channels: ['SMS', 'SIREN', 'RADIO', 'APP_PUSH'],
    active: true
  },
  {
    id: 'ALT-902',
    title: 'Mandatory Evacuation Order: Low-Lying Sectors',
    disasterType: 'Flood',
    severity: 'HIGH',
    affectedZones: ['Sector 14 West', 'River View Colony', 'Old Embankment'],
    timestamp: '45 mins ago',
    message: 'Authorized evacuation teams deployed. Buses stationed at Sector 14 Gate 1 for transit to Indira Stadium Mega Shelter.',
    instructions: [
      'Pack emergency medicines, photo IDs, and water.',
      'Proceed to designated transit points before 19:30 IST.',
      'Follow signals from RescueAI Team R-07 and NDRF boats.'
    ],
    issuedBy: 'Disaster Relief Incident Commander',
    channels: ['SMS', 'APP_PUSH'],
    active: true
  },
  {
    id: 'ALT-903',
    title: 'Critical Infrastructure Notice: Sector 14 Underpass Inundated',
    disasterType: 'Flood',
    severity: 'MODERATE',
    affectedZones: ['Sector 14 Underpass', 'Link Road 3'],
    timestamp: '1 hour ago',
    message: 'Water depth exceeds 6 feet inside underpass. 2 vehicles stranded. Road completely sealed for all civilian transit.',
    instructions: [
      'Reroute via Elevated Bypass 4B.',
      'Emergency vehicles only with snorkel exhaust permitted.'
    ],
    issuedBy: 'Traffic & Emergency Police Wing',
    channels: ['APP_PUSH', 'RADIO'],
    active: true
  },
  {
    id: 'ALT-904',
    title: 'Severe Weather Warning: 90km/h Squall & Heavy Downpour',
    disasterType: 'Cyclone',
    severity: 'HIGH',
    affectedZones: ['Metropolitan Area All Sectors'],
    timestamp: '2 hours ago',
    message: 'Depression intensified into cyclonic squall. Sustained wind gusts 75-90 km/h with thunderstorm.',
    instructions: [
      'Stay indoors away from glass facades and weak tin roofs.',
      'Do not park vehicles under old trees or billboards.'
    ],
    issuedBy: 'Meteorological Department (IMD)',
    channels: ['SMS', 'RADIO', 'APP_PUSH'],
    active: true
  }
];

export const initialActivityEvents = [
  {
    id: 'ACT-01',
    time: '18:42',
    icon: '🚑',
    message: 'Team R-07 assigned to #RA-1024 (Sector 14 Flood)',
    type: 'assignment' as const,
    isNew: true
  },
  {
    id: 'ACT-02',
    time: '18:40',
    icon: '🚨',
    message: 'New critical emergency reported in Sector 14 (4 affected, 2 injured)',
    type: 'alert' as const,
    isNew: true
  },
  {
    id: 'ACT-03',
    time: '18:37',
    icon: '🏥',
    message: 'Civil Hospital capacity updated: 18 beds, 4 ICU ventilators available',
    type: 'hospital' as const,
    isNew: false
  },
  {
    id: 'ACT-04',
    time: '18:35',
    icon: '🛟',
    message: 'Rescue boat R-04 deployed to West Bypass corridor',
    type: 'assignment' as const,
    isNew: false
  },
  {
    id: 'ACT-05',
    time: '18:31',
    icon: '👤',
    message: '6 victims marked as safely rescued from Sector 11',
    type: 'rescue' as const,
    isNew: false
  },
  {
    id: 'ACT-06',
    time: '18:24',
    icon: '⚠️',
    message: 'Flash flood red warning siren activated for Sectors 14, 15, and 16',
    type: 'alert' as const,
    isNew: false
  },
  {
    id: 'ACT-07',
    time: '18:18',
    icon: '🚁',
    message: 'Air Ambulance Eagle 4 completed aerial survey of Embankment Sector',
    type: 'system' as const,
    isNew: false
  },
  {
    id: 'ACT-08',
    time: '18:10',
    icon: '🏠',
    message: 'Sector 9 Community Shelter opened additional 80 cots for evacuees',
    type: 'hospital' as const,
    isNew: false
  }
];

export const initialHazardZones: HazardZone[] = [
  {
    id: 'HZ-01',
    name: 'Sector 14 High Flood Risk Area',
    type: 'flood',
    severity: 'CRITICAL',
    sector: 'Sector 14',
    waterDepth: '1.8m - 2.4m',
    vehicleAccess: 'BLOCKED',
    pedestrianAccess: 'DANGEROUS',
    description: 'Rapid surge from overflowing canal basin. Swift water currents exceeding 3.5 m/s.',
    coordinates: { lat: 28.5355, lng: 77.3910 }
  },
  {
    id: 'HZ-02',
    name: 'Submerged Underpass 14',
    type: 'flood',
    severity: 'CRITICAL',
    sector: 'Sector 14-B',
    waterDepth: '2.1m (Completely submerged)',
    vehicleAccess: 'BLOCKED',
    pedestrianAccess: 'IMPASSABLE',
    description: 'Underpass basin filled to capacity. Stalled vehicles and high electrocution risk from submerged pump cables.',
    coordinates: { lat: 28.5410, lng: 77.3880 }
  },
  {
    id: 'HZ-03',
    name: 'Sector 11 Commercial Collapse Zone',
    type: 'collapse',
    severity: 'HIGH',
    sector: 'Sector 11',
    vehicleAccess: 'RESTRICTED',
    pedestrianAccess: 'DANGEROUS',
    description: 'Masonry fracture zone with falling glass and structural tremors.',
    coordinates: { lat: 28.5480, lng: 77.3750 }
  },
  {
    id: 'HZ-04',
    name: 'Industrial Transformer Fire Zone',
    type: 'fire',
    severity: 'HIGH',
    sector: 'Sector 16',
    vehicleAccess: 'RESTRICTED',
    pedestrianAccess: 'DANGEROUS',
    description: 'Electrical transformer fire emitting dense toxic chemical smoke plume.',
    coordinates: { lat: 28.5290, lng: 77.4100 }
  },
  {
    id: 'HZ-05',
    name: 'Eastern Embankment Mudslide Hazard',
    type: 'landslide',
    severity: 'MODERATE',
    sector: 'Ridge East',
    vehicleAccess: 'BLOCKED',
    pedestrianAccess: 'CAUTION',
    description: 'Soil saturation causing progressive mud slips along the ridge perimeter.',
    coordinates: { lat: 28.5240, lng: 77.4180 }
  }
];

export const initialBlockedRoads: BlockedRoad[] = [
  {
    id: 'BR-01',
    name: 'Sector 14 Main Underpass Arterial',
    sector: 'Sector 14',
    reason: 'Flooding',
    since: '18:21',
    estimatedClearance: '2 hours',
    severity: 'BLOCKED',
    coordinates: { lat: 28.5410, lng: 77.3880 }
  },
  {
    id: 'BR-02',
    name: 'Riverbank Low Arterial East',
    sector: 'Sector 16',
    reason: 'Water Inundation & Downed Power Grid',
    since: '17:50',
    estimatedClearance: '3.5 hours',
    severity: 'BLOCKED',
    coordinates: { lat: 28.5300, lng: 77.4080 }
  },
  {
    id: 'BR-03',
    name: 'Sector 11 Market Service Lane',
    sector: 'Sector 11',
    reason: 'Structural Debris Blockage',
    since: '18:05',
    estimatedClearance: '1.5 hours',
    severity: 'BLOCKED',
    coordinates: { lat: 28.5475, lng: 77.3760 }
  }
];

