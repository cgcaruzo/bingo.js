export const eventConfig = {
  eventName: 'Bingo',
  subtitle: '',
  logoText: '',
  backgroundImage: null,
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
    warning: '#f57c00',
    error: '#c62828'
  },
  decades: [
    { range: [1, 9], color: '#d32f2f', name: '1-9' },
    { range: [10, 19], color: '#f57c00', name: '10-19' },
    { range: [20, 29], color: '#fbc02d', name: '20-29' },
    { range: [30, 39], color: '#388e3c', name: '30-39' },
    { range: [40, 49], color: '#00897b', name: '40-49' },
    { range: [50, 59], color: '#1976d2', name: '50-59' },
    { range: [60, 69], color: '#7b1fa2', name: '60-69' },
    { range: [70, 79], color: '#c2185b', name: '70-79' },
    { range: [80, 90], color: '#455a64', name: '80-90' }
  ]
}

export const getDecadeColor = (number) => {
  for (const decade of eventConfig.decades) {
    if (number >= decade.range[0] && number <= decade.range[1]) {
      return decade.color
    }
  }
  return eventConfig.theme.primary
}
