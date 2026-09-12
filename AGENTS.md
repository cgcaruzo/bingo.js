# AGENTS.md - Bingo.js

## Build & Development Commands

```bash
# Development with hot reload
npm run dev

# Production build
npm run build

# Lint and auto-fix
npm run lint

# Format code with Prettier
npm run format

# Preview production build
npm run start

# Platform-specific builds
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

**Note:** No test framework is configured. Verify changes with `npm run build` and `npm run lint`.

## Project Structure

```
src/
├── main/           # Electron main process
│   └── index.js    # Window creation, IPC handlers, protocol registration
├── preload/        # Preload scripts (context bridge)
│   └── index.js    # Exposes APIs to renderer via contextBridge
└── renderer/       # React application
    ├── src/
    │   ├── App.jsx           # Root component with providers
    │   ├── main.jsx          # React entry point
    │   ├── components/       # React components
    │   ├── context/          # React Context providers
    │   ├── config/           # Configuration files
    │   ├── helpers/          # Utility functions
    │   └── assets/           # CSS, fonts, images
    └── index.html            # HTML entry point
```

## Code Style Guidelines

### Formatting (Prettier)

- **Single quotes** for strings
- **No semicolons** at end of statements
- **Print width:** 100 characters
- **No trailing commas**

### Imports

- Group imports: React first, then internal modules, then relative imports
- Use named imports when possible
- Import PropTypes for component prop validation

```javascript
import { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { DataContext } from '../context/DataContext'
```

### Naming Conventions

- **Components:** PascalCase (`HeaderRight`, `SettingsPanel`)
- **Functions/variables:** camelCase (`handleDraw`, `numbersRef`)
- **Constants:** camelCase or UPPER_SNAKE_CASE for true constants
- **CSS classes:** kebab-case (`.header-right`, `.btn-draw`)
- **IPC channels:** kebab-case (`'save-game-state'`, `'load-config'`)

### React Patterns

#### Components

- Use function components with hooks
- Export default for main components
- Use named exports for utilities and contexts
- Always define PropTypes for component props

```javascript
function MyComponent({ title, onClose }) {
  // component logic
}

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
}

export default MyComponent
```

#### Context Pattern

- Create context with `createContext()`
- Provide both Context and Provider from same file
- Use `useCallback` for functions exposed in context
- Handle async operations with try/catch

```javascript
export const MyContext = createContext()

export const MyProvider = ({ children }) => {
  const [state, setState] = useState(initialState)

  const updateState = useCallback(async (newState) => {
    setState(newState)
    try {
      await window.api.saveState(newState)
    } catch (error) {
      console.error('Error al guardar estado:', error)
    }
  }, [])

  return <MyContext.Provider value={{ state, updateState }}>{children}</MyContext.Provider>
}

MyProvider.propTypes = {
  children: PropTypes.node.isRequired
}
```

#### Hooks Usage

- `useState` for local component state
- `useEffect` for side effects (always include cleanup when needed)
- `useRef` for DOM references and mutable values that don't trigger re-renders
- `useCallback` for functions passed as props or used in dependencies
- `useContext` for consuming context values

### Electron IPC Pattern

#### Main Process (src/main/index.js)

```javascript
ipcMain.handle('channel-name', async (_event, data) => {
  try {
    // operation
    return { success: true, data: result }
  } catch (error) {
    console.error('Error message:', error)
    return { success: false, error: error.message }
  }
})
```

#### Preload (src/preload/index.js)

```javascript
const api = {
  myFunction: (data) => ipcRenderer.invoke('channel-name', data)
}

contextBridge.exposeInMainWorld('api', api)
```

#### Renderer

```javascript
const result = await window.api.myFunction(data)
if (result.success) {
  // handle success
} else {
  console.error(result.error)
}
```

### Error Handling

- Always wrap async IPC calls in try/catch
- Return structured responses: `{ success: true, data }` or `{ success: false, error }`
- Log errors with descriptive messages in Spanish (app is in Spanish)
- Don't let errors crash the app - handle gracefully

### CSS & Styling

- Use CSS variables for theming (defined in `:root`)
- Variables are dynamically updated via `ConfigContext`
- Use `clamp()` for responsive sizing: `clamp(min, preferred, max)`
- Use viewport units (`vw`) for scalable UI
- Avoid hardcoded colors - use CSS variables
- Custom protocol `bingo-images://` for user images

```css
:root {
  --color-primary: #1a237e;
  /* ... other variables */
}

.my-class {
  color: var(--color-primary);
  font-size: clamp(1vw, 2vw, 3vw);
}
```

### Configuration System

- `defaultConfig.js` contains default values
- `ConfigContext.jsx` manages runtime configuration
- Configuration persists to `userData/app-config.json`
- Images are copied to `userData/images/` for portability
- CSS variables are updated dynamically via `applyTheme()`

### State Management

- **Game state:** `DataContext` - manages bingo numbers, save/load game
- **Config state:** `ConfigContext` - manages theme, colors, images
- Both contexts persist to files via IPC
- Use `useRef` for values that need to be current in callbacks but shouldn't trigger re-renders

### File Organization

- One component per file
- Context files in `context/` directory
- Helper functions in `helpers/` directory
- Configuration in `config/` directory
- Assets in `assets/` directory

### Comments

- Write comments in Spanish (team preference)
- Keep comments minimal - code should be self-documenting
- Use JSDoc only for complex utility functions

## Important Notes

1. **No TypeScript** - Project uses plain JavaScript with PropTypes
2. **No test framework** - Verify with build and lint
3. **Electron 31** - Uses modern Electron APIs
4. **React 18** - Uses modern React patterns
5. **Tailwind CSS** - Available but mostly using custom CSS
6. **Offline-first** - All assets bundled locally, no external dependencies
7. **Spanish UI** - All user-facing text is in Spanish

## Common Tasks

### Adding a new IPC channel

1. Add handler in `src/main/index.js`
2. Expose API in `src/preload/index.js`
3. Call from renderer via `window.api.channelName()`

### Adding a new component

1. Create file in `src/renderer/src/components/`
2. Define PropTypes
3. Export default
4. Import and use in parent component

### Modifying theme/colors

1. Update `defaultConfig.js` for defaults
2. CSS variables are auto-applied via `ConfigContext`
3. Users can customize via Settings panel (⚙ button)

### Adding user-selectable images

1. Use `window.api.selectImage()` to open file dialog
2. Use `window.api.copyImage(path, type)` to copy to userData
3. Reference via `bingo-images://filename` protocol
