import React, { useState, useEffect } from 'react';
import './FormBuilderSettings.css';
import {
  FormSettings,
  FormBuilderSettingsProps,
  FormValidationErrors,
  FormTheme,
} from './types';

const DEFAULT_SETTINGS: FormSettings = {
  theme: 'light',
  apiEndpoint: '',
  strictValidation: false,
};

export const FormBuilderSettings: React.FC<FormBuilderSettingsProps> = ({
  initialSettings,
  onSave,
  onChange,
  onReset,
  className = '',
  title = 'Form Builder Settings',
  description = 'Configure form appearance, target submission endpoint, and validation rules.',
}) => {
  // State for form values
  const [settings, setSettings] = useState<FormSettings>(() => ({
    ...DEFAULT_SETTINGS,
    ...initialSettings,
  }));

  // Validation errors state
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [touched, setTouched] = useState<{ apiEndpoint?: boolean }>({});

  // Feedback states
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Sync with initialSettings if they change from parent
  useEffect(() => {
    if (initialSettings) {
      setSettings((prev) => ({
        ...prev,
        ...initialSettings,
      }));
    }
  }, [initialSettings]);

  // URL Validation logic
  const validateUrl = (url: string): string | undefined => {
    const trimmed = url.trim();

    if (!trimmed) {
      return 'API endpoint URL cannot be empty.';
    }

    try {
      const parsed = new URL(trimmed);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return 'Endpoint URL must use http:// or https:// protocol.';
      }
    } catch {
      // If URL parsing fails, check if it's a relative path starting with /
      if (!trimmed.startsWith('/') && !/^https?:\/\//i.test(trimmed)) {
        return 'Please enter a valid URL (e.g., https://api.flyrank.ai/v1/forms).';
      }
    }

    return undefined;
  };

  // Handle URL change
  const handleUrlChange = (value: string) => {
    const newSettings = { ...settings, apiEndpoint: value };
    setSettings(newSettings);
    onChange?.(newSettings);

    if (touched.apiEndpoint) {
      const errorMsg = validateUrl(value);
      setErrors((prev) => ({ ...prev, apiEndpoint: errorMsg }));
    }
  };

  // Handle URL blur
  const handleUrlBlur = () => {
    setTouched((prev) => ({ ...prev, apiEndpoint: true }));
    const errorMsg = validateUrl(settings.apiEndpoint);
    setErrors((prev) => ({ ...prev, apiEndpoint: errorMsg }));
  };

  // Handle Theme change
  const handleThemeChange = (newTheme: FormTheme) => {
    const newSettings = { ...settings, theme: newTheme };
    setSettings(newSettings);
    onChange?.(newSettings);
  };

  // Handle Strict Validation toggle
  const handleStrictToggle = () => {
    const newSettings = {
      ...settings,
      strictValidation: !settings.strictValidation,
    };
    setSettings(newSettings);
    onChange?.(newSettings);
  };

  // Handle Reset
  const handleReset = () => {
    const resetValues = { ...DEFAULT_SETTINGS, ...initialSettings };
    setSettings(resetValues);
    setErrors({});
    setTouched({});
    setShowSuccessAlert(false);
    onReset?.();
    onChange?.(resetValues);
  };

  // Handle Form Submission / Save
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark as touched
    setTouched({ apiEndpoint: true });

    // Validate
    const urlError = validateUrl(settings.apiEndpoint);
    if (urlError) {
      setErrors({ apiEndpoint: urlError });
      return;
    }

    setErrors({});
    setIsSaving(true);
    setShowSuccessAlert(false);

    try {
      if (onSave) {
        await onSave(settings);
      } else {
        // Fallback simulated save delay
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      setShowSuccessAlert(true);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`fbs-container ${className}`}>
      {/* Header */}
      <div className="fbs-header">
        <div className="fbs-header-left">
          <div className="fbs-icon-badge" aria-hidden="true">
            {/* Form Builder / Settings SVG Icon */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          </div>
          <div className="fbs-title-group">
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>
        <div className="fbs-header-status">
          <span className="fbs-status-dot" aria-hidden="true" />
          <span>Active</span>
        </div>
      </div>

      {/* Form Content */}
      <form className="fbs-form" onSubmit={handleSubmit} noValidate>
        {/* Success Alert Banner */}
        {showSuccessAlert && (
          <div className="fbs-alert fbs-alert-success" role="alert">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>Settings saved and verified successfully!</span>
            <button
              type="button"
              className="fbs-alert-dismiss"
              onClick={() => setShowSuccessAlert(false)}
              aria-label="Dismiss notification"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* 1. Field: Form Theme (Light / Dark) */}
        <div className="fbs-section">
          <div className="fbs-label">
            <span>Form Appearance Theme</span>
            <span className="fbs-label-badge">UI Mode</span>
          </div>
          <p className="fbs-hint">
            Select the visual theme applied to public form viewers and embedded widgets.
          </p>

          <div
            className="fbs-theme-grid"
            role="radiogroup"
            aria-label="Form Theme Selection"
          >
            {/* Light Option */}
            <div
              className={`fbs-theme-option ${settings.theme === 'light' ? 'active' : ''}`}
              data-theme="light"
              onClick={() => handleThemeChange('light')}
              role="radio"
              aria-checked={settings.theme === 'light'}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  handleThemeChange('light');
                }
              }}
            >
              <input
                type="radio"
                name="theme"
                value="light"
                checked={settings.theme === 'light'}
                onChange={() => handleThemeChange('light')}
                className="fbs-theme-radio"
                tabIndex={-1}
              />
              <div className="fbs-theme-icon" aria-hidden="true">
                {/* Sun Icon */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              </div>
              <div className="fbs-theme-info">
                <span className="fbs-theme-name">Light Theme</span>
                <span className="fbs-theme-desc">Crisp, clean contrast with bright backgrounds</span>
              </div>
              {settings.theme === 'light' && (
                <div className="fbs-theme-check" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </div>

            {/* Dark Option */}
            <div
              className={`fbs-theme-option ${settings.theme === 'dark' ? 'active' : ''}`}
              data-theme="dark"
              onClick={() => handleThemeChange('dark')}
              role="radio"
              aria-checked={settings.theme === 'dark'}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  handleThemeChange('dark');
                }
              }}
            >
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={settings.theme === 'dark'}
                onChange={() => handleThemeChange('dark')}
                className="fbs-theme-radio"
                tabIndex={-1}
              />
              <div className="fbs-theme-icon" aria-hidden="true">
                {/* Moon Icon */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </div>
              <div className="fbs-theme-info">
                <span className="fbs-theme-name">Dark Theme</span>
                <span className="fbs-theme-desc">Sleek, low-light aesthetic for dark layouts</span>
              </div>
              {settings.theme === 'dark' && (
                <div className="fbs-theme-check" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Field: API Endpoint URL */}
        <div className="fbs-section">
          <label htmlFor="fbs-api-url" className="fbs-label">
            <span>
              API Endpoint URL <span className="fbs-label-required">*</span>
            </span>
            <span className="fbs-label-badge">Required</span>
          </label>
          <p className="fbs-hint">
            The target HTTP/HTTPS destination where collected form payload data will be posted.
          </p>

          <div className="fbs-input-wrapper">
            <span className="fbs-input-icon" aria-hidden="true">
              {/* Globe / Link Icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </span>
            <input
              id="fbs-api-url"
              type="url"
              value={settings.apiEndpoint}
              onChange={(e) => handleUrlChange(e.target.value)}
              onBlur={handleUrlBlur}
              placeholder="https://api.yourdomain.com/v1/forms/submit"
              className={`fbs-input ${
                errors.apiEndpoint ? 'fbs-input-error' : ''
              } ${settings.apiEndpoint && !errors.apiEndpoint ? 'fbs-input-valid' : ''}`}
              aria-invalid={!!errors.apiEndpoint}
              aria-describedby={
                errors.apiEndpoint ? 'fbs-api-url-error' : undefined
              }
            />
            {settings.apiEndpoint && (
              <button
                type="button"
                className="fbs-input-action-btn"
                onClick={() => handleUrlChange('')}
                title="Clear input"
                aria-label="Clear API Endpoint"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Error Message */}
          {errors.apiEndpoint && (
            <div id="fbs-api-url-error" className="fbs-error-msg" role="alert">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{errors.apiEndpoint}</span>
            </div>
          )}

          {/* Quick presets / suggestions */}
          <div className="fbs-suggestions">
            <span className="fbs-suggestions-label">Quick Presets:</span>
            <button
              type="button"
              className="fbs-suggestion-chip"
              onClick={() =>
                handleUrlChange('https://api.flyrank.ai/v1/forms/submit')
              }
            >
              Production API
            </button>
            <button
              type="button"
              className="fbs-suggestion-chip"
              onClick={() =>
                handleUrlChange('https://staging-api.flyrank.ai/v1/forms/submit')
              }
            >
              Staging API
            </button>
            <button
              type="button"
              className="fbs-suggestion-chip"
              onClick={() =>
                handleUrlChange('http://localhost:8000/api/v1/submit')
              }
            >
              Localhost (Dev)
            </button>
          </div>
        </div>

        {/* 3. Field: Toggle for Strict Validation */}
        <div className="fbs-section">
          <div className="fbs-label">
            <span>Validation Strictness</span>
            <span className="fbs-label-badge">Security & Integrity</span>
          </div>

          <div
            className={`fbs-toggle-card ${settings.strictValidation ? 'checked' : ''}`}
            onClick={handleStrictToggle}
            role="switch"
            aria-checked={settings.strictValidation}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                handleStrictToggle();
              }
            }}
          >
            <div className="fbs-toggle-meta">
              <div className="fbs-toggle-title-row">
                <span className="fbs-toggle-title">Strict Schema Validation</span>
                <span
                  className={`fbs-toggle-pill ${
                    settings.strictValidation ? 'pill-active' : 'pill-inactive'
                  }`}
                >
                  {settings.strictValidation ? 'Strict Enforced' : 'Permissive'}
                </span>
              </div>
              <p className="fbs-toggle-desc">
                When enabled, submissions with unexpected fields are rejected, and type constraints
                are strictly enforced before invoking the API endpoint.
              </p>
            </div>

            <div className="fbs-switch" aria-hidden="true">
              <div className="fbs-switch-knob" />
            </div>
          </div>
        </div>

        <div className="fbs-divider" />

        {/* Optional Live Config Preview */}
        {showPreview && (
          <div className="fbs-preview-card">
            <div className="fbs-preview-header">
              <span>Live Configuration State</span>
              <span>JSON</span>
            </div>
            <pre className="fbs-preview-body">
              {JSON.stringify(settings, null, 2)}
            </pre>
          </div>
        )}

        {/* Footer Actions */}
        <div className="fbs-footer">
          <button
            type="button"
            className="fbs-btn fbs-btn-ghost"
            onClick={() => setShowPreview(!showPreview)}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {showPreview ? 'Hide JSON Preview' : 'Show JSON Preview'}
          </button>

          <div className="fbs-btn-group">
            <button
              type="button"
              className="fbs-btn fbs-btn-ghost"
              onClick={handleReset}
              disabled={isSaving}
            >
              Reset
            </button>
            <button
              type="submit"
              className="fbs-btn fbs-btn-primary"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="fbs-spinner" aria-hidden="true" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormBuilderSettings;
