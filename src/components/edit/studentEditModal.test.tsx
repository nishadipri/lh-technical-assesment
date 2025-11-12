import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StudentEditModal from './studentEditModal'
import { FormValues } from '../forms/studentEnrollForm'
import * as fetchCoursesHook from '../../hooks/fetchCourses'

// Mock the hooks and data modules
jest.mock('../../hooks/fetchCourses')
jest.mock('../../data/courses', () => ({
  getSubjectsForCourse: (courseId: string) => {
    const subjectMap: Record<string, any[]> = {
      'course-1': [
        { id: 'sub-1', name: 'Data Structures' },
        { id: 'sub-2', name: 'Algorithms' },
        { id: 'sub-3', name: 'Database Systems' },
        { id: 'sub-4', name: 'Operating Systems' },
      ],
    }
    return subjectMap[courseId] || []
  },
}))

const mockCourses = [
  {
    id: 'course-1',
    name: 'Computer Science',
    subjectIds: ['sub-1', 'sub-2', 'sub-3', 'sub-4'],
  },
]

describe('StudentEditModal', () => {
  const mockOnClose = jest.fn()
  const mockOnUpdate = jest.fn()
  const mockUseFetchCourses = fetchCoursesHook.default as jest.MockedFunction<
    typeof fetchCoursesHook.default
  >

  const mockInitialValues: FormValues = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    courseId: 'course-1',
    subjectIds: ['sub-1', 'sub-2', 'sub-3'],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseFetchCourses.mockReturnValue({
      courses: mockCourses,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })
  })

  describe('Rendering', () => {
    it('should render modal when open is true', () => {
      render(
        <StudentEditModal
          open={true}
          initialValues={mockInitialValues}
          onClose={mockOnClose}
          onUpdate={mockOnUpdate}
        />
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getAllByText('Edit Student').length).toBeGreaterThan(0)
    })

    it('should not render modal when open is false', () => {
      render(
        <StudentEditModal
          open={false}
          initialValues={mockInitialValues}
          onClose={mockOnClose}
          onUpdate={mockOnUpdate}
        />
      )

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should render close button', () => {
      render(
        <StudentEditModal
          open={true}
          initialValues={mockInitialValues}
          onClose={mockOnClose}
          onUpdate={mockOnUpdate}
        />
      )

      expect(screen.getByLabelText('Close')).toBeInTheDocument()
    })

    it('should render form with initial values', () => {
      render(
        <StudentEditModal
          open={true}
          initialValues={mockInitialValues}
          onClose={mockOnClose}
          onUpdate={mockOnUpdate}
        />
      )

      expect(screen.getByDisplayValue('John')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument()
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
    })

    it('should render Update button instead of Enroll', () => {
      render(
        <StudentEditModal
          open={true}
          initialValues={mockInitialValues}
          onClose={mockOnClose}
          onUpdate={mockOnUpdate}
        />
      )

      expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /enroll/i })).not.toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <StudentEditModal
          open={true}
          initialValues={mockInitialValues}
          onClose={mockOnClose}
          onUpdate={mockOnUpdate}
        />
      )

      const closeButton = screen.getByLabelText('Close')
      await user.click(closeButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should call onUpdate and onClose when form is submitted successfully', async () => {
      const user = userEvent.setup()
      mockOnUpdate.mockResolvedValue(undefined)

      render(
        <StudentEditModal
          open={true}
          initialValues={mockInitialValues}
          onClose={mockOnClose}
          onUpdate={mockOnUpdate}
        />
      )

      const updateButton = screen.getByRole('button', { name: /update/i })
      await user.click(updateButton)

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(mockInitialValues)
      })

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1)
      })
    })

    it('should allow editing form fields', async () => {
      const user = userEvent.setup()
      render(
        <StudentEditModal
          open={true}
          initialValues={mockInitialValues}
          onClose={mockOnClose}
          onUpdate={mockOnUpdate}
        />
      )

      const firstNameInput = screen.getByDisplayValue('John')
      await user.clear(firstNameInput)
      await user.type(firstNameInput, 'Jane')

      expect(screen.getByDisplayValue('Jane')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('should use custom instanceIdPrefix', () => {
      render(
        <StudentEditModal
          open={true}
          initialValues={mockInitialValues}
          onClose={mockOnClose}
          onUpdate={mockOnUpdate}
          instanceIdPrefix="custom-edit"
        />
      )

      expect(screen.getAllByText('Edit Student').length).toBeGreaterThan(0)
    })

    it('should use default instanceIdPrefix when not provided', () => {
      render(
        <StudentEditModal
          open={true}
          initialValues={mockInitialValues}
          onClose={mockOnClose}
          onUpdate={mockOnUpdate}
        />
      )

      expect(screen.getAllByText('Edit Student').length).toBeGreaterThan(0)
    })
  })

  describe('Form Behavior', () => {
    it('should pass resetAfterSubmit=false to the form', async () => {
      const user = userEvent.setup()
      mockOnUpdate.mockResolvedValue(undefined)

      render(
        <StudentEditModal
          open={true}
          initialValues={mockInitialValues}
          onClose={mockOnClose}
          onUpdate={mockOnUpdate}
        />
      )

      const updateButton = screen.getByRole('button', { name: /update/i })
      await user.click(updateButton)

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalled()
      })

      // Form should retain values (not reset)
      expect(screen.getByDisplayValue('John')).toBeInTheDocument()
    })

    it('should handle form validation errors', async () => {
      const user = userEvent.setup()
      render(
        <StudentEditModal
          open={true}
          initialValues={mockInitialValues}
          onClose={mockOnClose}
          onUpdate={mockOnUpdate}
        />
      )

      // Clear required field
      const firstNameInput = screen.getByDisplayValue('John')
      await user.clear(firstNameInput)

      const updateButton = screen.getByRole('button', { name: /update/i })
      await user.click(updateButton)

      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument()
      })

      expect(mockOnUpdate).not.toHaveBeenCalled()
      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <StudentEditModal
          open={true}
          initialValues={mockInitialValues}
          onClose={mockOnClose}
          onUpdate={mockOnUpdate}
        />
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-labelledby', 'edit-student-title')
    })

    it('should have proper heading structure', () => {
      render(
        <StudentEditModal
          open={true}
          initialValues={mockInitialValues}
          onClose={mockOnClose}
          onUpdate={mockOnUpdate}
        />
      )

      const heading = screen.getAllByRole('heading', { name: 'Edit Student' })[0]
      expect(heading).toHaveAttribute('id', 'edit-student-title')
    })

    it('should have accessible close button', () => {
      render(
        <StudentEditModal
          open={true}
          initialValues={mockInitialValues}
          onClose={mockOnClose}
          onUpdate={mockOnUpdate}
        />
      )

      const closeButton = screen.getByLabelText('Close')
      expect(closeButton).toHaveAttribute('type', 'button')
    })
  })

  describe('Styling', () => {
    it('should apply backdrop styles', () => {
      render(
        <StudentEditModal
          open={true}
          initialValues={mockInitialValues}
          onClose={mockOnClose}
          onUpdate={mockOnUpdate}
        />
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveStyle({ zIndex: 1050 })
    })

    it('should have proper modal content styling', () => {
      const { container } = render(
        <StudentEditModal
          open={true}
          initialValues={mockInitialValues}
          onClose={mockOnClose}
          onUpdate={mockOnUpdate}
        />
      )

      const modalContent = container.querySelector('.bg-white.rounded-3')
      expect(modalContent).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should handle onUpdate rejection without crashing', async () => {
      const user = userEvent.setup()
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      mockOnUpdate.mockRejectedValue(new Error('Update failed'))

      render(
        <StudentEditModal
          open={true}
          initialValues={mockInitialValues}
          onClose={mockOnClose}
          onUpdate={mockOnUpdate}
        />
      )

      const updateButton = screen.getByRole('button', { name: /update/i })
      await user.click(updateButton)

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalled()
      })

      // Modal should still be open on error
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      consoleErrorSpy.mockRestore()
    })
  })

  describe('State Changes', () => {
    it('should update when initialValues prop changes', () => {
      const { rerender } = render(
        <StudentEditModal
          open={true}
          initialValues={mockInitialValues}
          onClose={mockOnClose}
          onUpdate={mockOnUpdate}
        />
      )

      expect(screen.getByDisplayValue('John')).toBeInTheDocument()

      const newValues: FormValues = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        courseId: 'course-1',
        subjectIds: ['sub-1', 'sub-2', 'sub-3'],
      }

      rerender(
        <StudentEditModal
          open={true}
          initialValues={newValues}
          onClose={mockOnClose}
          onUpdate={mockOnUpdate}
        />
      )

      expect(screen.getByDisplayValue('Jane')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Smith')).toBeInTheDocument()
    })

    it('should close modal when open prop changes to false', () => {
      const { rerender } = render(
        <StudentEditModal
          open={true}
          initialValues={mockInitialValues}
          onClose={mockOnClose}
          onUpdate={mockOnUpdate}
        />
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()

      rerender(
        <StudentEditModal
          open={false}
          initialValues={mockInitialValues}
          onClose={mockOnClose}
          onUpdate={mockOnUpdate}
        />
      )

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})
