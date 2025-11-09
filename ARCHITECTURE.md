# Architecture Documentation

## Current Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              page.tsx (Main Container)                    │  │
│  │  • Manages students[] with useState                       │  │
│  │  • Coordinates all child components                       │  │
│  │  • Resolves course/subject names                          │  │
│  └───────────┬──────────────────────────────────────────────┘  │
│              │                                                   │
│      ┌───────┴────────┬──────────────┬────────────────┐        │
│      ▼                ▼              ▼                ▼         │
│  ┌─────────┐   ┌──────────┐   ┌──────────┐   ┌─────────────┐  │
│  │ Enroll  │   │  Table   │   │  Edit    │   │fetchCourses │  │
│  │  Form   │   │Component │   │  Modal   │   │   Hook      │  │
│  └─────────┘   └──────────┘   └──────────┘   └─────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                               │
│  ┌────────────────┐        ┌─────────────────┐                 │
│  │  Static Data   │        │  Runtime State  │                 │
│  │  courses.ts    │        │  (useState)     │                 │
│  └────────────────┘        └─────────────────┘                 │
└─────────────────────────────────────────────────────────────────┘
```

## Proposed Architecture with Zustand

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              page.tsx (Thin Container)                    │  │
│  │  • Renders components only                                │  │
│  │  • No state management                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│              │                                                   │
│      ┌───────┴────────┬──────────────┬────────────────┐        │
│      ▼                ▼              ▼                ▼         │
│  ┌─────────┐   ┌──────────┐   ┌──────────┐   ┌─────────────┐  │
│  │ Enroll  │   │  Table   │   │  Edit    │   │fetchCourses │  │
│  │  Form   │   │Component │   │  Modal   │   │   Hook      │  │
│  └────┬────┘   └────┬─────┘   └────┬─────┘   └──────┬──────┘  │
│       │             │              │                 │          │
│       └─────────────┴──────────────┴─────────────────┘          │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     STATE MANAGEMENT LAYER                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Zustand Store                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  State:                                            │  │  │
│  │  │  • students: Student[]                             │  │  │
│  │  │  • searchQuery: string                             │  │  │
│  │  │  • filters: FilterOptions                          │  │  │
│  │  │                                                     │  │  │
│  │  │  Actions:                                          │  │  │
│  │  │  • addStudent(student)                             │  │  │
│  │  │  • updateStudent(id, updates)                      │  │  │
│  │  │  • deleteStudent(id)                               │  │  │
│  │  │  • setSearchQuery(query)                           │  │  │
│  │  │  • filteredStudents()                              │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  Middleware:                                               │  │
│  │  • devtools() - Redux DevTools integration                │  │
│  │  • persist() - localStorage sync                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PERSISTENCE LAYER                           │
│  ┌──────────────────┐        ┌─────────────────┐               │
│  │  Static Data     │        │  localStorage   │               │
│  │  courses.ts      │        │  (Zustand)      │               │
│  └──────────────────┘        └─────────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

## Component Communication Patterns

### Current Pattern (Props Drilling)
```
page.tsx (state)
    │
    ├──> StudentEnrollForm
    │       props: { onSubmit }
    │
    ├──> StudentSummaryTable
    │       props: { data, onEdit }
    │
    └──> StudentEditModal
            props: { open, initialValues, onClose, onUpdate }
```

### Zustand Pattern (Direct Store Access)
```
page.tsx (no state)
    │
    ├──> StudentEnrollForm
    │       useStudentStore(s => s.addStudent)
    │
    ├──> StudentSummaryTable
    │       useStudentStore(s => s.filteredStudents)
    │       useStudentStore(s => s.deleteStudent)
    │
    └──> StudentEditModal
            useStudentStore(s => s.updateStudent)
```

## Data Flow Diagrams

### Current: Form Submission Flow
```
User fills form
     │
     ▼
StudentEnrollForm validates
     │
     ▼
onSubmit(formData) callback
     │
     ▼
page.tsx resolves names
     │
     ▼
setStudents([...students, newStudent])
     │
     ▼
Re-render table
```

### Zustand: Form Submission Flow
```
User fills form
     │
     ▼
StudentEnrollForm validates
     │
     ▼
useStudentStore.addStudent(formData)
     │
     ▼
