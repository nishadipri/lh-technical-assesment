# Liva HeathCare Technical Assessment — Student Enrollment App

A small Next.js + TypeScript app for enrolling students into courses with a modern, accessible form, client‑side validation, and a dynamic summary table. Styling is a blend of Bootstrap components and Tailwind utility classes.

## Features

- **Student Enrollment Form** with comprehensive validation (React Hook Form)
  - Fields: first name, last name, email, course, subjects
  - Course selection dynamically drives the Subject options
  - Subjects require at least 3 selections (immediate feedback + submit guard)
  - Real-time validation with accessible error messages
  - **Normalized data structure** - subjects can belong to multiple courses without duplication
  - See [DATA_STRUCTURE.md](./DATA_STRUCTURE.md) for detailed architecture
- **Client-only Data Storage** (React useState)
  - Each submission is appended to a table below the form
  - Table displays: Name, Email, Course, Subjects with responsive design
  - All data persists only during the session (no backend/localStorage)
- **Edit Flow** with modal overlay
  - Each table row has an "Edit" action button
  - Opens modal with the same form component pre-filled
  - Update applies changes to the table in component state
  - Form component is reused for both Enroll and Edit flows via props
- **Polished UI/UX**
  - Bootstrap 5 components + Tailwind CSS utilities
  - React-Select for multi-select subjects with custom styling
  - Stable IDs for React-Select to prevent hydration mismatch
  - Loading states and error handling
  - Smooth transitions and hover effects
- **Comprehensive Testing**
  - 23 unit tests with 92.65% code coverage
  - Jest + React Testing Library
  - Tests cover rendering, validation, interactions, and accessibility

## Tech Stack

