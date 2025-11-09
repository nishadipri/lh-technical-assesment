"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import SelectBox from "react-select";
import useFetchCourses from "../../hooks/fetchCourses";
import { getSubjectsForCourse } from "../../data/courses";

export type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  courseId: string;
  subjectIds: string[];
};

type Props = {
  onSubmit: (data: FormValues) => void | Promise<void>;
  // Reuse props for both Create (Enroll) and Edit flows
  initialValues?: FormValues;
  submitLabel?: string; // defaults to "Enroll"
  instanceIdPrefix?: string; // defaults to "enroll"
  resetAfterSubmit?: boolean; // defaults to true (set to false for edit)
};

export default function StudentEnrollForm({
  onSubmit,
  initialValues,
  submitLabel = "Enroll",
  instanceIdPrefix = "enroll",
  resetAfterSubmit = true,
}: Props) {
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
    defaultValues: initialValues ?? {
      firstName: "",
      lastName: "",
      email: "",
      courseId: "",

      subjectIds: [],
    },
  });

  // Keep form in sync when initialValues change (e.g., opening Edit modal)
  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  const watchedCourseId = watch("courseId");
  const watchedSubjectIds = watch("subjectIds");

  const {
    courses: fetchedCourses,
    isLoading,
    error: fetchCoursesError,
  } = useFetchCourses(2000);

  // Build subject options from selected course using the helper function
  const subjects = getSubjectsForCourse(watchedCourseId).map((subject) => ({
    value: subject.id,
    label: subject.name,
  }));

  const submit = async (data: FormValues) => {
    // Validation as requested previously
    if (!Array.isArray(data.subjectIds) || data.subjectIds.length < 3) {
      setError("subjectIds", {
        type: "manual",
        message: "You should select at least 3 subjects",
      });
      return;
    }

    try {
      await onSubmit(data);
      if (resetAfterSubmit) reset();
    } catch (err) {
      console.error("submit error:", err);
      // Display email uniqueness error
      if (err instanceof Error && err.message.includes("already enrolled")) {
        setError("email", {
          type: "manual",
          message: err.message,
        });
      }
    }
  };

  // Stable IDs for react-select to avoid hydration mismatch
  const subjectSelectInstanceId = `${instanceIdPrefix}-subject-select`;
  const subjectSelectInputId = `${instanceIdPrefix}-subject-select-input`;

  return (
    <div className="card shadow-sm border-0 rounded-3 overflow-hidden mb-5 transition-all hover:shadow-lg">
      <div className="card-header bg-gradient bg-primary text-white py-3">
        <h1 className="h5 mb-0 tracking-wide">
          {submitLabel === "Enroll" ? "Enroll Student" : "Edit Student"}
        </h1>
      </div>
      <div className="card-body p-4 bg-light">
        <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
          {/* First Name */}
          <div>
            <label className="form-label fw-semibold text-secondary">
              First name
            </label>
            <input
              {...register("firstName", { required: "First name is required" })}
              type="text"
              placeholder="First name"
              className={`form-control rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.firstName ? "is-invalid border-danger" : ""
              }`}
            />
            {errors.firstName && (
              <div role="alert" className="invalid-feedback d-block text-sm">
                {errors.firstName.message}
              </div>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="form-label fw-semibold text-secondary">
              Last name
            </label>
            <input
              {...register("lastName", { required: "Last name is required" })}
              type="text"
              placeholder="Last name"
              className={`form-control rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.lastName ? "is-invalid border-danger" : ""
              }`}
            />
            {errors.lastName && (
              <div role="alert" className="invalid-feedback d-block text-sm">
                {errors.lastName.message}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="form-label fw-semibold text-secondary">
              Email
            </label>
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
              className={`form-control rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.email ? "is-invalid border-danger" : ""
              }`}
            />
            {errors.email && (
              <div role="alert" className="invalid-feedback d-block text-sm">
                {errors.email.message}
              </div>
            )}
          </div>

          {/* Course */}
          <div>
            <label className="form-label fw-semibold text-secondary">
              Course
            </label>
            {isLoading ? (
              <div className="form-text">Loading courses…</div>
            ) : fetchCoursesError ? (
              <div role="alert" className="text-danger">
                {fetchCoursesError.message}
              </div>
            ) : (
              <select
                {...register("courseId", {
                  required: "Please select a course",
                })}
                className={`form-select rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.courseId ? "is-invalid border-danger" : ""
                }`}
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
              <div role="alert" className="invalid-feedback d-block text-sm">
                {errors.courseId.message}
              </div>
            )}
          </div>

          {/* Subjects */}
          <div>
            <label
              htmlFor={subjectSelectInputId}
              className="form-label fw-semibold text-secondary"
            >
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
                    ref={ref as any}
                    className="rs-container"
                    classNamePrefix="rs"
                    isMulti
                    options={subjects}
                    value={selectedOptions}
                    onChange={(selected: any) => {
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
                    menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                    menuPosition="fixed"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      menu: (base) => ({ ...base, zIndex: 9999 })
                    }}
                    maxMenuHeight={300}
                  />
                );
              }}
            />
            {errors.subjectIds && (
              <div role="alert" className="text-danger mt-1 text-sm">
                {errors.subjectIds.message}
              </div>
            )}
            <small className="form-text text-muted">
              Selected: {watchedSubjectIds?.length || 0} / min 3
            </small>
          </div>

          {/* Optional */}

          <div className="d-flex justify-content-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary px-4 py-2 fw-semibold shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isSubmitting
                ? submitLabel === "Enroll"
                  ? "Submitting…"
                  : "Updating…"
                : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
