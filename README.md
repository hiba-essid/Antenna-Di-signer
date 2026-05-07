# Antenna Designer & Visualizer

A professional-grade web application for RF engineers and antenna designers to calculate antenna parameters, visualize radiation patterns, and design impedance matching networks. Built with modern web technologies for precision engineering work.

## 🎯 Features

- **Antenna Analysis**
  - Support for multiple antenna types (dipole, monopole, patch, etc.)
  - Frequency and impedance parameter calculation
  - Real-time parameter visualization

- **Impedance Matching Network Design**
  - Single-stub and multi-stub matching configurations
  - Support for various transmission line types (coaxial, microstrip, etc.)
  - Velocity factor adjustment for transmission lines
  - Automatic calculation of stub lengths and positions

- **Advanced Visualization**
  - **Radiation Pattern**: Interactive polar plot showing antenna directivity
  - **Smith Chart**: Impedance and reflection coefficient visualization
  - **S11 Plots**: Return loss and reflection coefficient across frequency bands
  - Real-time updates as parameters change

- **Professional UI**
  - Dark-mode engineering console aesthetic
  - Responsive design (desktop, tablet, mobile)
  - Intuitive control panel for easy parameter adjustment
  - Real-time results panel with calculated values

- **Engineering Results**
  - VSWR (Voltage Standing Wave Ratio)
  - Return Loss calculations
  - Impedance transformation
  - Matching network parameters (mloc, mtsep)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/hiba-essid/Antenna-Di-signer.git
cd antenna-designer
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

### Build for Production

```bash
npm run build
```

This generates an optimized production build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 📋 Project Structure

```
antenna-designer/
├── src/
│   ├── components/
│   │   ├── controls/           # Control panel for antenna parameters
│   │   │   ├── ControlPanel.tsx
│   │   │   ├── InputField.tsx
│   │   │   └── index.ts
│   │   ├── plots/              # Visualization components
│   │   │   ├── RadiationPattern.tsx
│   │   │   ├── S11Plots.tsx
│   │   │   ├── SmithChart.tsx
│   │   │   └── index.ts
│   │   └── results/            # Results display panel
│   │       ├── ResultsPanel.tsx
│   │       └── index.ts
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/                  # Utility functions
│   │   └── antennaMath.ts      # Core calculation engine
│   ├── App.tsx                 # Main application component
│   ├── index.css               # Global styles
│   └── main.tsx                # Application entry point
├── public/                     # Static assets
├── dist/                       # Production build output
├── package.json
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── README.md
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.4 + PostCSS
- **Visualization**: Recharts 2.10
- **Icons**: Lucide React 0.294
- **Development Server**: Hot Module Replacement (HMR)

## 📊 Core Functionality

### Antenna Parameters

The application calculates various antenna characteristics based on user inputs:

- **Frequency**: Operating frequency in MHz
- **Impedance**: Reference impedance (typically 50Ω)
- **Length**: Physical antenna length
- **Feed Point Impedance**: Real and imaginary components
- **Load Impedance**: Target impedance to be matched

### Impedance Matching

Automatic calculation of matching network components:

- **Single-Stub Matching**: Position and length of matching stub
- **Multi-Stub Matching**: Multiple stubs for broadband matching
- **Transmission Line Types**: Coaxial, microstrip, and custom lines
- **Velocity Factor**: Adjustable for different cable types

### Visualization Outputs

1. **Radiation Pattern**: Polar plot showing antenna gain in different directions
2. **Smith Chart**: Normalized impedance visualization
3. **S11 Parameter**: Reflection coefficient across frequency range

## 🔧 Configuration

### Antenna Types

Supported antenna types can be extended in `src/utils/antennaMath.ts`:
- Dipole
- Monopole
- Patch antenna
- Helical antenna
- Custom antennas

### Transmission Line Parameters

Modify transmission line characteristics in control panel:
- Characteristic Impedance (Z₀)
- Velocity Factor (typically 0.66 for coaxial)
- Length and position

## 📖 Usage Guide

1. **Select Antenna Type**: Choose from the antenna type dropdown
2. **Set Frequency**: Enter the operating frequency in MHz
3. **Configure Impedance**: Set feed point and load impedances
4. **Choose Matching Method**: Select single-stub or multi-stub matching
5. **View Results**: Check calculated parameters and visualizations
6. **Adjust Parameters**: Fine-tune values to optimize matching

## 🎨 Design Philosophy

The application follows professional engineering software aesthetics:
- **Dark Theme**: Reduced eye strain for extended use
- **High Contrast**: Clear data visualization and readability
- **Precision Typography**: Monospace fonts for numerical data
- **Responsive Layout**: Adapts to different screen sizes
- **Real-time Feedback**: Immediate calculation updates

## 🔬 Scientific Basis

The calculations are based on fundamental RF engineering principles:
- Transmission line theory
- Smith chart impedance transformation
- S-parameter calculations
- Antenna radiation theory
- Matching network synthesis

For detailed specifications, see [SPEC.md](SPEC.md).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Test the application: `npm run dev`
4. Build for production: `npm run build`
5. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 📧 Support

For issues, questions, or suggestions, please open an issue in the repository.

## 🔗 Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Smith Chart Theory](https://en.wikipedia.org/wiki/Smith_chart)
- [RF Engineering Basics](https://www.tutorialspoint.com/rf_wireless/)

---

**Version**: 1.0.0  
**Last Updated**: 2026  
**Status**: Active Development