import { renderHook, waitFor, act } from '@testing-library/react'
import useFetchCourses from './fetchCourses'
import { courses } from '../data/courses'

describe('useFetchCourses', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset random for consistent testing
    jest.spyOn(global.Math, 'random').mockReturnValue(0.5)
  })

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore()
  })

  describe('Successful Data Fetching', () => {
    it('should return courses after delay', async () => {
      const { result } = renderHook(() => useFetchCourses(100))

      // Initially loading
      expect(result.current.isLoading).toBe(true)
      expect(result.current.courses).toEqual([])
      expect(result.current.error).toBeNull()

      // Wait for data to load
      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false)
        },
        { timeout: 200 }
      )

      expect(result.current.courses).toEqual(courses)
      expect(result.current.error).toBeNull()
    })

    it('should use default delay when not provided', async () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.5)
      const { result } = renderHook(() => useFetchCourses())

      expect(result.current.isLoading).toBe(true)

      // Should eventually finish loading (with default 3000ms delay)
      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false)
        },
        { timeout: 4000 }
      )

      expect(result.current.courses).toEqual(courses)
    }, 5000)

    it('should provide refetch function', async () => {
      const { result } = renderHook(() => useFetchCourses(50))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(typeof result.current.refetch).toBe('function')
      expect(result.current.courses).toEqual(courses)
    })
  })

  describe('Error Simulation', () => {
    it('should simulate error when Math.random < 0.1', async () => {
      // Mock random to return value that triggers error (< 0.1)
      jest.spyOn(global.Math, 'random').mockReturnValue(0.05)

      const { result } = renderHook(() => useFetchCourses(100))

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false)
        },
        { timeout: 200 }
      )

      expect(result.current.error).not.toBeNull()
      expect(result.current.error?.message).toBe('Simulated network error')
      expect(result.current.courses).toEqual([])
    })

    it('should not error when Math.random >= 0.1', async () => {
      // Mock random to return value that doesn't trigger error
      jest.spyOn(global.Math, 'random').mockReturnValue(0.2)

      const { result } = renderHook(() => useFetchCourses(100))

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false)
        },
        { timeout: 200 }
      )

      expect(result.current.error).toBeNull()
      expect(result.current.courses).toEqual(courses)
    })
  })

  describe('Refetch Functionality', () => {
    it('should allow refetching data', async () => {
      const { result } = renderHook(() => useFetchCourses(50))

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.courses).toEqual(courses)

      // Trigger refetch wrapped in act
      act(() => {
        result.current.refetch()
      })

      // Wait for refetch to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.courses).toEqual(courses)
    })

    it('should clear error on refetch', async () => {
      // First call returns error
      jest.spyOn(global.Math, 'random').mockReturnValueOnce(0.05)

      const { result } = renderHook(() => useFetchCourses(50))

      await waitFor(() => {
        expect(result.current.error).not.toBeNull()
      })

      // Second call (refetch) succeeds
      jest.spyOn(global.Math, 'random').mockReturnValueOnce(0.5)

      act(() => {
        result.current.refetch()
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toBeNull()
      expect(result.current.courses).toEqual(courses)
    })
  })

  describe('Loading States', () => {
    it('should start with loading state', () => {
      const { result } = renderHook(() => useFetchCourses(1000))

      expect(result.current.isLoading).toBe(true)
      expect(result.current.courses).toEqual([])
      expect(result.current.error).toBeNull()
    })

    it('should set loading to false after completion', async () => {
      const { result } = renderHook(() => useFetchCourses(50))

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should set loading to false even on error', async () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.05)

      const { result } = renderHook(() => useFetchCourses(50))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).not.toBeNull()
    })
  })

  describe('Cleanup', () => {
    it('should handle component unmount during fetch', async () => {
      const { result, unmount } = renderHook(() => useFetchCourses(500))

      expect(result.current.isLoading).toBe(true)

      // Unmount before fetch completes
      unmount()

      // Should not throw error or cause memory leak
      await new Promise((resolve) => setTimeout(resolve, 600))
    })
  })

  describe('Different Delay Values', () => {
    it('should respect custom delay of 0', async () => {
      const { result } = renderHook(() => useFetchCourses(0))

      // With 0 delay, should resolve almost immediately
      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false)
        },
        { timeout: 100 }
      )

      expect(result.current.courses).toEqual(courses)
    })

    it('should handle longer delay', async () => {
      const { result } = renderHook(() => useFetchCourses(200))

      expect(result.current.isLoading).toBe(true)

      // Should still be loading before delay completes
      await new Promise((resolve) => setTimeout(resolve, 100))
      expect(result.current.isLoading).toBe(true)

      // Should be done after delay
      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false)
        },
        { timeout: 300 }
      )

      expect(result.current.courses).toEqual(courses)
    })
  })

  describe('Return Value Structure', () => {
    it('should return object with correct shape', async () => {
      const { result } = renderHook(() => useFetchCourses(50))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current).toHaveProperty('courses')
      expect(result.current).toHaveProperty('isLoading')
      expect(result.current).toHaveProperty('error')
      expect(result.current).toHaveProperty('refetch')

      expect(Array.isArray(result.current.courses)).toBe(true)
      expect(typeof result.current.isLoading).toBe('boolean')
      expect(typeof result.current.refetch).toBe('function')
    })

    it('should return courses array with expected structure', async () => {
      const { result } = renderHook(() => useFetchCourses(50))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.courses.length).toBeGreaterThan(0)
      
      const course = result.current.courses[0]
      expect(course).toHaveProperty('id')
      expect(course).toHaveProperty('name')
      expect(course).toHaveProperty('subjectIds')
    })
  })
})
