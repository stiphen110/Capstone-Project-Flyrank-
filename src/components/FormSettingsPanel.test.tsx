import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormSettingsPanel } from './FormSettingsPanel';

describe('FormSettingsPanel Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all required form controls with explicit label associations', () => {
    render(<FormSettingsPanel />);

    // Theme dropdown
    const themeSelect = screen.getByLabelText(/^theme/i);
    expect(themeSelect).toBeInTheDocument();
    expect(themeSelect.tagName.toLowerCase()).toBe('select');

    // Endpoint URL input
    const endpointInput = screen.getByLabelText(/endpoint url/i);
    expect(endpointInput).toBeInTheDocument();
    expect(endpointInput.tagName.toLowerCase()).toBe('input');

    // Strict validation checkbox
    const strictCheckbox = screen.getByLabelText(/strict validation/i);
    expect(strictCheckbox).toBeInTheDocument();
    expect(strictCheckbox).toHaveAttribute('type', 'checkbox');
  });

  it('fails validation when endpoint URL is empty upon submission', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<FormSettingsPanel onSubmit={handleSubmit} />);

    const endpointInput = screen.getByLabelText(/endpoint url/i);
    const saveButton = screen.getByRole('button', { name: /save settings/i });

    // Initial state: not invalid
    expect(endpointInput).toHaveAttribute('aria-invalid', 'false');

    // Click submit with empty URL
    await user.click(saveButton);

    // Expect validation error message
    await waitFor(() => {
      const errorMsg = screen.getByRole('alert');
      expect(errorMsg).toHaveTextContent(/endpoint url is required/i);
    });

    // Input must have aria-invalid="true"
    expect(endpointInput).toHaveAttribute('aria-invalid', 'true');

    // onSubmit must NOT have been called
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('fails validation when endpoint URL is not a valid HTTP/HTTPS URL', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<FormSettingsPanel onSubmit={handleSubmit} />);

    const endpointInput = screen.getByLabelText(/endpoint url/i);
    const saveButton = screen.getByRole('button', { name: /save settings/i });

    // Enter a malformed non-URL string
    await user.clear(endpointInput);
    await user.type(endpointInput, 'invalid-endpoint-url');
    await user.click(saveButton);

    // Error message must appear
    await waitFor(() => {
      const errorAlert = screen.getByRole('alert');
      expect(errorAlert).toHaveTextContent(/must be a valid http or https url/i);
    });

    expect(endpointInput).toHaveAttribute('aria-invalid', 'true');
    expect(handleSubmit).not.toHaveBeenCalled();

    // Enter an unsupported protocol like ftp://
    await user.clear(endpointInput);
    await user.type(endpointInput, 'ftp://ftp.example.com/files');
    await user.click(saveButton);

    await waitFor(() => {
      const errorAlert = screen.getByRole('alert');
      expect(errorAlert).toHaveTextContent(/must be a valid http or https url/i);
    });

    expect(endpointInput).toHaveAttribute('aria-invalid', 'true');
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('passes validation and calls onSubmit when given a valid HTTP/HTTPS URL', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<FormSettingsPanel onSubmit={handleSubmit} />);

    const endpointInput = screen.getByLabelText(/endpoint url/i);
    const saveButton = screen.getByRole('button', { name: /save settings/i });

    // Type a valid HTTPS URL
    await user.clear(endpointInput);
    await user.type(endpointInput, 'https://api.flyrank.ai/v1/forms/submit');
    await user.click(saveButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    // Verify submitted values
    expect(handleSubmit).toHaveBeenCalledWith({
      theme: 'light',
      endpointUrl: 'https://api.flyrank.ai/v1/forms/submit',
      strictValidation: false,
    });

    // Expect no error message to be present
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(endpointInput).toHaveAttribute('aria-invalid', 'false');

    // Expect success banner to be displayed
    expect(screen.getByRole('status')).toHaveTextContent(/saved successfully/i);
  });

  it('correctly handles theme changes and strict validation toggling', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <FormSettingsPanel
        initialValues={{
          theme: 'light',
          endpointUrl: '',
          strictValidation: false,
        }}
        onSubmit={handleSubmit}
      />
    );

    const themeSelect = screen.getByLabelText(/^theme/i);
    const endpointInput = screen.getByLabelText(/endpoint url/i);
    const strictCheckbox = screen.getByLabelText(/strict validation/i);
    const saveButton = screen.getByRole('button', { name: /save settings/i });

    // Change theme to "dark"
    await user.selectOptions(themeSelect, 'dark');

    // Check strict validation
    await user.click(strictCheckbox);

    // Provide valid HTTP endpoint
    await user.type(endpointInput, 'http://localhost:8080/api/forms');

    // Submit
    await user.click(saveButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    expect(handleSubmit).toHaveBeenCalledWith({
      theme: 'dark',
      endpointUrl: 'http://localhost:8080/api/forms',
      strictValidation: true,
    });
  });
});
