/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0d1117',
        'bg-secondary': '#161b22',
        'bg-tertiary': '#21262d',
        'border-default': '#30363d',
        'text-primary': '#e6edf3',
        'text-secondary': '#8b949e',
        'accent-cyan': '#58a6ff',
        'accent-green': '#3fb950',
        'accent-orange': '#d29922',
        'accent-red': '#f85149',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
        'sans': ['IBM Plex Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
