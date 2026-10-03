# Design system

## Direction

The visual language is a **technical field journal**: calm editorial typography,
precise rules, compact mono annotations, generous reading space, and restrained
geometric details. It should feel documented rather than decorated.

The source of truth is split between:

- `src/styles/tokens.css` for semantic colors, type families, spacing, widths,
  and rules.
- `src/styles/global.css` for shared layout, interaction states, prose, and
  component styling.
- `/style-guide` for rendered examples of links, buttons, tags, cards, callouts,
  article prose, and code.

## Theme architecture

The visual system supports **light**, **dark**, and **system-preference** modes.

The operating system preference is followed by default via `prefers-color-scheme`.
A keyboard-accessible header control allows visitors to explicitly select Light,
Dark, or System mode without a page reload. Explicit choices are stored in
`localStorage.theme` and applied to the root element via a `data-theme` attribute.
An inline `<script>` in `<head>` executes before rendering to eliminate flash of
incorrect theme (FOUC). Choosing "System" removes the stored preference, returning
control to the operating system.

Both palettes use semantic roles instead of literal color names: background,
surface, text, muted text, border, accent, focus, code, success, warning, and
danger. Text and interactive states are selected to meet WCAG AA contrast.

## Interaction rules

- Navigation and actions respond immediately.
- Keyboard focus is always visible and is not communicated by color alone.
- Motion is limited to short state transitions and is removed when
  `prefers-reduced-motion` is enabled.
- Skip navigation is the first focusable control.
- Interactive targets are at least 44px tall where they behave as buttons.
- No interaction depends on hover, animation, or a client-side runtime.

## Responsive references

All references must remain usable at 320px and at 200% text zoom.

### Homepage

- **Desktop:** a three-column field sheet: vertical folio, editorial introduction,
  and a compact practice note.
- **Mobile:** the folio narrows to a 48px rail; the introduction and practice note
  stack in the second column; the full wordmark becomes visually hidden.

### Writing index

- **Desktop:** page introduction above a two-column list; each entry shows type,
  date, title, summary, and tags separated by rules.
- **Mobile:** one chronological column; metadata wraps above the title and no
  information relies on a side-by-side arrangement.

### Article

- **Desktop:** article header and body use the 42rem reading measure; metadata may
  occupy a narrow margin column without reducing the prose measure.
- **Mobile:** metadata moves above the title; prose, code, and callouts use the
  full content width; code scrolls horizontally rather than clipping.

### Project case study

- **Desktop:** project facts form a compact rail alongside the narrative; outcomes
  and supporting material use the shared card grid.
- **Mobile:** facts precede the narrative and cards collapse to one column.

## Component conventions

- Buttons are for explicit actions; editorial navigation remains a text link.
- Cards may be entirely clickable only when they have one destination.
- Tags describe content and only become links when they filter or navigate.
- Callouts use a text label as well as a colored rule.
- Prose headings preserve document hierarchy; visual scale never substitutes for
  semantic heading order.
