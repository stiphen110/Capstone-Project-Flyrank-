# Form Builder Settings Component - FlyRank AI Capstone

A React settings component for the Form Builder module. It provides configuration for:
1. **Form Theme**: Visual selector for `light` and `dark` modes with responsive cards and icons.
2. **API Endpoint URL**: Form submission destination with input validation (ensuring non-empty and valid URL format), clear action, and quick preset chips.
3. **Strict Validation Toggle**: Accessible switch (`role="switch"`, `aria-checked`) for strict schema validation enforcement.

---

## Component Files

- **Component Implementation**: [`src/components/FormBuilderSettings/FormBuilderSettings.tsx`](src/components/FormBuilderSettings/FormBuilderSettings.tsx)
- **Component Styling**: [`src/components/FormBuilderSettings/FormBuilderSettings.css`](src/components/FormBuilderSettings/FormBuilderSettings.css)
- **TypeScript Definitions**: [`src/components/FormBuilderSettings/types.ts`](src/components/FormBuilderSettings/types.ts)
- **Barrel Export**: [`src/components/FormBuilderSettings/index.ts`](src/components/FormBuilderSettings/index.ts)
- **Interactive Showcase App**: [`src/App.tsx`](src/App.tsx)

---

## Props Specification

```typescript
import { FormSettings, FormBuilderSettingsProps } from './components/FormBuilderSettings';

export interface FormSettings {
  theme: 'light' | 'dark';
  apiEndpoint: string;
  strictValidation: boolean;
}

export interface FormBuilderSettingsProps {
  initialSettings?: Partial<FormSettings>;
  onSave?: (settings: FormSettings) => void | Promise<void>;
  onChange?: (settings: FormSettings) => void;
  onReset?: () => void;
  className?: string;
  title?: string;
  description?: string;
}
```

---

## Usage Example

```tsx
import React, { useState } from 'react';
import { FormBuilderSettings, FormSettings } from './components/FormBuilderSettings';

export const MyFormBuilder: React.FC = () => {
  const [settings, setSettings] = useState<FormSettings>({
    theme: 'light',
    apiEndpoint: 'https://api.flyrank.ai/v1/forms/submit',
    strictValidation: true,
  });

  const handleSave = async (newSettings: FormSettings) => {
    // Save to backend or local state
    console.log('Saved settings:', newSettings);
    setSettings(newSettings);
  };

  return (
    <FormBuilderSettings
      initialSettings={settings}
      onSave={handleSave}
      onChange={(s) => console.log('Current settings:', s)}
    />
  );
};
```

---

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```
