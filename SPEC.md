# Antenna Designer & Visualizer - SPEC.md

## Concept & Vision

A professional-grade web application for RF engineers and antenna designers to calculate matching network parameters (mloc, mtsep) and visualize critical antenna characteristics. The interface evokes the precision of laboratory equipment with a dark, focused aesthetic that puts data visualization front and center.

## Design Language

### Aesthetic Direction
Dark-mode engineering console aesthetic - inspired by spectrum analyzers and vector network analyzers (VNAs). Professional, data-dense, with glowing accent elements that highlight active measurements.

### Color Palette
- **Primary Background**: `#0d1117` (deep charcoal)
- **Secondary Background**: `#161b22` (panel surfaces)
- **Tertiary Background**: `#21262d` (input fields, cards)
- **Border**: `#30363d` (subtle separators)
- **Text Primary**: `#e6edf3` (high contrast)
- **Text Secondary**: `#8b949e` (labels, hints)
- **Accent Cyan**: `#58a6ff` (primary actions, highlights)
- **Accent Green**: `#3fb950` (positive values, success)
- **Accent Orange**: `#d29922` (warnings, intermediate values)
- **Accent Red**: `#f85149` (errors, negative values)
- **Grid Lines**: `#30363d` (charts, diagrams)

### Typography
- **Headings**: "JetBrains Mono", monospace - technical, precise
- **Body/Labels**: "IBM Plex Sans", sans-serif - readable, professional
- **Data Values**: "JetBrains Mono" - numerical precision

### Spatial System
- 8px base grid
- Card padding: 24px
- Section gaps: 32px
- Input heights: 40px
- Border radius: 8px for cards, 4px for inputs

### Motion Philosophy
- Subtle transitions on hover (150ms ease)
- Chart animations on data update (300ms)
- No excessive flourishes - precision over decoration
- Loading states use pulsing glow effect

### Visual Assets
- Lucide icons for UI elements
- Custom SVG for radiation pattern visualization
- Canvas-based rendering for Smith chart
- Plotly.js or Chart.js for S11 plots

## Layout & Structure

### Main Layout (3-column responsive)
```
┌─────────────────────────────────────────────────────────────┐
│  Header: Logo + Title + Status Indicator                     │
├───────────────┬─────────────────────────┬───────────────────┤
│  Left Panel  │    Main Visualization    │   Right Panel     │
│  (Controls)   │    (Diagrams Area)       │   (Results)       │
│               │                          │                   │
│  - Antenna    │  ┌─────────────────┐    │  - Calculated    │
│    Type       │  │ Radiation       │    │    Parameters     │
│  - Frequency  │  │ Pattern         │    │                   │
│  - Parameters │  └─────────────────┘    │  - mloc value    │
│  - Matching   │  ┌─────────────────┐    │  - mtsep value   │
│    Config     │  │ Smith Chart     │    │                   │
│               │  └─────────────────┘    │  - VSWR          │
│               │  ┌─────────────────┐    │  - Return Loss   │
│               │  │ S11 Real/Imag   │    │                   │
│               │  └─────────────────┘    │  - Impedance     │
├───────────────┴─────────────────────────┴───────────────────┤
│  Footer: Version + Help Link                                 │
└─────────────────────────────────────────────────────────────┘
```

### Responsive Strategy
- Desktop (>1200px): Full 3-column layout
- Tablet (768-1200px): 2-column, results panel below
- Mobile (<768px): Single column, stacked sections

## Features & Interactions

### 1. Antenna Configuration Panel
**Inputs:**
- Antenna Type: Dropdown (Dipole, Monopole, Patch, Yagi, Helix)
- Frequency (MHz): Number input with slider (100-10000 MHz)
- Characteristic Impedance (Ω): Number input (default 50)
- Antenna Length (mm): Number input
- Feed Point Impedance (Ω): Complex number input (real + j*imag)
- Load Impedance (Ω): Complex number input

**Behavior:**
- All inputs validate on blur
- Invalid values show red border + tooltip
- Changes trigger immediate recalculation

### 2. Matching Network Configuration
**Inputs:**
- Matching Method: Dropdown (Single Stub, Double Stub, Quarter Wave, L-Match, Pi-Match)
- Stub Type: Dropdown (Open Circuit, Short Circuit)
- mloc Position: Calculated display (mm from load)
- mtsep Value: Calculated display (mm stub length or capacitive/inductive value)
- Transmission Line Type: Dropdown (Coaxial, Microstrip, Stripline)

