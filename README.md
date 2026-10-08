# RescueAI (ResQAI) — AI-Powered Disaster Response & Rescue Coordination Platform

RescueAI is a high-fidelity, mission-control disaster management, emergency response, and rescue coordination platform. It bridges citizens in life-threatening distress with authorities, National Disaster Response Forces (NDRF), first-responder rescue fleets, and regional hospitals.

---

## ⚡ Quick Start

```bash
# Clone or navigate to the directory
cd C:\Users\supre\rescueai

# Install dependencies (React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts, Canvas Confetti)
npm install

# Start Vite development server
npm run dev

# Open http://localhost:5173/ in your browser
```

---

## 🌊 End-to-End Demo Scenario: Sector 14 Flood Rescue

To immediately demonstrate the platform's multi-tier coordination pipeline for judges, faculty, or evaluators:

1. **Launch the Demo Scenario**: Click the **"Run Demo: Flood Rescue"** button located in the top navigation bar or on the landing page hero.
2. **Citizen Distress Submission**:
   - **Disaster**: Flood
   - **Victims Trapped**: 4 people (including senior citizens and children)
   - **Casualties**: 2 injured civilians
   - **Medical Emergency**: YES (Immediate ALS resuscitation needed)
   - **Hazards**: Rapidly rising water, blocked roads, structural trapping
   - **Location**: Plot 42, Green Avenue, Sector 14 (Lat: `28.5355° N`, Lng: `77.3910° E`)
3. **AI Severity Engine Analysis**:
   - Computes Multi-Variable Threat Score: **`92 / 100`**
   - Priority Classification: **`CRITICAL` (Red)**
   - Reasoning: Confirmed casualties, hypothermia risk, roads submerged, amphibious craft mandated.
   - Recommended Action: Tier-1 swift-water rescue.
4. **Autonomous Resource Allocation**:
   - **Assigned Team**: `Team R-07` (*Amphibious Rapid SAR* — High-power jet boat & 4x4 carrier)
   - **ETA**: `8 minutes` (Distance: `2.4 km`)
   - **Allocated Medical Reception**: `Civil Hospital & Trauma Emergency` (18 beds, 4 ICU ventilators available)
   - **Safe Transit Corridor**: `Sector 14 Ring Arterial via Elevated Bypass 4B` (avoiding inundated underpasses)
5. **Real-Time Synchronized Command**:
   - Incident automatically populates the **Disaster Command Center** (`/dashboard`) priority queue with blinking radar indicators.
   - Citizen can track progress via the **Live Rescue Tracker** (`/emergency-status`), test radio communications, or view flood safety protocols.
   - Resolving the incident marks the team back to `Available`, updates active emergency counts, and celebrates successful civilian extraction with confetti!

---

## 🔄 Core Product Workflow

```
DISASTER DETECTION
        ↓
EMERGENCY REPORT (1-Tap SOS or Detailed Report)
        ↓
LOCATION + VICTIM INFORMATION (GPS Pin, Casualties, Medical Flag)
        ↓
AI SEVERITY ANALYSIS (0-100 Multi-Variable Neural Score)
        ↓
PRIORITY CLASSIFICATION (CRITICAL / HIGH / MODERATE / LOW)
        ↓
RESCUE TEAM ASSIGNMENT (Nearest Qualified Fleet Unit)
        ↓
SAFE ROUTE RECOMMENDATION (Hazard Avoidance Bypass)
        ↓
HOSPITAL / SHELTER ALLOCATION (Bed Telemetry & Capacity)
        ↓
RESCUE COMPLETION (Confetti & Fleet Return)
        ↓
ANALYTICS & REPORTING (Executive Intelligence Dashboard)
```

---

## 🧠 AI Decision Engine

Priority classification is computed deterministically across 6 core danger variables:

| Factor | Weight Range | Description |
|---|---|---|
| **Disaster Threat Category** | 15 – 28 pts | Flood (24), Earthquake (28), Fire (26), Building Collapse (27) |
| **Civilian Population Density** | Up to 20 pts | Number of individuals stranded inside the hazard perimeter |
| **Casualty / Injury Triage** | Up to 25 pts | Verified lacerations, crush trauma, or drowning risk |
| **Immediate Medical Crisis** | 15 pts | Advanced Life Support (ALS) / Oxygen resuscitation required |
| **Environmental Peril** | Up to 20 pts | Rising flood levels, toxic smoke, aftershocks, severed power |
| **Accessibility & Road Inundation** | Multiplier | Impassable roads requiring specialized amphibious craft |

### Priority Thresholds:
- **`80 – 100`**: **CRITICAL** (Red) — Immediate Tier-1 tactical dispatch
- **`60 – 79`**: **HIGH** (Orange) — Rapid rescue unit deployment
- **`30 – 59`**: **MODERATE** (Yellow) — Community assistance & shelter allocation
- **`0 – 29`**: **LOW** (Green) — Informational advisories & monitoring

---

## 🗺️ Application Routes & Architecture

### Public / Citizen Portal
- `/` — Modern landing page with interactive hero, pipeline steps, dual experience pillars, and demo triggers
- `/report-emergency` — Citizen distress form with GPS auto-detection, steppers, and photo upload
- `/sos` — 1-Tap tactical SOS radar beacon with instant GPS broadcast
- `/ai-analysis` — Animated neural triage scan revealing AI score, reasoning, and assigned fleet
- `/emergency-status` — Citizen rescue tracker with live timeline, team ETA, and radio link

### Responder & Disaster Authority Command Center
- `/dashboard` — Master Disaster Command Center with KPIs, interactive tactical map, and priority queue
- `/emergencies` — Comprehensive incident table with search, priority filters, sorting, and detail dossier
- `/victims` — Humanitarian triage registry highlighting critical cases and medical needs
- `/map` — Full-screen mission control geospatial vector map with radar sweep and hazard polygons
- `/rescue-teams` — Fleet management for boats, choppers, trucks, and drones with assignment modal
- `/hospitals` — Bed telemetry, ICU ventilator availability, and ambulance dispatch controls
- `/shelters` — Relief camp directory with occupancy progress bars and ration/water reserves
- `/resources` — Depot inventory (ambulances, boats, drones, tents, blood kits) with stock adjustments
- `/alerts` — Common Alerting Protocol (CAP 1.2) emergency broadcast system and siren manager
- `/analytics` — Executive charts (Recharts) covering response times, volumes, and survival rates

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 with custom dark tactical command center theme
- **Icons**: Lucide React
- **Data Visualization**: Recharts (Area, Bar, Pie charts)
- **Audio Feedback**: Web Audio API synthesizer for mission-critical acoustic alerts
- **Celebration Feedback**: Canvas Confetti
