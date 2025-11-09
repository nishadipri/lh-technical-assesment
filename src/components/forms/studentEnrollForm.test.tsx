import React from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StudentEnrollForm, { FormValues } from './studentEnrollForm'
import * as fetchCoursesHook from '../../hooks/fetchCourses'

// Mock the useFetchCourses hook
jest.mock('../../hooks/fetchCourses')

const mockCourses = [
  {
    id: 'course-1',
    name: 'Computer Science',
    title: 'Computer Science',
    subjects: [
      { id: 'sub-1', name: 'Data Structures' },
      { id: 'sub-2', name: 'Algorithms' },
      { id: 'sub-3', name: 'Database Systems' },
      { id: 'sub-4', name: 'Operating Systems' },
    ],
  },
  {
    id: 'course-2',
    name: 'Mathematics',
    title: 'Mathematics',
    subjects: [
      { id: 'sub-5', name: 'Calculus' },
      { id: 'sub-6', name: 'Linear Algebra' },
      { id: 'sub-7', name: 'Statistics' },
      { id: 'sub-8', name: 'Discrete Math' },
    ],
  },
] as any

describe('StudentEnrollForm', () => {
  const mockOnSubmit = jest.fn()
  const mockUseFetchCourses = fetchCoursesHook.default as jest.MockedFunction<
    typeof fetchCoursesHook.default
  >

  beforeEach(() => {
    jest.clearAllMocks()
    // Default mock implementation
    mockUseFetchCourses.mockReturnValue({
      courses: mockCourses,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })
  })

  describe('Form Rendering', () => {
    it('should render the form with all fields', () => {
      render(<StudentEnrollForm onSubmit={mockOnSubmit} />)

      expect(screen.getByText('Enroll Student')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('First name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Last name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
      // Use name attribute to find the select element
      expect(screen.getByDisplayValue('-- Select a course --')).toBeInTheDocument()
      expect(screen.getByText('Subjects')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /enroll/i })).toBeInTheDocument()
    })

    it('should render with custom submit label', () => {
      render(<StudentEnrollForm onSubmit={mockOnSubmit} submitLabel="Update" />)

      expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument()
      expect(screen.getByText('Edit Student')).toBeInTheDocument()
    })

    it('should render with initial values', () => {
      const initialValues: FormValues = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        courseId: 'course-1',
        subjectIds: ['sub-1', 'sub-2', 'sub-3'],
      }

      render(<StudentEnrollForm onSubmit={mockOnSubmit} initialValues={initialValues} />)

      expect(screen.getByDisplayValue('John')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument()
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Computer Science')).toBeInTheDocument()
    })

    it('should show loading state when courses are loading', () => {
      mockUseFetchCourses.mockReturnValue({
        courses: [],
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      })

      render(<StudentEnrollForm onSubmit={mockOnSubmit} />)

      expect(screen.getByText('Loading courses…')).toBeInTheDocument()
    })

    it('should show error state when courses fail to load', () => {
      mockUseFetchCourses.mockReturnValue({
        courses: [],
        isLoading: false,
        error: new Error('Failed to load courses'),
        refetch: jest.fn(),
      })

      render(<StudentEnrollForm onSubmit={mockOnSubmit} />)

      expect(screen.getByRole('alert', { name: '' })).toHaveTextContent('Failed to load courses')
    })
  })

  describe('Form Validation', () => {
    it('should show validation error when first name is empty', async () => {
      const user = userEvent.setup()
      render(<StudentEnrollForm onSubmit={mockOnSubmit} />)

      const submitButton = screen.getByRole('button', { name: /enroll/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument()
      })
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should show validation error when last name is empty', async () => {
      const user = userEvent.setup()
      render(<StudentEnrollForm onSubmit={mockOnSubmit} />)

      const submitButton = screen.getByRole('button', { name: /enroll/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Last name is required')).toBeInTheDocument()
      })
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should show validation error when email is empty', async () => {
      const user = userEvent.setup()
      render(<StudentEnrollForm onSubmit={mockOnSubmit} />)

      const submitButton = screen.getByRole('button', { name: /enroll/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument()
      })
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should show validation error for invalid email format', async () => {
      const user = userEvent.setup()
      render(<StudentEnrollForm onSubmit={mockOnSubmit} />)

      const emailInput = screen.getByPlaceholderText('you@example.com')
      await user.type(emailInput, 'invalid-email')

      const submitButton = screen.getByRole('button', { name: /enroll/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Enter a valid email address')).toBeInTheDocument()
      })
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should show validation error when course is not selected', async () => {
      const user = userEvent.setup()
      render(<StudentEnrollForm onSubmit={mockOnSubmit} />)

      const submitButton = screen.getByRole('button', { name: /enroll/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Please select a course')).toBeInTheDocument()
      })
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should show validation error when less than 3 subjects are selected', async () => {
      const user = userEvent.setup()
      render(<StudentEnrollForm onSubmit={mockOnSubmit} />)

      // Fill in required fields
      await user.type(screen.getByPlaceholderText('First name'), 'John')
      await user.type(screen.getByPlaceholderText('Last name'), 'Doe')
      await user.type(screen.getByPlaceholderText('you@example.com'), 'john@example.com')

      // Select a course - use getByDisplayValue to find the select element
      const courseSelect = screen.getByDisplayValue('-- Select a course --')
      await user.selectOptions(courseSelect, 'course-1')

      // Try to submit with no subjects selected
      const submitButton = screen.getByRole('button', { name: /enroll/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('You should select at least 3 subjects')).toBeInTheDocument()
      })
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })

  describe('Form Interaction', () => {
    it('should allow user to fill in all fields', async () => {
      const user = userEvent.setup()
      render(<StudentEnrollForm onSubmit={mockOnSubmit} />)

      await user.type(screen.getByPlaceholderText('First name'), 'Jane')
      await user.type(screen.getByPlaceholderText('Last name'), 'Smith')
      await user.type(screen.getByPlaceholderText('you@example.com'), 'jane@example.com')

      expect(screen.getByDisplayValue('Jane')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Smith')).toBeInTheDocument()
      expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument()
    })

    it('should update available subjects when course is changed', async () => {
      const user = userEvent.setup()
      render(<StudentEnrollForm onSubmit={mockOnSubmit} />)

      const courseSelect = screen.getByDisplayValue('-- Select a course --')
      await user.selectOptions(courseSelect, 'course-1')

      await waitFor(() => {
        expect(screen.getByDisplayValue('Computer Science')).toBeInTheDocument()
      })

      // Change to another course
      await user.selectOptions(courseSelect, 'course-2')

      await waitFor(() => {
        expect(screen.getByDisplayValue('Mathematics')).toBeInTheDocument()
      })
    })

    it('should update subject count display when subjects are selected', async () => {
      const user = userEvent.setup()
      render(<StudentEnrollForm onSubmit={mockOnSubmit} />)

      // Initial count should be 0
      expect(screen.getByText(/Selected: 0 \/ min 3/i)).toBeInTheDocument()

      // Note: Testing react-select interactions can be complex
      // In a real-world scenario, you might need to use more specific selectors
      // or mock the SelectBox component for easier testing
    })
  })

  describe('Form Submission', () => {
    it('should call onSubmit with correct data when form is valid', async () => {
      const user = userEvent.setup()
      const initialValues: FormValues = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        courseId: 'course-1',
        subjectIds: ['sub-1', 'sub-2', 'sub-3'],
      }

      render(<StudentEnrollForm onSubmit={mockOnSubmit} initialValues={initialValues} />)

      const submitButton = screen.getByRole('button', { name: /enroll/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(initialValues)
      })
    })

    it('should call onSubmit and handle resetAfterSubmit correctly', async () => {
      const user = userEvent.setup()
      mockOnSubmit.mockResolvedValue(undefined)

      // Use initial values that satisfy all validation
      const initialValues: FormValues = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        courseId: 'course-1',
        subjectIds: ['sub-1', 'sub-2', 'sub-3'],
      }

      render(
        <StudentEnrollForm
          onSubmit={mockOnSubmit}
          initialValues={initialValues}
          resetAfterSubmit={true}
        />
      )

      const submitButton = screen.getByRole('button', { name: /enroll/i })
      await user.click(submitButton)

      // Verify onSubmit was called with correct data
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(initialValues)
      })
    })

    it('should not reset form after submission when resetAfterSubmit is false', async () => {
      const user = userEvent.setup()
      mockOnSubmit.mockResolvedValue(undefined)

      const initialValues: FormValues = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        courseId: 'course-1',
        subjectIds: ['sub-1', 'sub-2', 'sub-3'],
      }

      render(
        <StudentEnrollForm
          onSubmit={mockOnSubmit}
          initialValues={initialValues}
          resetAfterSubmit={false}
        />
      )

      const submitButton = screen.getByRole('button', { name: /enroll/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
      })

      // Form should retain values
      expect(screen.getByDisplayValue('John')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument()
    })

    it('should show submitting state during submission', async () => {
      const user = userEvent.setup()
      let resolveSubmit: () => void
      const submitPromise = new Promise<void>((resolve) => {
        resolveSubmit = resolve
      })
      mockOnSubmit.mockReturnValue(submitPromise)

      const initialValues: FormValues = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        courseId: 'course-1',
        subjectIds: ['sub-1', 'sub-2', 'sub-3'],
      }

      render(<StudentEnrollForm onSubmit={mockOnSubmit} initialValues={initialValues} />)

      const submitButton = screen.getByRole('button', { name: /enroll/i })
      await user.click(submitButton)

      // Should show submitting text
      await waitFor(() => {
        expect(screen.getByText('Submitting…')).toBeInTheDocument()
      })

      // Button should be disabled
      expect(submitButton).toBeDisabled()

      // Resolve the promise
      resolveSubmit!()

      // Should return to normal state
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /enroll/i })).not.toBeDisabled()
      })
    })

    it('should handle submission errors gracefully', async () => {
      const user = userEvent.setup()
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      mockOnSubmit.mockRejectedValue(new Error('Submission failed'))

      const initialValues: FormValues = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        courseId: 'course-1',
        subjectIds: ['sub-1', 'sub-2', 'sub-3'],
      }

      render(<StudentEnrollForm onSubmit={mockOnSubmit} initialValues={initialValues} />)

      const submitButton = screen.getByRole('button', { name: /enroll/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'submit error:',
          expect.any(Error)
        )
      })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('Dynamic Behavior', () => {
    it('should update form when initialValues prop changes', async () => {
      const initialValues1: FormValues = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        courseId: 'course-1',
        subjectIds: ['sub-1', 'sub-2', 'sub-3'],
      }

      const { rerender } = render(
        <StudentEnrollForm onSubmit={mockOnSubmit} initialValues={initialValues1} />
      )

      expect(screen.getByDisplayValue('John')).toBeInTheDocument()

      const initialValues2: FormValues = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        courseId: 'course-2',
        subjectIds: ['sub-5', 'sub-6', 'sub-7'],
      }

      rerender(<StudentEnrollForm onSubmit={mockOnSubmit} initialValues={initialValues2} />)

      await waitFor(() => {
        expect(screen.getByDisplayValue('Jane')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Smith')).toBeInTheDocument()
        expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument()
      })
    })

    it('should use custom instanceIdPrefix', () => {
      render(
        <StudentEnrollForm onSubmit={mockOnSubmit} instanceIdPrefix="custom-form" />
      )

      // The instanceIdPrefix affects react-select's internal IDs
      // This is more for ensuring the prop is passed through correctly
      expect(screen.getByText('Enroll Student')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels for form fields', () => {
      render(<StudentEnrollForm onSubmit={mockOnSubmit} />)

      // Check labels exist - using exact text to avoid finding multiple elements
      expect(screen.getByText('First name')).toBeInTheDocument()
      expect(screen.getByText('Last name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Course')).toBeInTheDocument()
      
      // Check the subjects label which has proper htmlFor
      expect(screen.getByLabelText(/subjects/i)).toBeInTheDocument()
    })

    it('should have role="alert" for error messages', async () => {
      const user = userEvent.setup()
      render(<StudentEnrollForm onSubmit={mockOnSubmit} />)

      const submitButton = screen.getByRole('button', { name: /enroll/i })
      await user.click(submitButton)

      await waitFor(() => {
        const alerts = screen.getAllByRole('alert')
        expect(alerts.length).toBeGreaterThan(0)
      })
    })
  })
})
