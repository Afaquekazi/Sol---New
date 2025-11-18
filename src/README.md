# Solthron Extension - Modular Source Structure

## 📁 Directory Structure

```
/src
├── /core               # Core functionality
│   ├── constants.js    # All constants and configuration
│   └── state.js        # Global state management
│
├── /analytics
│   └── tracker.js      # Analytics tracking functions
│
├── /api
│   └── backend-auth.js # Backend authentication API
│
├── /platform
│   ├── detector.js     # Platform detection (ChatGPT, Claude, etc.)
│   └── extractors.js   # Content extraction utilities
│
├── /ui
│   ├── animations.js   # UI animations
│   └── notifications.js # Toast notifications
│
└── /utils
    ├── code-detector.js    # Code detection and language detection
    ├── cursor.js           # Cursor position utilities
    └── text-processing.js  # Text manipulation utilities
```

## 🔨 Build Process

The modular source files are bundled into a single `content.js` file for the extension.

### Building

```bash
# Install dependencies (optional, for watch mode)
npm install

# Build once
npm run build

# Watch for changes and auto-rebuild
npm run watch
```

### How It Works

1. **Source Files**: Edit files in `/src` directory
2. **Build Script**: `build.js` bundles all modules into `content-new.js`
3. **Testing**: Test with `content-new.js`
4. **Deploy**: Rename `content-new.js` to `content.js` when ready

## 📦 What's Modularized

### ✅ Currently Modularized
- Constants and configuration
- State management
- Analytics tracking
- Backend authentication
- Platform detection
- Content extractors (Gmail, ChatGPT, Claude, etc.)
- Code detection utilities
- Cursor position utilities
- Text processing utilities
- UI animations
- Notifications system

### 🔄 To Be Modularized
- Autocomplete system
- Prompts management
- Chats management
- Workflows execution
- Quick actions (Ctrl+Shift+S, Alt+R)
- Main UI button and interface
- Shadow DOM setup

## 🎯 Benefits

1. **Separation of Concerns** - Each module has a single responsibility
2. **Easier Maintenance** - Find and fix issues faster
3. **Better Testing** - Test modules independently
4. **Cleaner Code** - No more 10k line files
5. **Team Collaboration** - Multiple developers can work on different modules
6. **Reusability** - Share utilities across features

## 🚀 Next Steps

Continue extracting features into modules:

1. Create `/features/autocomplete` module
2. Create `/features/prompts` module
3. Create `/features/chats` module
4. Create `/features/workflows` module
5. Create `/ui/button.js` for main interface

Each extraction makes the codebase cleaner and more maintainable!

## 📝 Module Guidelines

When creating new modules:

1. **One responsibility per module**
2. **Export only what's needed**
3. **Import from other modules explicitly**
4. **Add comments for complex logic**
5. **Keep modules under 300 lines**
6. **Use descriptive function names**

## 🔍 Finding Code

With the modular structure, finding code is easier:

- **Authentication?** → `src/api/backend-auth.js`
- **Platform detection?** → `src/platform/detector.js`
- **Analytics?** → `src/analytics/tracker.js`
- **Cursor position?** → `src/utils/cursor.js`
- **Notifications?** → `src/ui/notifications.js`

No more searching through 10k lines!
