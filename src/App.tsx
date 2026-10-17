import React, { useState } from 'react';
import './App.css';
import { FormBuilderSettings } from './components/FormBuilderSettings';
import { FormSettings } from './components/FormBuilderSettings/types';

export const App: React.FC = () => {
  // Application-level state receiving saved settings
  const [activeSettings, setActiveSettings] = useState<FormSettings>({
    theme: 'light',
    apiEndpoint: 'https://api.flyrank.ai/v1/forms/submit',
    strictValidation: true,
  });

  const [savedHistory, setSavedHistory] = useState<FormSettings[]>([]);

  const handleSaveSettings = async (settings: FormSettings) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    setActiveSettings(settings);
    setSavedHistory((prev) => [settings, ...prev.slice(0, 4)]);

    // Toggle body theme class for interactive demonstration
    if (settings.theme === 'dark') {
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
    }
  };

  return (
    <div className="app-wrapper">
      <header className="app-hero">
        <div className="app-badge">
          <span>FlyRank AI • Capstone Project</span>
        </div>
        <h1>Form Builder Settings</h1>
        <p>
          Configure the public form appearance, target endpoint destination for submissions, and
          toggle strict schema validation rules.
        </p>
      </header>

      <main className="app-content-grid">
        {/* FormBuilderSettings Component */}
        <FormBuilderSettings
          initialSettings={activeSettings}
          onSave={handleSaveSettings}
          onChange={(newSettings) => {
            // Optional: can do real-time updates if desired
            console.log('FormBuilderSettings onChange:', newSettings);
          }}
          onReset={() => {
            document.body.classList.remove('theme-dark');
          }}
        />

        {/* Live Form Viewer Mockup - Demonstrates how settings affect the live form */}
        <div
          className={`form-preview-mockup ${
            activeSettings.theme === 'dark' ? 'preview-dark' : 'preview-light'
          }`}
        >
          <div className="mockup-header">
            <h4>Live Form Theme Preview: {activeSettings.theme.toUpperCase()}</h4>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '3px 8px',
                borderRadius: '999px',
                backgroundColor: activeSettings.strictValidation ? '#10b981' : '#f59e0b',
                color: '#fff',
                fontWeight: 600,
              }}
            >
              {activeSettings.strictValidation ? 'Strict Schema Active' : 'Permissive Mode'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sample Input Field</label>
            <input
              type="text"
              className="mockup-input"
              placeholder="User enters response here..."
              disabled
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                Posting to: <code>{activeSettings.apiEndpoint || '(None configured)'}</code>
              </span>
              <button type="button" className="mockup-btn" disabled>
                Submit Form
              </button>
            </div>
          </div>
        </div>

        {/* Saved Output Inspector */}
        <section className="app-saved-output">
          <h3>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Active Saved Configuration
          </h3>

          <div className="app-saved-badges">
            <div className="badge-item">
              <span>Theme:</span>
              <strong>{activeSettings.theme}</strong>
            </div>
            <div className="badge-item">
              <span>Endpoint:</span>
              <strong>{activeSettings.apiEndpoint || 'Not set'}</strong>
            </div>
            <div className="badge-item">
              <span>Strict Validation:</span>
              <strong>{activeSettings.strictValidation ? 'Enabled' : 'Disabled'}</strong>
            </div>
          </div>

          <pre className="code-output">{JSON.stringify(activeSettings, null, 2)}</pre>
        </section>
      </main>
    </div>
  );
};

export default App;
