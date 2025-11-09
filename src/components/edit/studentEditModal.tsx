"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import SelectBox from "react-select";
import useFetchCourses from "../../hooks/fetchCourses";
import { CourseType, SubjectType } from "../../data/courses";

export type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  courseId: string;
  startDate?: string;
  notes?: string;
  subjectIds: string[];
};

type Props = {
  open: boolean;
  initialValues: FormValues;
  onClose: () => void;
  onUpdate: (data: FormValues) => void | Promise<void>;
};

export default function StudentEditModal({
  open,
  initialValues,
  onClose,
  onUpdate,
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
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

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
    await onUpdate(data);
    onClose();
  };

  if (!open) return null;

  const subjectSelectInstanceId = "edit-subject-select";
  const subjectSelectInputId = "edit-subject-select-input";

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(15,23,42,.55)", zIndex: 1050 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-student-title"
    >
      <div className="bg-white rounded-3 shadow-lg w-100" style={{ maxWidth: 720 }}>
        <div className="d-flex align-items-center justify-content-between border-bottom px-4 py-3">
          <h2 id="edit-student-title" className="h5 mb-0">
            Edit Student
          </h2>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
            {/* First Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary">First name</label>
              <input
                {...register("firstName", { required: "First name is required" })}
                type="text"
                className={`form-control rounded-md shadow-sm ${
                  errors.firstName ? "is-invalid border-danger" : ""
                }`}
              />
              {errors.firstName && (
                <div className="invalid-feedback d-block text-sm">
                  {errors.firstName.message}
                </div>
              )}
            </div>

            {/* Last Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary">Last name</label>
              <input
                {...register("lastName", { required: "Last name is required" })}
                type="text"
                className={`form-control rounded-md shadow-sm ${
                  errors.lastName ? "is-invalid border-danger" : ""
                }`}
              />
              {errors.lastName && (
                <div className="invalid-feedback d-block text-sm">
                  {errors.lastName.message}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary">Email</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                type="email"
                className={`form-control rounded-md shadow-sm ${
                  errors.email ? "is-invalid border-danger" : ""
                }`}
              />
              {errors.email && (
                <div className="invalid-feedback d-block text-sm">
                  {errors.email.message}
                </div>
              )}
            </div>

            {/* Course */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary">Course</label>
              {isLoading ? (
                <div className="form-text">Loading courses…</div>
              ) : fetchCoursesError ? (
                <div role="alert" className="text-danger">
                  {fetchCoursesError.message}
                </div>
              ) : (
                <select
                  {...register("courseId", { required: "Please select a course" })}
                  className={`form-select rounded-md shadow-sm ${
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
                <div className="invalid-feedback d-block text-sm">
                  {errors.courseId.message}
                </div>
              )}
            </div>

            {/* Subjects */}
            <div className="mb-3">
              <label htmlFor={subjectSelectInputId} className="form-label fw-semibold text-secondary">
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

            {/* Optional fields preserved */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary">Start date</label>
              <input type="date" {...register("startDate")} className="form-control rounded-md shadow-sm" />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary">Notes</label>
              <textarea {...register("notes")} rows={3} className="form-control rounded-md shadow-sm" />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary px-4">
                {isSubmitting ? "Updating…" : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}