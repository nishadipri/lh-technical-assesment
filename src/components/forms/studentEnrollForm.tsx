"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import SelectBox from "react-select";
import useFetchCourses from "../../hooks/fetchCourses";
import { CourseType, SubjectType } from "../../data/courses";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  courseId: string;
  startDate?: string;
  notes?: string;
  subjectIds: string[];
};

type Props = {
  onSubmit?: (data: FormValues) => void;
};

export default function StudentEnrollForm({ onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    control,
    setError,
    clearErrors,
  } = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      courseId: "",
      startDate: "",
      notes: "",
      subjectIds: [],
    },
  });

  const watchedCourseId = watch("courseId");
  const watchedSubjectIds = watch("subjectIds");

  console.log("watchedSubjectIds", watchedSubjectIds);

  const [courses, setCourses] = useState<CourseType[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const {
    courses: fetchedCourses,
    isLoading,
    error: fetchCoursesError,
    refetch,
  } = useFetchCourses(2000);

  let subjects = [];
  const selectedCourse = fetchedCourses.find((c) => c.id === watchedCourseId);
  if (selectedCourse) {
    subjects = selectedCourse.subjects.map((subject: SubjectType) => ({
      value: subject.id,
      label: subject.name,
    }));
  }

  const submit = async (data: FormValues) => {
    console.log("submit:", data);
    // application-level submit handler (default: console.log)
    // TODO: Validate data.subjectIds length is 3.
    // If not, show error message
   if (data.subjectIds.length !== 3) {
      setError("subjectIds", {
        type: "manual",
        message: "Select 3 subjects",
      });
      console.error("Please select exactly 3 subjects.");
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        console.log("Enroll student:", data);
      }
      reset();
    } catch (err) {
      console.error("submit error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <div>
        <label>
          First name
          <input
            {...register("firstName", { required: "First name is required" })}
            type="text"
            placeholder="First name"
          />
        </label>
        {errors.firstName && <div role="alert">{errors.firstName.message}</div>}
      </div>

      <div>
        <label>
          Last name
          <input
            {...register("lastName", { required: "Last name is required" })}
            type="text"
            placeholder="Last name"
          />
        </label>
        {errors.lastName && <div role="alert">{errors.lastName.message}</div>}
      </div>

      <div>
        <label>
          Email
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            type="email"
            placeholder="you@example.com"
          />
        </label>
        {errors.email && <div role="alert">{errors.email.message}</div>}
      </div>

      <div>
        <label>
          Course
          {isLoading ? (
            <div>Loading courses…</div>
          ) : fetchCoursesError ? (
            <div role="alert">{fetchCoursesError.message}</div>
          ) : (
            <select
              {...register("courseId", { required: "Please select a course" })}
            >
              <option value="">-- Select a course --</option>
              {fetchedCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </label>
        {errors.courseId && <div role="alert">{errors.courseId.message}</div>}
      </div>

      <div>
        <label>
          Subjects
          <Controller
            name="subjectIds"
            control={control}
            render={({ field }) => (
              <SelectBox isMulti options={subjects} {...field} />
            )}
          />
        </label>
        {errors.courseId && <div role="alert">{errors.courseId.message}</div>}
      </div>

      <div>
        <label>
          Start date
          <input {...register("startDate")} type="date" />
        </label>
      </div>

      <div>
        <label>
          Notes
          <textarea {...register("notes")} rows={3} />
        </label>
      </div>

      <div>
        <button type="submit" disabled={isSubmitting}>
          Enroll
        </button>
      </div>
    </form>
  );
}