**Behavior:**
- mloc/mtsep auto-calculate based on feed impedance and frequency
- Manual override available with lock toggle
- Visual diagram shows stub position on transmission line

### 3. Radiation Pattern Visualization
**Type:** 2D Polar Plot

**Features:**
- Normalized gain (dBi) display
- -3dB, -6dB, -10dB contour rings
- Main lobe direction indicator
- Half-power beamwidth (HPBW) calculation
- Front-to-back ratio display

**Interactions:**
- Hover: Show exact gain at cursor angle
- Click: Lock angle for measurement
- Zoom: Mouse wheel on polar plot
- Animation: Rotate pattern option

**Antenna-specific patterns:**
- Dipole: Figure-8 pattern
- Patch: Broadside with nulls at edges
- Yagi: Directional with strong forward lobe
- Helix: Axial mode with end-fire pattern

### 4. Smith Chart Visualization
**Features:**
- Standard 50Ω normalized impedance Smith chart
- Impedance/Admittance overlay toggle
- Point plotting for feed impedance
- Matching path visualization (arc from load to source)
- Stub position markers

**Interactions:**
- Click to add measurement points
- Drag points to adjust
- Tooltip shows Z, Y, Γ at cursor
- Export PNG button

### 5. S11 Parameter Visualization
**Displays:**
- Real(Γ) vs Frequency plot
- Imaginary(Γ) vs Frequency plot
- Magnitude |S11| in dB
- Phase of S11

**Features:**
- Cursor with readout
- Marker peaks/troughs
- Bandwidth at -10dB indicator
- VSWR overlay

**Interactions:**
- Hover: Crosshair with values
- Drag: Move frequency window
- Double-click: Add marker

### 6. Results Panel
**Calculated Parameters Display:**
- mloc (mm): Matching location from load
- mtsep (mm): Stub electrical length
- VSWR: Standing wave ratio
- Return Loss (dB): |S11| magnitude
- Bandwidth (MHz): -10dB bandwidth
- Efficiency (%): Radiation efficiency estimate
- Input Impedance (Ω): Real + j*Imaginary

**Status Indicators:**
- Match Quality: Excellent/Good/Fair/Poor (color coded)
- VSWR acceptable: Green if <1.5, Yellow if <2.0, Red if >2.0

### 7. Export Functions
- Export all plots as PNG/SVG
- Export parameters as JSON
- Generate PDF report
- Copy S-parameter data to clipboard

## Component Inventory

### InputField Component
- States: default, focus (cyan glow), error (red border), disabled (50% opacity)
- Label above, unit indicator to right
- Error message below in red

### SliderInput Component
- Combined slider + number input
- Drag thumb or type value
- Min/max labels at ends

### SelectDropdown Component
- Custom styled dropdown
- Search/filter for long lists
- States: default, open, selected, disabled

### PlotCard Component
- Title bar with actions (export, fullscreen)
- Chart area with loading skeleton
- Legend area below

### ResultDisplay Component
- Large numerical value with unit
- Label above
- Status indicator dot (green/yellow/red)
- Tooltip with explanation

### StatusBadge Component
- States: success (green), warning (orange), error (red), info (blue)
- Icon + text

### Button Component
- Variants: primary (cyan), secondary (outlined), danger (red)
- States: default, hover, active, disabled, loading

### Card Component
- Panel container with subtle border
- Header with title
- Content area

## Technical Approach

### Stack
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Recharts for data visualization
- React-Smooth for animations

### Architecture
```
src/
├── components/
│   ├── controls/        # Input components
│   ├── plots/            # Chart components
│   └── layout/           # Layout components
├── hooks/
│   ├── useAntennaCalculations.ts
│   ├── useSmithChart.ts
│   └── useS11Parameters.ts
├── utils/
│   ├── antennaMath.ts    # Matching calculations
│   ├── smithChart.ts     # Smith chart utilities
│   └── constants.ts      # Physical constants
├── types/
│   └── index.ts          # TypeScript interfaces
├── App.tsx
└── main.tsx
```

### Key Calculations
1. **VSWR**: `VWSR = (1 + |Γ|) / (1 - |Γ|)`
2. **Return Loss**: `RL = -20 * log10(|Γ|)`
3. **Stub Length (mtsep)**: Uses transmission line equations
4. **Stub Position (mloc)**: Calculated from admittance Smith chart path
5. **Radiation Pattern**: Simplified models per antenna type

### Data Flow
1. User inputs parameters
2. Validation runs on each change
3. Antenna calculations compute feed impedance
4. Matching calculations determine mloc/mtsep
5. Plots update with new data
6. Results panel shows calculated values
