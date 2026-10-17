# Project AI Directives: AI Form Builder

Whenever generating or modifying React components for this project, you must strictly adhere to the following rules:

1. **Schema-Driven Validation:** Never write manual validation logic. Always use `zod` to define the data schema, integrated with `react-hook-form` using the `@hookform/resolvers/zod` adapter.
2. **Accessibility (a11y) First:** All form inputs must have explicitly associated `<label>` elements. All error states must utilize `aria-invalid="true"` and `aria-describedby` linking to the specific error message ID. Do not generate inaccessible UI components.
3. **The Plan-Code-Test Loop:** For any new feature generation, you must first outline your architectural plan. After writing the component, you must generate a corresponding test file using Jest and React Testing Library before considering the task complete.