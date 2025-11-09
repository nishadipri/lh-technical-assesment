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

  const selectedCourse = fetchedCourses.find((c) => c.id === watchedCourseId);
  const subjects =
    selectedCourse?.subjects.map((subject: SubjectType) => ({
      value: subject.id,
      label: subject.name,
    })) || [];

  const submit = async (data: FormValues) => {
    if (!Array.isArray(data.subjectIds) || data.subjectIds.length < 3) {
      setError("subjectIds", {
        type: "manual",
        message: "You should select at least 3 subjects",
      });
      return;
    }
    try {
      if (onSubmit) await onSubmit(data);
      reset();
    } catch (err) {
      console.error("submit error:", err);
    }
  };

  const subjectSelectInstanceId = "enroll-subject-select";
  const subjectSelectInputId = "enroll-subject-select-input";

  return (
    <div className="card shadow-sm border-0 rounded-3 overflow-hidden mb-5 transition-all hover:shadow-lg">
      <div className="card-header bg-gradient bg-primary text-white py-3">
        <h1 className="h5 mb-0 tracking-wide">Enroll Student</h1>
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
            <label className="form-label fw-semibold text-secondary ">
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
                {...register("courseId", { required: "Please select a course" })}
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
              <div role="alert" className="text-danger mt-1 text-sm">
                {errors.subjectIds.message}
              </div>
            )}
            <small className="form-text text-muted">
              Selected: {watchedSubjectIds?.length || 0} / min 3
            </small>
          </div>

          

      
          <div className="d-flex justify-content-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary px-4 py-2 fw-semibold shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isSubmitting ? "Submitting…" : "Enroll"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}