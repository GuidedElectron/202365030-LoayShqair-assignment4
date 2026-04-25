# Technical Documentation

## 1. Project Overview
This project is a front-end portfolio website upgraded for Assignment 3 of SWE 363. The goal of the upgrade was not only to make the website look better, but to demonstrate stronger programming ability through API usage, multi-step logic, persistent state, validation, and performance improvements.

The application uses a lightweight stack:
- HTML for page structure
- CSS for layout, theming, responsiveness, and visual feedback
- JavaScript for interactivity, data fetching, validation, state handling, and UI updates

The design decision was to keep the project simple and readable while still meeting the advanced functionality requirements of the assignment.

---

## 2. File Responsibilities

### `index.html`
Responsible for:
- semantic page structure
- sections for hero, coursework, skills, projects, GitHub repositories, and contact form
- placeholders for dynamic content such as greeting text, timer, repository cards, and validation messages
- accessible labels and section IDs for navigation

### `css/styles.css`
Responsible for:
- color theme variables
- dark/light theme switching support
- responsive layout using grid and flexbox
- card styling and form styling
- hover and focus states
- reduced-motion handling

### `js/script.js`
Responsible for:
- application initialization after `DOMContentLoaded`
- state creation and restoration from `localStorage`
- theme toggle logic
- visitor name save/clear logic
- simulated login state
- session timer
- project filtering/sorting/search logic
- contact form validation
- GitHub API loading and local caching
- efficient DOM rendering

---

## 3. Architecture and Flow
When the page loads, JavaScript creates a central `state` object. This object stores the current user-facing conditions of the app, including theme, difficulty preference, visitor name, login state, timer value, and repository cache configuration.

Initialization order:
1. Restore saved state from `localStorage`
2. Apply theme immediately
3. Render greeting and visitor-specific UI
4. Start session timer
5. Bind difficulty controls and project controls
6. Bind contact form validation
7. Load repositories from cache or API

This creates a predictable flow where UI behavior is driven by stored state rather than scattered independent values.

---

## 4. Feature Mapping to Assignment Requirements

### 4.1 API Integration
The project integrates with the GitHub REST API.

Endpoint used:
```js
https://api.github.com/users/GuidedElectron/repos?sort=updated&per_page=6
```

Purpose:
- display live repository data connected to the portfolio owner
- make the project dynamic and meaningful
- show the ability to fetch, process, and render external data

Displayed fields:
- repository name
- description
- main language
- star count
- updated date

Error handling:
- checks `response.ok`
- throws a custom error if the API response is invalid
- displays a clear status message and fallback error text if loading fails

Extra improvement:
- repository results are cached in `localStorage` for 10 minutes to reduce repeated requests and speed up reloads

### 4.2 Complex Logic
The project list demonstrates multi-condition decision logic.

Active controls:
- search text
- category filter
- sort order
- difficulty preference

A project card is shown only if all required conditions pass:
- the text matches the search query
- the category matches the selected category unless “all” is selected
- the card difficulty matches the selected difficulty unless “all” is selected

After filtering, the visible cards are sorted according to the selected mode:
- newest first
- oldest first
- alphabetical by title

This is stronger than a one-click feature because rendering depends on several rules working together.

Additional logic appears in the contact form:
- required field checks
- regular expression validation for name
- regular expression validation for email
- minimum message length check
- success message only after all previous checks pass

### 4.3 State Management
The application stores persistent UI state using `localStorage`.

Stored keys:
- `portfolio-theme`
- `portfolio-level`
- `portfolio-visitor-name`
- `portfolio-login-state`
- `portfolio-repo-cache-v1`

Behavior:
- theme remains the same after refresh
- difficulty preference remains selected after refresh
- visitor name remains available after refresh
- simulated login state remains available after refresh
- repository cache avoids unnecessary network calls for a short time window

This demonstrates that the site remembers user choices and restores them correctly.

### 4.4 Performance
Performance was improved using simple techniques that fit a plain JavaScript portfolio.

Implemented techniques:
- **Debounced search:** search input waits briefly before re-running filter logic, reducing repeated DOM work during fast typing
- **Local API caching:** recent GitHub responses are reused for 10 minutes
- **Efficient rendering:** repository cards are appended through `DocumentFragment`, which reduces repeated layout recalculation
- **Lightweight implementation:** no large framework or external UI dependency is required
- **Low asset weight:** the page does not depend on heavy images for core functionality
- **Reduced motion support:** animation and transition load are minimized for users who prefer reduced motion

These changes are small individually, but together they make the app smoother and more defensible under the performance rubric.

---

## 5. JavaScript Function Design

### `setupTheme(state)`
Loads the saved theme and binds the toggle button.

### `applyTheme(theme)`
Applies the correct class to the root document and updates button text.

### `setupVisitorName(state)`
Restores the visitor name, allows saving it, and also allows clearing it.

### `setupLoginState(state)`
Simulates login/logout to demonstrate another persistent UI state.

### `setupTimer(state)`
Tracks how long the user has stayed on the page.

### `setupDifficultyPreference(state)`
Updates the selected difficulty level and triggers project rerendering.

### `setupProjectControls(state)` and `updateProjects(state)`
Bind search/filter/sort events and perform the combined filtering and sorting logic.

### `setupContactForm()`
Handles validation and feedback messages for the contact form.

### `setupRepoLoader(state)` and `loadRepositories(state)`
Manage API loading, manual refresh, cache checking, and error handling.

### `getCachedRepos(state)` / `storeCachedRepos(state, repos)`
Read and write cached repository data using a timestamp.

### `renderRepositories(repositories, container)`
Creates repository cards using DOM nodes instead of raw HTML string injection.

### `debounce(callback, delay)`
Utility function used to reduce how often filtering runs during typing.

---

## 6. Validation Rules
The contact form intentionally applies more than one rule to show stronger logic.

Validation sequence:
1. ensure no field is empty
2. ensure the name contains at least two alphabetic characters
3. ensure the email format is valid
4. ensure the message contains at least 20 characters
5. display a success message only after all checks pass

This sequential structure improves clarity and prevents invalid submissions.

---

## 7. Accessibility and Usability Notes
The site includes several usability-focused choices:
- skip link for keyboard users
- semantic sections and headings
- labels for form inputs
- `aria-live` regions for dynamic status text
- clear feedback messages for validation and API loading
- responsive layout for smaller screens
- reduced-motion support

---

## 8. Testing Checklist
The project should be tested by checking the following:

### Functional testing
- theme toggles correctly
- theme stays saved after refresh
- visitor name saves and clears correctly
- simulated login state toggles and stays saved
- difficulty preference updates visible guidance and project list
- search/filter/sort work together correctly
- empty-state message appears when no match is found
- contact form rejects invalid input and accepts valid input
- GitHub repositories load successfully when internet is available
- GitHub section shows a helpful message if the API fails

### Responsive testing
- layout works on desktop width
- layout stacks correctly on tablet/mobile width
- navigation remains usable on smaller screens

### Browser testing
- test in Chrome, Edge, and Firefox if possible

---

## 9. Possible Future Improvements
If this portfolio continues into a later assignment, possible next steps include:
- adding project details modals
- adding pagination for more repositories
- using a build tool for asset minification
- adding unit tests for validation functions
- deploying the site publicly and linking the deployment in the README

---

## 10. Conclusion
The upgraded portfolio satisfies the main technical goals of Assignment 3 while keeping the implementation understandable. It demonstrates live API usage, multi-step front-end logic, persistent state, performance-aware coding decisions, and more complete technical documentation.
