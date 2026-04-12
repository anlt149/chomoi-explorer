# Frontend Development Skills & Rules

This project follows specific strict guidelines for styling and component architecture to ensure a clean, maintainable, and premium codebase.

## 1. Styling Stack: `styled-components` MUST in Use
- **Do NOT use inline framing/styling:** The use of `style={{ ... }}` in JSX is strictly prohibited for layout, visual design, and spacing.
- **Use `styled-components`:** All styling should be driven by the `styled-components` library. Export styling definitions to keep JSX simple.
- **Dynamic Styling via Props:** Use styled-components' capability to pass boolean flags or variables to dynamically change styles instead of conditionally rendering inline styles.

## 2. Component Reusability
- **Avoid plain Div Souping:** Whenever you find yourself declaring a highly customized `<div className="...">`, stop and create a Styled Component (e.g., `<Container>`, `<FlexRow>`, `<CardBox>`).
- **Build Common Atoms:** Create common, reusable layout and typography pieces like `<Typography>`, `<Spacer>`, `<Button>`, or `<Box>` and reuse them everywhere across the project.
- **Always Reuse:** Never rewrite layout CSS properties (like `display: flex; align-items: center; justify-content: center`) repeatedly. Refactor into standard re-usable primitive styled components (e.g., `<FlexCenter>`).

## 3. Aesthetic & UI Rules
- Rely on global CSS variables for design tokens (Colors, Typography, Spacing).
- Ensure components adapt flawlessly to both Light Mode and Dark Mode out of the box using global CSS variables configured in `index.css`.