- [Next.js](https://nextjs.org/) 16.0.1 (App Router, React 19)
- [TypeScript](https://www.typescriptlang.org/) 5
- [React Hook Form](https://react-hook-form.com/) 7.66
- [react-select](https://react-select.com/home) 5.10
- [Bootstrap 5](https://getbootstrap.com/) 5.3.8
- [Tailwind CSS](https://tailwindcss.com/) 4.1.17
- [Jest](https://jestjs.io/) 30.2 + [React Testing Library](https://testing-library.com/react) 16.3

## Screenshots

![App Screenshot](./images/sShot1.png)


## Getting Started

### Prerequisites

- Node.js 20+ recommended
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/nishadipri/lh-technical-assesment.git
cd lh-technical-assesment
```

2. Install dependencies

```bash
npm install
```

3. Run the development server

```bash
npm run dev
```

- App will be available at http://localhost:3000

4. Build for production

```bash
npm run build
npm start
```

### Running Tests

The project includes comprehensive unit tests using Jest and React Testing Library.

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

**Test Coverage:** The `StudentEnrollForm` component has 23 comprehensive tests covering:

- Form rendering with different states
- Validation for all fields (email format, required fields, minimum subject selection)
- User interactions and dynamic behavior
- Form submission and reset functionality
- Accessibility features

See [TEST_README.md](./TEST_README.md) for detailed testing documentation.

## Project Structure

```
liva health care-technical-assesment/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with metadata
│   │   ├── page.tsx                # Main page with form + table state management
│   │   └── globals.css             # Bootstrap + Tailwind layers + custom styles
│   ├── components/
│   │   ├── forms/
│   │   │   ├── studentEnrollForm.tsx       # Reusable form component
│   │   │   └── studentEnrollForm.test.tsx  # Comprehensive unit tests (23 tests)
│   │   ├── tables/
│   │   │   └── studentSummaryTable.tsx     # Table with enrolled students
│   │   └── edit/
│   │       └── studentEditModal.tsx        # Modal wrapper for editing
│   ├── data/
│   │   └── courses.ts              # Course and subject data + types
│   └── hooks/
│       └── fetchCourses.ts         # Simulated async course fetching
├── public/                         # Static assets
├── coverage/                       # Test coverage reports
├── jest.config.ts                  # Jest configuration
├── jest.setup.ts                   # Test setup and mocks
├── next.config.ts                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.mjs             # Tailwind CSS configuration
├── postcss.config.mjs              # PostCSS configuration
├── eslint.config.mjs               # ESLint configuration
├── package.json                    # Dependencies and scripts
├── README.md                       # This file
└── TEST_README.md                  # Testing documentation
```

**Key Directories:**

- `src/app/` - Next.js app router pages and layouts
- `src/components/` - Reusable React components organized by feature
- `src/data/` - Static data and TypeScript types
- `src/hooks/` - Custom React hooks
- `coverage/` - Generated test coverage reports (gitignored)

## Key Files

### [src/app/page.tsx](./src/app/page.tsx)

- Main application page component
- Manages enrolled students state (`useState`)
- Handles enrollment and edit operations
- Resolves course and subject names for display
- Coordinates between form, table, and modal components

### [src/components/forms/studentEnrollForm.tsx](./src/components/forms/studentEnrollForm.tsx)

- Reusable form component with comprehensive validation
- **Props:**
  - `onSubmit` - Form submission handler
  - `initialValues` - Pre-fill form data (for edit mode)
  - `submitLabel` - Button text (default: "Enroll")
  - `instanceIdPrefix` - Unique ID prefix (default: "enroll")
  - `resetAfterSubmit` - Reset form after submit (default: true)
- Uses React Hook Form for state management and validation
- Stable `instanceId`/`inputId` for React-Select to avoid hydration mismatch
- Enforces 3+ subjects with both field-level and submit-level validation
- **92.65% test coverage** with 23 comprehensive unit tests

### [src/components/edit/studentEditModal.tsx](./src/components/edit/studentEditModal.tsx)

- Modal overlay component for editing students
- Renders `studentEnrollForm` with edit-specific props
- Handles modal open/close state
- Props: `open`, `initialValues`, `onClose`, `onUpdate`, `instanceIdPrefix`

### [src/components/tables/studentSummaryTable.tsx](./src/components/tables/studentSummaryTable.tsx)

- Displays enrolled students in a responsive Bootstrap table
- Columns: Name, Email, Course, Subjects, Actions
- Subject badges with responsive wrapping
- Edit button per row to trigger modal

### [src/hooks/fetchCourses.ts](./src/hooks/fetchCourses.ts)

- Custom hook simulating async course data fetching
- Returns: `courses`, `isLoading`, `error`, `refetch`
- Configurable delay for network simulation
- Includes 10% random error simulation for testing

### [src/data/courses.ts](./src/data/courses.ts)

- Course and subject type definitions
- Static course data (Computer Science, Business, Engineering)
- Each course contains multiple subjects

## Behavior Details

### Validation

- **First Name & Last Name:** Required fields
- **Email:** Required with format validation (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- **Course:** Required selection
- **Subjects:** Minimum of 3 subjects required (`subjectIds.length >= 3`)
- Real-time validation feedback with error messages
- All errors displayed with accessible `role="alert"` for screen readers

### State Management

- Client-only data storage using React `useState`
- No backend calls; all enrollments kept in component state
- Each enrollment appended to the students array
- On update, the selected row is replaced with edited values

### Form Reusability

- Same `StudentEnrollForm` component used for both:
  - **Enrollment:** `submitLabel="Enroll"`, `resetAfterSubmit={true}`
  - **Editing:** `submitLabel="Update"`, `resetAfterSubmit={false}`
- Props control behavior differences between create and edit modes

### Hydration Safety

- React-Select generates auto IDs that can differ between SSR and CSR
- Fixed by setting explicit `instanceId` and `inputId` props per form instance
- Prevents hydration mismatch warnings in Next.js

## Accessibility

- Semantic HTML with proper form labels
- All inputs have associated `<label>` elements
- Error messages rendered with `role="alert"` for screen reader announcements
- Keyboard navigable modal (focusable controls, close button, Escape key support)
- Sufficient color contrast for badges, buttons, and text
- Focus states for interactive elements
- Multi-select component (react-select) with ARIA attributes

## Development Notes

### Styling Approach

- **Bootstrap 5** provides the component foundation (cards, tables, badges, buttons)
- **Tailwind CSS** adds utility classes for spacing, hover effects, and transitions
- Tailwind's `preflight` is disabled to avoid conflicts with Bootstrap's Reboot
- React-Select uses `classNamePrefix="rs"` for scoped styling

### Course & Subject Loading

- `useFetchCourses` hook simulates network delay (configurable, default 2000ms)
- 10% random error simulation for testing error states
- Loading and error states displayed in the UI

### Form Validation Strategy

- **React Hook Form** manages form state and validation
- Field-level validation (email format, required fields)
- Submit-level validation (minimum subject count)
- Real-time error feedback as user interacts with fields
- Validation prevents submission until all requirements met

## Troubleshooting

### Tailwind classes not applied

- Ensure `tailwind.config.mjs` `content` globs include `src/**/*.{js,ts,jsx,tsx}`
- Restart dev server after modifying Tailwind/PostCSS config: `npm run dev`
- Check that `globals.css` imports are in correct order (Bootstrap first, then Tailwind)

### Hydration mismatch warnings (react-select)

- Verify `instanceId` and `inputId` props are set and unique per instance
- Use different prefixes for different form instances (e.g., `enroll-...`, `edit-...`)
- The project already has this implemented correctly

### Tests failing

- Ensure all dependencies are installed: `npm install`
- Clear Jest cache if needed: `npx jest --clearCache`
- Check Node version (20+ recommended)

### TypeScript errors

- Run type checking: `npx tsc --noEmit`
- Ensure all `@types/*` packages are installed
- Check `tsconfig.json` for proper configuration

## Scripts Reference

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Create production build
npm start            # Start production server (requires build first)
npm run lint         # Run ESLint
npm test             # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Roadmap / Future Enhancements

- [ ] Delete action for table rows
- [ ] Search/filter functionality in the table
- [ ] Sort columns in the table
- [ ] Export enrollments to CSV
- [ ] Persist data to localStorage or backend API
- [ ] Pagination for large datasets
- [ ] Form field for enrollment start date
- [ ] Form field for additional notes
- [ ] Bulk enrollment via CSV import
- [ ] Student profile view with enrollment history
- [ ] Email notifications on enrollment
- [ ] Add more comprehensive E2E tests with Playwright or Cypress

## Testing

This project includes comprehensive unit tests using Jest and React Testing Library.

### Current Test Coverage

- **23 tests** for `StudentEnrollForm` component
- **92.65%** statement coverage
- **94.11%** branch coverage
- **80%** function coverage

### Test Categories

1. **Form Rendering** - Component render states, initial values, loading/error states
2. **Form Validation** - Field validation, email format, subject count requirements
3. **Form Interaction** - User input, dynamic updates, course selection
4. **Form Submission** - Success handling, reset behavior, loading states
5. **Dynamic Behavior** - Prop updates, instance configurations
6. **Accessibility** - ARIA labels, role attributes, screen reader support

For detailed testing documentation, see [TEST_README.md](./TEST_README.md).

## Architecture

For detailed architecture diagrams and visual representations, see [ARCHITECTURE.md](./ARCHITECTURE.md).

### Design Decisions

This application follows a **component-based architecture** with a clear separation of concerns:

#### 1. **Component Composition Pattern**

- **Reusable Form Component**: `StudentEnrollForm` is designed to be flexible and reusable for both create and edit operations
- **Single Responsibility**: Each component has a focused purpose (form, table, modal)
- **Props-driven Behavior**: Components accept props to modify their behavior rather than duplicating code

#### 2. **State Management Strategy**

- **Co-located State**: Student data is managed with `useState` in the main `page.tsx` component
- **Lifting State Up**: Parent component manages state and passes handlers down to children
- **Unidirectional Data Flow**: Data flows down via props, changes flow up via callbacks

**Why this approach?**

- Simple application with limited state complexity
- All state needed in one place (the main page)
- Easy to understand and maintain
- No unnecessary abstraction for the current scale

#### 3. **Form Management**

- **React Hook Form**: Chosen for its performance and developer experience
- **Declarative Validation**: Validation rules defined alongside form fields
- **Controlled Components**: Form state managed efficiently with minimal re-renders

#### 4. **Data Flow**

```
┌─────────────────────────────────────────────┐
│          page.tsx (Main Container)          │
│   - Manages students[] state                │
│   - Handles add/update operations           │
│   - Resolves course/subject names           │
└───────────┬─────────────────────────────────┘
            │
            ├─────────────────┬─────────────────┬───────────────────┐
            ▼                 ▼                 ▼                   ▼
    ┌───────────────┐  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐
    │ EnrollForm    │  │   Table     │  │  EditModal   │  │fetchCourses │
    │ (Create mode) │  │ (Display)   │  │ (Edit mode)  │  │   (Hook)    │
    └───────────────┘  └─────────────┘  └──────────────┘  └─────────────┘
```

#### 5. **Styling Architecture**

- **Hybrid Approach**: Bootstrap for components + Tailwind for utilities
- **Bootstrap Base**: Provides consistent UI components (cards, tables, buttons)
- **Tailwind Enhancement**: Adds spacing, hover states, and custom refinements
- **Scoped Styling**: React-Select uses `classNamePrefix` to avoid CSS conflicts

#### 6. **Type Safety**

- **TypeScript Throughout**: All components, hooks, and data structures are typed
- **Shared Types**: Common types defined in data files and exported
- **Type Inference**: Leverages TypeScript's inference for cleaner code

### Trade-offs Made

#### 1. **Client-Side State Only (No Backend)**

**Decision**: Use React `useState` without persistence

**Pros:**

- Simple implementation for prototype/assessment
- No backend infrastructure needed
- Fast development and iteration
- Easy to test and demonstrate

**Cons:**

- Data lost on page refresh
- No multi-user support
- Cannot scale to production use
- No data validation on server side

**Rationale**: Appropriate for a technical assessment focused on frontend architecture and UI/UX

#### 2. **Bootstrap + Tailwind (Hybrid Styling)**

**Decision**: Use both frameworks instead of just one

**Pros:**

- Bootstrap provides robust, accessible components out-of-the-box
- Tailwind offers utility-first flexibility for custom styling
- Best of both worlds for rapid development

**Cons:**

- Larger bundle size
- Potential style conflicts (mitigated by disabling Tailwind preflight)
- Learning curve for developers unfamiliar with both
- CSS specificity management needed

**Rationale**: Balances speed of development with customization needs

#### 3. **Simulated Async Data Loading**

**Decision**: `useFetchCourses` simulates network delay instead of real API calls

**Pros:**

- Demonstrates async state handling (loading, error states)
- Tests UI behavior with delays
- No backend dependency
- Configurable delay for testing

**Cons:**

- Not realistic for production
- Doesn't test real network failures
- Mock data may not reflect actual data structure

**Rationale**: Shows best practices for async data handling without backend complexity

#### 4. **Form Component Reusability**

**Decision**: Single form component for both create and edit via props

**Pros:**

- DRY principle - no code duplication
- Consistent validation logic
- Easier maintenance
- Single source of truth for form behavior

**Cons:**

- More complex props interface
- Need to handle both modes in one component
- Slightly harder to understand at first glance

**Rationale**: Demonstrates component design best practices and reduces code duplication

#### 5. **No Delete Functionality**

**Decision**: Only Create and Update operations, no Delete

**Pros:**

- Simplified state management
- Focuses on core requirements
- Prevents accidental data loss
- Smaller codebase for assessment

**Cons:**

- Incomplete CRUD operations
- Users cannot remove mistakes
- Less realistic for production app

**Rationale**: Scope decision for technical assessment timeline

#### 6. **Minimum 3 Subjects Validation**

**Decision**: Hard-coded business rule requiring exactly 3+ subjects

**Pros:**

- Clear business requirement
- Demonstrates custom validation
- User guidance via UI feedback

**Cons:**

- Not configurable per course
- May not reflect real-world flexibility
- Hard-coded in multiple places

**Rationale**: Demonstrates validation implementation, though would be configurable in production

### Technology Choices

| Technology          | Why Chosen                                                               | Alternative Considered               |
| ------------------- | ------------------------------------------------------------------------ | ------------------------------------ |
| **Next.js 16**      | Modern React framework, App Router, SSR capabilities, TypeScript support | Create React App, Vite               |
| **React Hook Form** | Performant, minimal re-renders, great DX, built-in validation            | Formik, custom form state            |
| **react-select**    | Accessible multi-select, customizable, widely used                       | Custom implementation, Headless UI   |
| **Bootstrap 5**     | Complete component library, accessible, well-documented                  | Material-UI, Chakra UI               |
| **Tailwind CSS**    | Utility-first, rapid prototyping, minimal custom CSS                     | Styled-components, CSS Modules       |
| **Jest + RTL**      | Industry standard, great Next.js integration                             | Vitest, Testing Library alternatives |
| **TypeScript**      | Type safety, better DX, catch errors early                               | JavaScript                           |

## Potential Next Steps

### Immediate Improvements (Priority Order)

#### 1. **Migrate to Zustand for State Management** 🎯

**Current Issue**: State is managed in `page.tsx` with `useState`, which works fine now but limits scalability.

**Why Zustand?**

- Lightweight (< 1KB) compared to Redux
- No boilerplate - simpler than Context API + useReducer
- Built-in TypeScript support
- Easy DevTools integration
- No Provider wrapper needed
- Better performance with selective subscriptions

#### 2. **Add Delete Functionality**

- Implement delete button in table rows
- Add confirmation dialog to prevent accidental deletion
- Update Zustand store with `deleteStudent` action
- Add undo functionality with toast notifications

#### 3. **Implement Search and Filter**

```typescript
// Add to Zustand store
interface Filters {
  searchQuery: string
  courseFilter: string | null
  sortBy: 'name' | 'email' | 'course' | 'date'
  sortOrder: 'asc' | 'desc'
}

// UI Components
- Search input above table
- Course filter dropdown
- Sort column headers
- Clear filters button
```

#### 4. **Add Data Persistence Options**

**Option A: LocalStorage** (Easiest)

- Already supported via Zustand persist middleware
- No backend needed
- Data persists across sessions
- Limited to ~5-10MB

**Option B: Backend API** (Production-ready)

```typescript
// api/students/route.ts - Next.js API Routes
export async function GET() {
  // Fetch from database
}

export async function POST(request: Request) {
  // Create student
}

export async function PATCH(request: Request) {
  // Update student
}

export async function DELETE(request: Request) {
  // Delete student
}
```

#### 5. **Enhanced Validation**

- **Course-specific subject requirements**: Different minimums per course
- **Configurable validation rules**: Store rules in course data
- **Async validation**: Check email availability via API

#### 6. **Export Functionality**

```typescript
// features/export.ts
export const exportToCSV = (students: Student[]) => {
  const headers = ["First Name", "Last Name", "Email", "Course", "Subjects"];
  const rows = students.map((s) => [
    s.firstName,
    s.lastName,
    s.email,
    s.courseName,
    s.subjectNames.join("; "),
  ]);
  // Generate CSV and download
};

export const exportToPDF = (students: Student[]) => {
  // Use jsPDF library
};
```

#### 7. **Pagination and Virtual Scrolling**

- Implement pagination for large datasets (100+ students)
- Use `react-window` or `@tanstack/react-virtual` for performance
- Add page size selector (10, 25, 50, 100)

#### 8. **Advanced UI Features**

- **Bulk operations**: Select multiple rows, bulk delete
- **Drag-and-drop**: Reorder table rows
- **Column visibility**: Toggle which columns to show
- **Responsive table**: Card view on mobile
- **Dark mode**: Theme toggle with localStorage persistence

#### 9. **Analytics Dashboard**

```typescript
// New route: /dashboard
- Total enrollments
- Students per course (pie chart)
- Popular subjects (bar chart)
- Enrollment trends over time (line chart)
- Use recharts or Chart.js
```

#### 10. **End-to-End Testing**

```typescript
// e2e/enrollment.spec.ts using Playwright
test("should enroll a student", async ({ page }) => {
  await page.goto("/");
  await page.fill('[name="firstName"]', "John");
  await page.fill('[name="lastName"]', "Doe");
  // ... complete form
  await page.click('button[type="submit"]');
  await expect(page.locator("table")).toContainText("John Doe");
});
```

### Long-term Enhancements

#### Database Integration

- **PostgreSQL** with Prisma ORM
- **Supabase** for real-time features
- **MongoDB** for flexible schema

#### Authentication & Authorization

- **NextAuth.js** for authentication
- Role-based access (admin, student, teacher)
- Per-user enrollment history

#### Real-time Features

- **WebSockets** for live updates
- Collaborative editing
- Notifications for course changes

#### Advanced Course Management

- Course scheduling with calendar
- Prerequisites tracking
- Waitlist functionality
- Enrollment limits per course

#### Notifications

- Email confirmations (SendGrid, Resend)
- In-app notifications
- SMS reminders (Twilio)

**Total Migration Time**: ~4-5 hours

### Performance Optimizations

1. **Code Splitting**: Lazy load modal component
2. **Memoization**: Use `React.memo` for table rows
3. **Virtual Scrolling**: For 1000+ students
4. **Debounced Search**: Prevent excessive re-renders
5. **Service Worker**: Cache course data

## License

This project is provided as part of a technical assessment. No explicit license is included.

## Author

**Nishadi**

- GitHub: [@nishadipri](https://github.com/nishadipri)
- Repository: [lh-technical-assesment](https://github.com/nishadipri/lh-technical-assesment)

## Acknowledgments

Built with:

- Next.js 16 + React 19 + TypeScript
- React Hook Form for elegant form management
- Bootstrap 5 + Tailwind CSS for styling
- react-select for enhanced multi-select UX
- Jest + React Testing Library for comprehensive testing

---

**Made with ❤️ for Liva Healthcare Technical Assessment**
