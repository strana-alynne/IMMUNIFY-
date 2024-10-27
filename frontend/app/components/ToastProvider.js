"use client";
import React from "react";
import { Toaster } from "sonner";

export const ToastProvider = ({ children }) => {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
};
