# LanceConnect Developer Rules & Mobile App Blueprint (rules.md)

This file contains the strict coding rules for LanceConnect developers and provides a technical blueprint for packaging the web application into mobile apps (iOS & Android).

---

## 1. Coding Rules & Guidelines

### TypeScript
* **No `any`**: All variables, function parameters, and return types must be fully typed. Use union types, interfaces, or type assertions if needed.
* **Schema Validation**: Use Zod schema validation in [validations.ts](file:///C:/Users/Akinola%20Olujobi/.gemini/antigravity/scratch/lanceconnect/src/lib/validations.ts) for forms and API payloads.

### Styling & Design System
* **Tailwind CSS Only**: Use utility classes. Do not use custom CSS rules unless styling complex third-party elements or variables.
* **Colors and Themes**: Use Tailwind classes tied to variables (e.g. `text-foreground`, `bg-background`, `border-input`). Avoid absolute colors like `bg-red-500` except for badges and alerts.
* **Component Styling**: All buttons, forms, and cards must have active transition and hover animations.

### Supabase Edge Functions
* All live web crawlers, outreach content generators, and external payments must run through Supabase Edge Functions. Do not call raw scrapers or payment gateways directly from the client.

---

## 2. Converting the Web App to a Mobile App

LanceConnect can be converted into mobile apps using two main strategies:

### Option A: Progressive Web App (PWA)
A PWA allows users to "install" LanceConnect directly from Safari/Chrome on iOS and Android. It runs offline and has a standalone icon.

#### Implementation Steps:
1. **Install PWA plugin**:
   ```bash
   npm i -D vite-plugin-pwa
   ```
2. **Update `vite.config.ts`**:
   Add the `VitePWA` plugin with a manifest configuration:
   ```typescript
   import { VitePWA } from 'vite-plugin-pwa'

   export default defineConfig({
     plugins: [
       react(),
       VitePWA({
         registerType: 'autoUpdate',
         manifest: {
           name: 'LanceConnect',
           short_name: 'LanceConnect',
           description: 'Find B2B Leads and Clients Worldwide',
           theme_color: '#09090b',
           icons: [
             { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
             { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
           ]
         }
       })
     ]
   })
   ```

---

### Option B: Native iOS & Android Apps via Capacitor
Capacitor wraps the React/Vite built bundle into a native shell and allows compiled builds (`.ipa` and `.apk`) for Apple App Store and Google Play.

#### Implementation Steps:
1. **Install Capacitor CLI and Core**:
   ```bash
   npm i @capacitor/core
   npm i -D @capacitor/cli
   ```
2. **Initialize Capacitor**:
   ```bash
   npx cap init LanceConnect app.lanceconnect.com --web-dir=dist
   ```
3. **Install Native Platform SDKs**:
   ```bash
   npm i @capacitor/android @capacitor/ios
   ```
4. **Add Platforms**:
   ```bash
   npx cap add android
   npx cap add ios
   ```
5. **Build and Sync**:
   Every time you build the React app, sync the assets to the native platforms:
   ```bash
   npm run build
   npx cap sync
   ```
6. **Open in IDEs for Compile**:
   * Open Android Studio: `npx cap open android`
   * Open Xcode: `npx cap open ios`
