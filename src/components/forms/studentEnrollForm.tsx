"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import SelectBox from "react-select";
import useFetchCourses from "../../hooks/fetchCourses";
import { CourseType, SubjectType } from "../../data/courses";

export type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  courseId: string;
 
  subjectIds: string[];
};

type Props = {
  onSubmit?: (data: FormValues) => void | Promise<void>;
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

  const subjectSelectInstanceId = "enroll-subject-select";
  const subjectSelectInputId = "enroll-subject-select-input";

  return (
    <div className="card shadow-sm">
      <div className="card-body p-4">
        <h1 className="h4 mb-4">Enroll Student</h1>

        <form onSubmit={handleSubmit(submit)} noValidate>
          {/* First Name */}
          <div className="mb-3">
            <label className="form-label">First name</label>
            <input
              {...register("firstName", { required: "First name is required" })}
              type="text"
              placeholder="First name"
              className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
            />
            {errors.firstName && (
              <div role="alert" className="invalid-feedback d-block">
                {errors.firstName.message}
              </div>
            )}
          </div>

          {/* Last Name */}
          <div className="mb-3">
            <label className="form-label">Last name</label>
            <input
              {...register("lastName", { required: "Last name is required" })}
              type="text"
              placeholder="Last name"
              className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
            />
            {errors.lastName && (
              <div role="alert" className="invalid-feedback d-block">
                {errors.lastName.message}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
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
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
            />
            {errors.email && (
              <div role="alert" className="invalid-feedback d-block">
                {errors.email.message}
              </div>
            )}
          </div>

          {/* Course */}
          <div className="mb-3">
            <label className="form-label">Course</label>
            {isLoading ? (
              <div className="form-text">Loading courses…</div>
            ) : fetchCoursesError ? (
              <div role="alert" className="text-danger">
                {fetchCoursesError.message}
              </div>
            ) : (
              <select
                {...register("courseId", { required: "Please select a course" })}
                className={`form-select ${errors.courseId ? "is-invalid" : ""}`}
              >
                <option value="">-- Select a course --</option>
                {fetchedCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
            {errors.courseId && (
              <div role="alert" className="invalid-feedback d-block">
                {errors.courseId.message}
              </div>
            )}
          </div>

          {/* Subjects */}
          <div className="mb-3">
            <label htmlFor={subjectSelectInputId} className="form-label">
              Subjects
            </label>
            <Controller
              name="subjectIds"
              control={control}
              rules={{
                validate: (value) =>
                  (Array.isArray(value) && value.length >= 3) ||
                  "You should select at least 3 subjects",
              }}
              render={({ field: { onChange, value, ref } }) => {
                const selectedOptions = subjects.filter((opt: any) =>
                  value?.includes(opt.value)
                );
                return (
                  <SelectBox
                    instanceId={subjectSelectInstanceId}
                    inputId={subjectSelectInputId}
                    inputRef={ref as any}
                    className="rs-container"
                    classNamePrefix="rs"
                    isMulti
                    options={subjects}
                    value={selectedOptions}
                    onChange={(selected: any) => {
                      const nextValues = (selected || []).map((s: any) => s.value);
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
            {errors.subjectIds && (
              <div role="alert" className="text-danger mt-1">
                {errors.subjectIds.message}
              </div>
            )}
            <small className="form-text text-muted">
              Currently selected: {watchedSubjectIds?.length || 0} (need 3 or more)
            </small>
          </div>
          {/* Submit */}
          <div className="d-flex justify-content-end">
            <button type="submit" disabled={isSubmitting} className="btn btn-primary px-4">
              Enroll
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}