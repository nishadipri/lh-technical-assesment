"use client";

import React from "react";
import StudentEnrollForm, { FormValues } from "../forms/studentEnrollForm";

type Props = {
  open: boolean;
  initialValues: FormValues;
  onClose: () => void;
  onUpdate: (data: FormValues) => void | Promise<void>;
  instanceIdPrefix?: string;
};

export default function StudentEditModal({
  open,
  initialValues,
  onClose,
  onUpdate,
  instanceIdPrefix = "edit",
}: Props) {
  if (!open) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(15,23,42,.55)", zIndex: 1050 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-student-title"
    >
      <div
        className="bg-white rounded-3 shadow-lg w-100"
        style={{ maxWidth: 760 }}
      >
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

        <div className="p-4 pt-3">
          <StudentEnrollForm
            initialValues={initialValues}
            submitLabel="Update"
            onSubmit={async (data) => {
              await onUpdate(data);
              onClose();
            }}
            instanceIdPrefix={instanceIdPrefix}
            resetAfterSubmit={false}
          />
        </div>
      </div>
    </div>
  );
}
