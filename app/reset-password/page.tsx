import React from 'react';
import { ResetPasswordForm } from '@/components/account/reset-password';
import CreateProject from "@/components/projects/create-project";

export default function ResetPasswordPage() {
  return (
      <div className="max-w-3xl mx-auto py-10 px-6">
        <ResetPasswordForm />
      </div>

  );
}