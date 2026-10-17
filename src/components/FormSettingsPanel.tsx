import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zod schema enforcing validation rules
export const formSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system'], {
    required_error: 'Theme selection is required',
    invalid_type_error: 'Please select a valid theme',
  }),
  endpointUrl: z
    .string()
    .trim()
    .min(1, 'Endpoint URL is required')
    .refine(
      (url) => {
        try {
          const parsed = new URL(url);
          return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
          return false;
        }
      },
      {
        message: 'Endpoint URL must be a valid HTTP or HTTPS URL (e.g., https://api.example.com)',
      }
    ),
  strictValidation: z.boolean().default(false),
});

export type FormSettingsValues = z.infer<typeof formSettingsSchema>;

export interface FormSettingsPanelProps {
  initialValues?: Partial<FormSettingsValues>;
  onSubmit?: (values: FormSettingsValues) => void | Promise<void>;
  className?: string;
}

export const FormSettingsPanel: React.FC<FormSettingsPanelProps> = ({
  initialValues,
  onSubmit,
  className = '',
}) => {
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormSettingsValues>({
    resolver: zodResolver(formSettingsSchema),
    defaultValues: {
      theme: 'light',
      endpointUrl: '',
      strictValidation: false,
      ...initialValues,
    },
    mode: 'onBlur',
  });

  const handleFormSubmit = async (data: FormSettingsValues) => {
    setSaveSuccess(false);
    if (onSubmit) {
      await onSubmit(data);
    }
    setSaveSuccess(true);
  };

  return (
    <div
      className={`max-w-2xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 sm:p-8 ${className}`}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Form Settings
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configure appearance theme, API destination endpoint, and validation rules.
        </p>
      </div>

      {saveSuccess && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 text-sm flex items-center justify-between"
        >
          <span>Form settings saved successfully!</span>
          <button
            type="button"
            onClick={() => setSaveSuccess(false)}
            className="text-green-800 dark:text-green-300 hover:opacity-75 font-medium ml-3"
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-6">
        {/* 1. Theme Dropdown */}
        <div>
          <label
            htmlFor="theme"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Theme
          </label>
          <select
            id="theme"
            {...register('theme')}
            aria-invalid={Boolean(errors.theme)}
            aria-describedby={errors.theme ? 'theme-error' : 'theme-description'}
            className={`w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
              errors.theme
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
            }`}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
          <p id="theme-description" className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            Select the color scheme applied to the form builder and public viewers.
          </p>
          {errors.theme && (
            <p
              id="theme-error"
              role="alert"
              className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400"
            >
              {errors.theme.message}
            </p>
          )}
        </div>

        {/* 2. Endpoint URL Text Input */}
        <div>
          <label
            htmlFor="endpointUrl"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Endpoint URL <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="endpointUrl"
            type="text"
            placeholder="https://api.example.com/v1/forms"
            {...register('endpointUrl')}
            aria-invalid={Boolean(errors.endpointUrl)}
            aria-describedby={
              errors.endpointUrl ? 'endpointUrl-error' : 'endpointUrl-description'
            }
            className={`w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
              errors.endpointUrl
                ? 'border-red-500 focus:ring-red-500 bg-red-50/20 dark:bg-red-950/20'
                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
            }`}
          />
          <p
            id="endpointUrl-description"
            className="mt-1.5 text-xs text-gray-500 dark:text-gray-400"
          >
            Must be a valid HTTP or HTTPS destination where form data will be sent.
          </p>
          {errors.endpointUrl && (
            <p
              id="endpointUrl-error"
              role="alert"
              className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400"
            >
              {errors.endpointUrl.message}
            </p>
          )}
        </div>

        {/* 3. Strict Validation Toggle / Checkbox */}
        <div className="pt-2">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="strictValidation"
                type="checkbox"
                {...register('strictValidation')}
                aria-invalid={Boolean(errors.strictValidation)}
                aria-describedby="strictValidation-description"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="strictValidation"
                className="font-semibold text-gray-700 dark:text-gray-300 cursor-pointer select-none"
              >
                Strict Validation
              </label>
              <p
                id="strictValidation-description"
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                Enforce rigid schema checking and reject payloads with extra or invalid fields.
              </p>
            </div>
          </div>
          {errors.strictValidation && (
            <p
              id="strictValidation-error"
              role="alert"
              className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400"
            >
              {errors.strictValidation.message}
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              reset();
              setSaveSuccess(false);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormSettingsPanel;
