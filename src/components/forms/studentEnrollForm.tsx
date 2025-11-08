"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import dynamic from "next/dynamic";
const SelectBox = dynamic(() => import("react-select"), { ssr: false });
import useFetchCourses from "../../hooks/fetchCourses";
import { CourseType, SubjectType } from "../../data/courses";


type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  courseId: string;
 
 
  subjectIds: string[]; // we will store just the ids here
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
    // If you want real-time disabling based on validity, uncomment:
    // mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      courseId: "",
      
     
      subjectIds: [],
    },
  });

  const watchedCourseId = watch("courseId");
  const watchedSubjectIds = watch("subjectIds");

  const {
    courses: fetchedCourses,
    isLoading,
    error: fetchCoursesError,
  } = useFetchCourses(2000);

  // Build subject options from selected course
  const selectedCourse = fetchedCourses.find((c) => c.id === watchedCourseId);
  const subjects =
    selectedCourse?.subjects.map((subject: SubjectType) => ({
      value: subject.id,
      label: subject.name,
    })) || [];

  const submit = async (data: FormValues) => {
    // Final safeguard (in case user bypasses UI somehow)
    if (data.subjectIds.length < 3) {
      setError("subjectIds", {
        type: "manual",
        message: "You should select at least 3 subjects",
      });
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
            rules={{
              validate: (value) =>
                (Array.isArray(value) && value.length >= 3) ||
                "You should select at least 3 subjects",
            }}
            render={({ field: { onChange, value, ref } }) => {
              // value is string[] (ids). Map it to the option objects for react-select
              const selectedOptions = subjects.filter((opt: any) =>
                value?.includes(opt.value)
              );
              return (
                <SelectBox
                  ref={ref}
                  isMulti
                  options={subjects}
                  value={selectedOptions}
                  onChange={(selected) => {
                    const nextValues = (selected || []).map(
                      (s: any) => s.value
                    );
                    onChange(nextValues);

                    if (nextValues.length < 3) {
                      setError("subjectIds", {
                        type: "validate",
                        message: "You should select at least 3 subjects",
                      });
                    } else {
                      clearErrors("subjectIds");
                    }
                  }}
                  placeholder="Select at least 3 subjects"
                />
              );
            }}
          />
        </label>
        {errors.subjectIds && (
          <div role="alert" style={{ color: "crimson" }}>
            {errors.subjectIds.message}
          </div>
        )}
        <small>
          Currently selected: {watchedSubjectIds?.length || 0} (need 3 or more)
        </small>
      </div>

     

      

      <div>
        <button type="submit" disabled={isSubmitting}>
          Enroll
        </button>
      </div>
    </form>
  );
}
