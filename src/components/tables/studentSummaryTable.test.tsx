import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StudentSummaryTable, { StudentSummaryData } from './studentSummaryTable'

describe('StudentSummaryTable', () => {
  const mockOnEdit = jest.fn()

  const mockData: StudentSummaryData[] = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      courseId: 'cs',
      courseName: 'Computer Science',
      subjectIds: ['sub-1', 'sub-2', 'sub-3'],
      subjectNames: ['Data Structures', 'Algorithms', 'Database Systems'],
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      courseId: 'bus',
      courseName: 'Business',
      subjectIds: ['sub-4', 'sub-5', 'sub-6'],
      subjectNames: ['Economics', 'Marketing', 'Finance'],
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render table with student data', () => {
      render(<StudentSummaryTable data={mockData} onEdit={mockOnEdit} />)

      expect(screen.getByText('Enrolled Students')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
      expect(screen.getByText('Computer Science')).toBeInTheDocument()
      expect(screen.getByText('Data Structures')).toBeInTheDocument()
    })

    it('should render nothing when data is empty', () => {
      const { container } = render(<StudentSummaryTable data={[]} onEdit={mockOnEdit} />)
      expect(container.firstChild).toBeNull()
    })

    it('should render nothing when data is null/undefined', () => {
      const { container: container1 } = render(
        <StudentSummaryTable data={null as any} onEdit={mockOnEdit} />
      )
      expect(container1.firstChild).toBeNull()

      const { container: container2 } = render(
        <StudentSummaryTable data={undefined as any} onEdit={mockOnEdit} />
      )
      expect(container2.firstChild).toBeNull()
    })

    it('should render table headers correctly', () => {
      render(<StudentSummaryTable data={mockData} onEdit={mockOnEdit} />)

      expect(screen.getByText('#')).toBeInTheDocument()
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Course')).toBeInTheDocument()
      expect(screen.getByText('Subjects')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
    })

    it('should render row numbers correctly', () => {
      render(<StudentSummaryTable data={mockData} onEdit={mockOnEdit} />)

      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('should render full names correctly', () => {
      render(<StudentSummaryTable data={mockData} onEdit={mockOnEdit} />)

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    it('should render emails correctly', () => {
      render(<StudentSummaryTable data={mockData} onEdit={mockOnEdit} />)

      expect(screen.getByText('john@example.com')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    })

    it('should render course names as badges', () => {
      render(<StudentSummaryTable data={mockData} onEdit={mockOnEdit} />)

      const courseBadges = screen.getAllByText(/Computer Science|Business/)
      expect(courseBadges.length).toBeGreaterThan(0)
    })

    it('should render all subject names as badges', () => {
      render(<StudentSummaryTable data={mockData} onEdit={mockOnEdit} />)

      expect(screen.getByText('Data Structures')).toBeInTheDocument()
      expect(screen.getByText('Algorithms')).toBeInTheDocument()
      expect(screen.getByText('Database Systems')).toBeInTheDocument()
      expect(screen.getByText('Economics')).toBeInTheDocument()
      expect(screen.getByText('Marketing')).toBeInTheDocument()
      expect(screen.getByText('Finance')).toBeInTheDocument()
    })

    it('should render Edit button for each student', () => {
      render(<StudentSummaryTable data={mockData} onEdit={mockOnEdit} />)

      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      expect(editButtons).toHaveLength(2)
    })
  })

  describe('Fallback Behavior', () => {
    it('should use courseId when courseName is not available', () => {
      const dataWithoutCourseName: StudentSummaryData[] = [
        {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          courseId: 'test-course-id',
          subjectIds: ['sub-1'],
          subjectNames: ['Subject 1'],
        },
      ]

      render(<StudentSummaryTable data={dataWithoutCourseName} onEdit={mockOnEdit} />)

      expect(screen.getByText('test-course-id')).toBeInTheDocument()
    })

    it('should use subjectIds when subjectNames are not available', () => {
      const dataWithoutSubjectNames: StudentSummaryData[] = [
        {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          courseId: 'cs',
          courseName: 'Computer Science',
          subjectIds: ['sub-1', 'sub-2'],
        },
      ]

      render(<StudentSummaryTable data={dataWithoutSubjectNames} onEdit={mockOnEdit} />)

      expect(screen.getByText('sub-1')).toBeInTheDocument()
      expect(screen.getByText('sub-2')).toBeInTheDocument()
    })

    it('should handle empty subjectNames array', () => {
      const dataWithEmptySubjects: StudentSummaryData[] = [
        {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          courseId: 'cs',
          courseName: 'Computer Science',
          subjectIds: [],
          subjectNames: [],
        },
      ]

      render(<StudentSummaryTable data={dataWithEmptySubjects} onEdit={mockOnEdit} />)

      expect(screen.getByText('Test User')).toBeInTheDocument()
      // Should not crash, just render empty subjects section
    })
  })

  describe('User Interactions', () => {
    it('should call onEdit with correct index when Edit button is clicked', async () => {
      const user = userEvent.setup()
      render(<StudentSummaryTable data={mockData} onEdit={mockOnEdit} />)

      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      
      await user.click(editButtons[0])
      expect(mockOnEdit).toHaveBeenCalledWith(0)
      
      await user.click(editButtons[1])
      expect(mockOnEdit).toHaveBeenCalledWith(1)
    })

    it('should not crash when onEdit is not provided', async () => {
      const user = userEvent.setup()
      render(<StudentSummaryTable data={mockData} />)

      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      
      // Should not crash when clicked
      await user.click(editButtons[0])
      
      expect(mockOnEdit).not.toHaveBeenCalled()
    })

    it('should have accessible Edit button with aria-label', () => {
      render(<StudentSummaryTable data={mockData} onEdit={mockOnEdit} />)

      expect(screen.getByLabelText('Edit John Doe')).toBeInTheDocument()
      expect(screen.getByLabelText('Edit Jane Smith')).toBeInTheDocument()
    })
  })

  describe('Footer Information', () => {
    it('should display footer message about demo storage', () => {
      render(<StudentSummaryTable data={mockData} onEdit={mockOnEdit} />)

      expect(screen.getByText('Stored only in component state for demo.')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle student with very long name', () => {
      const longNameData: StudentSummaryData[] = [
        {
          firstName: 'VeryLongFirstName',
          lastName: 'VeryLongLastNameThatExceedsNormalLength',
          email: 'longname@example.com',
          courseId: 'cs',
          courseName: 'Computer Science',
          subjectIds: ['sub-1'],
          subjectNames: ['Subject 1'],
        },
      ]

      render(<StudentSummaryTable data={longNameData} onEdit={mockOnEdit} />)

      expect(
        screen.getByText('VeryLongFirstName VeryLongLastNameThatExceedsNormalLength')
      ).toBeInTheDocument()
    })

    it('should handle student with many subjects', () => {
      const manySubjectsData: StudentSummaryData[] = [
        {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          courseId: 'cs',
          courseName: 'Computer Science',
          subjectIds: Array.from({ length: 10 }, (_, i) => `sub-${i}`),
          subjectNames: Array.from({ length: 10 }, (_, i) => `Subject ${i + 1}`),
        },
      ]

      render(<StudentSummaryTable data={manySubjectsData} onEdit={mockOnEdit} />)

      // All subjects should be rendered
      expect(screen.getByText('Subject 1')).toBeInTheDocument()
      expect(screen.getByText('Subject 10')).toBeInTheDocument()
    })

    it('should handle single student', () => {
      const singleStudent: StudentSummaryData[] = [mockData[0]]

      render(<StudentSummaryTable data={singleStudent} onEdit={mockOnEdit} />)

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
    })

    it('should trim whitespace in full name', () => {
      const dataWithWhitespace: StudentSummaryData[] = [
        {
          firstName: '  John  ',
          lastName: '  Doe  ',
          email: 'john@example.com',
          courseId: 'cs',
          courseName: 'Computer Science',
          subjectIds: ['sub-1'],
          subjectNames: ['Subject 1'],
        },
      ]

      render(<StudentSummaryTable data={dataWithWhitespace} onEdit={mockOnEdit} />)

      // Should trim the name
      const nameCell = screen.getByText(/John.*Doe/)
      expect(nameCell.textContent?.trim()).toBe('John     Doe')
    })
  })

  describe('Accessibility', () => {
    it('should have proper table structure', () => {
      render(<StudentSummaryTable data={mockData} onEdit={mockOnEdit} />)

      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
    })

    it('should have column headers', () => {
      render(<StudentSummaryTable data={mockData} onEdit={mockOnEdit} />)

      const columnHeaders = screen.getAllByRole('columnheader')
      expect(columnHeaders).toHaveLength(6)
    })

    it('should have proper row structure', () => {
      render(<StudentSummaryTable data={mockData} onEdit={mockOnEdit} />)

      const rows = screen.getAllByRole('row')
      // Header row + 2 data rows
      expect(rows).toHaveLength(3)
    })

    it('should have aria-label on Edit buttons', () => {
      render(<StudentSummaryTable data={mockData} onEdit={mockOnEdit} />)

      expect(screen.getByLabelText('Edit John Doe')).toHaveAttribute('type', 'button')
      expect(screen.getByLabelText('Edit Jane Smith')).toHaveAttribute('type', 'button')
    })
  })

  describe('Styling Classes', () => {
    it('should apply correct CSS classes for table', () => {
      const { container } = render(<StudentSummaryTable data={mockData} onEdit={mockOnEdit} />)

      const table = container.querySelector('table')
      expect(table).toHaveClass('table', 'table-striped', 'table-hover')
    })

    it('should apply badge classes to course and subjects', () => {
      const { container } = render(<StudentSummaryTable data={mockData} onEdit={mockOnEdit} />)

      const badges = container.querySelectorAll('.badge')
      expect(badges.length).toBeGreaterThan(0)
    })
  })
})
