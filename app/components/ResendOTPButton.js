"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

const ResendOTPButton = ({ email }) => {
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleResendOTP = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) throw error;

      // Start countdown
      setCountdown(60);
    } catch (error) {
      console.error("Error resending OTP:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleResendOTP}
      disabled={countdown > 0 || isLoading}
      className="w-full mt-4"
    >
      {isLoading
        ? "Sending..."
        : countdown > 0
        ? `Resend code in ${countdown}s`
        : "Resend verification code"}
    </Button>
  );
};

export default ResendOTPButton;