Zustand updates store + localStorage
     │
     ▼
All subscribers re-render (selective)
```

## State Management Comparison

| Aspect | Current (useState) | Future (Zustand) |
|--------|-------------------|------------------|
| **Lines of Code** | ~50 in page.tsx | ~100 in store, ~10 in components |
| **Persistence** | ❌ None | ✅ localStorage |
| **DevTools** | ❌ None | ✅ Redux DevTools |
| **Testing** | Requires component testing | Can test store in isolation |
| **Scalability** | Limited | High |
| **Performance** | Good for small state | Optimized selectors |
| **Type Safety** | Manual typing | Inferred from store |

## Migration Benefits

### Before Zustand
```typescript
// page.tsx - 150 lines
const [students, setStudents] = useState<Student[]>([])
const [editIndex, setEditIndex] = useState<number | null>(null)

const handleEnroll = (data: FormValues) => {
  const summary = resolveNames(data)
  setStudents((prev) => [...prev, summary])
}

const handleUpdate = (data: FormValues) => {
  const updated = resolveNames(data)
  setStudents((prev) =>
    prev.map((row, i) => (i === editIndex ? updated : row))
  )
}
```

### After Zustand
```typescript
// page.tsx - 50 lines (simplified)
export default function Home() {
  return (
    <div className="container py-5">
      <StudentEnrollForm />
      <StudentSummaryTable />
      <StudentEditModal />
    </div>
  )
}

// stores/studentStore.ts - Centralized logic
export const useStudentStore = create<StudentState>()(
  devtools(persist((set) => ({
    students: [],
    addStudent: (student) => set((state) => ({
      students: [...state.students, {
        ...student,
        id: crypto.randomUUID(),
        enrolledAt: new Date()
      }]
    })),
    // ... other actions
  }), { name: 'students' }))
)
```

## Performance Optimization with Zustand

### Selective Subscriptions
```typescript
// ❌ Bad: Component re-renders on ANY store change
const store = useStudentStore()

// ✅ Good: Only re-renders when students array changes
const students = useStudentStore(state => state.students)

// ✅ Better: Only re-renders when filtered students change
const filteredStudents = useStudentStore(
  state => state.filteredStudents(),
  shallow // Shallow comparison for arrays
)
```

### Computed Values
```typescript
// In store definition
export const useStudentStore = create<StudentState>((set, get) => ({
  students: [],
  searchQuery: '',
  
  // Computed selector
  filteredStudents: () => {
    const { students, searchQuery } = get()
    return students.filter(s => 
      s.firstName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }
}))

// Usage - memoized automatically
const filtered = useStudentStore(state => state.filteredStudents())
```

## Testing Strategy

### Current Testing
```typescript
// Must mock entire component with state
const mockOnSubmit = jest.fn()
render(<StudentEnrollForm onSubmit={mockOnSubmit} />)
```

### Zustand Testing
```typescript
// Test store independently
import { useStudentStore } from './studentStore'

describe('Student Store', () => {
  beforeEach(() => {
    useStudentStore.setState({ students: [] })
  })
  
  it('should add student', () => {
    const { addStudent } = useStudentStore.getState()
    addStudent({ firstName: 'John', ... })
    
    const { students } = useStudentStore.getState()
    expect(students).toHaveLength(1)
    expect(students[0].firstName).toBe('John')
  })
})
```

## File Structure Evolution

### Current
```
src/
├── app/
│   └── page.tsx (150 lines - state + logic)
├── components/
│   ├── forms/
│   ├── tables/
│   └── edit/
```

### With Zustand
```
src/
├── app/
│   └── page.tsx (50 lines - layout only)
├── components/
│   ├── forms/
│   ├── tables/
│   └── edit/
├── stores/
│   ├── studentStore.ts (main store)
│   ├── studentStore.test.ts (store tests)
│   └── types.ts (store types)
└── lib/
    └── utils.ts (shared utilities)
```

## Conclusion

The migration to Zustand represents a strategic improvement that:
- ✅ Simplifies component code
- ✅ Enables persistence
- ✅ Improves testability
- ✅ Scales with feature growth
- ✅ Provides better developer experience
- ✅ Maintains type safety
- ✅ Adds debugging capabilities

Estimated effort: 4-5 hours for full migration with testing.
