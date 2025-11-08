import { useState, useEffect, useCallback } from "react";
import { courses as coursesData } from "../data/courses";

export type Course = {
    id: string;
    title: string;
    description?: string;
    [key: string]: any;
};

type UseFetchCoursesResult = {
    courses: Course[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
};

/**
 * useFetchCourses - simulates fetching courses from data/courses
 * - initialDelay: milliseconds to wait to simulate network latency (default 3000)
 * - returns courses, isLoading, error and refetch function
 */
export default function useFetchCourses(initialDelay = 3000): UseFetchCoursesResult {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [tick, setTick] = useState(0);

    const refetch = useCallback(() => setTick(t => t + 1), []);

    useEffect(() => {
        let mounted = true;
        setIsLoading(true);
        setError(null);

        const fetchData = async () => {
            try {
                // simulate network latency
                await new Promise(resolve => setTimeout(resolve, initialDelay));

                // optional: simulate occasional network error (10% chance)
                if (Math.random() < 0.1) throw new Error("Simulated network error");

                if (!mounted) return;

                // return a fresh copy to mimic a real fetch
                const payload = Array.isArray(coursesData) ? JSON.parse(JSON.stringify(coursesData)) : [];
                setCourses(payload);
            } catch (err) {
                if (!mounted) return;
                setError(err as Error);
                setCourses([]);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        fetchData();

        return () => {
            mounted = false;
        };
    }, [tick, initialDelay]);

    return { courses, isLoading, error, refetch };
}
