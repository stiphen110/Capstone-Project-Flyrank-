export type FormTheme = 'light' | 'dark';

export interface FormSettings {
  theme: FormTheme;
  apiEndpoint: string;
  strictValidation: boolean;
}

export interface FormValidationErrors {
  apiEndpoint?: string;
}

export interface FormBuilderSettingsProps {
  /**
   * Initial settings values. Defaults to light theme, empty endpoint, and strictValidation off.
   */
  initialSettings?: Partial<FormSettings>;

  /**
   * Callback fired when settings are saved and valid.
   */
  onSave?: (settings: FormSettings) => void | Promise<void>;

  /**
   * Optional callback triggered on any value change.
   */
  onChange?: (settings: FormSettings) => void;

  /**
   * Optional callback when settings are reset to defaults.
   */
  onReset?: () => void;

  /**
   * Custom className for the outer container.
   */
  className?: string;

  /**
   * Optional title override for the settings card.
   */
  title?: string;

  /**
   * Optional subtitle/description override.
   */
  description?: string;
}
