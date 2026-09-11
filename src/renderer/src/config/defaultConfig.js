export const defaultConfig = {
  eventName: 'Bingo',
  subtitle: '',
  theme: {
    primary: '#1a237e',
    primaryDark: '#0d1642',
    primaryLight: '#3949ab',
    secondary: '#c62828',
    secondaryDark: '#8e0000',
    accent: '#ff6f00',
    background: '#f5f5f5',
    surface: '#ffffff',
    surfaceLight: '#fafafa',
    text: '#1a1a1a',
    textMuted: '#666666',
    success: '#2e7d32',
    border: '#e0e0e0'
  },
  decades: [
    { range: [1, 9], color: '#d32f2f' },
    { range: [10, 19], color: '#f57c00' },
    { range: [20, 29], color: '#fbc02d' },
    { range: [30, 39], color: '#388e3c' },
    { range: [40, 49], color: '#00897b' },
    { range: [50, 59], color: '#1976d2' },
    { range: [60, 69], color: '#7b1fa2' },
    { range: [70, 79], color: '#c2185b' },
    { range: [80, 90], color: '#455a64' }
  ],
  backgroundImage: null,
  backgroundOverlay: 0.85,
  logoImage: null
}

export const getDecadeColor = (config, number) => {
  for (const decade of config.decades) {
    if (number >= decade.range[0] && number <= decade.range[1]) {
      return decade.color
    }
  }
  return config.theme.primary
}
