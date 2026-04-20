"use client";
import { useState, useEffect } from "react";
import { getSkillStatus, enrollUser, submitAssessment, getEnrollments } from "@/lib/mockApi";

export const useEnrollment = (skillId) => {
  const [status, setStatus] = useState("locked");
  const [enrollment, setEnrollment] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  const refresh = () => {
    const currentStatus = getSkillStatus(skillId);
    const allEnrollments = getEnrollments();
    const currentEnrollment = allEnrollments.find((e) => e.skillId === skillId);
    
    setStatus(currentStatus);
    setEnrollment(currentEnrollment);
  };

  useEffect(() => {
    refresh();
    // Refresh periodically if active
    const interval = setInterval(refresh, 60000); // every minute
    return () => clearInterval(interval);
  }, [skillId]);

  useEffect(() => {
    if (enrollment && enrollment.status === "active") {
      const now = new Date();
      const end = new Date(enrollment.enrollment_end_date);
      const diff = end - now;

      if (diff > 0) {
        setTimeLeft(diff);
      } else {
        setTimeLeft(0);
      }
    } else {
      setTimeLeft(null);
    }
  }, [enrollment]);

  const enroll = () => {
    const res = enrollUser(skillId);
    if (res.success) {
      refresh();
    }
    return res;
  };

  const submit = (score) => {
    const res = submitAssessment(skillId, score);
    if (res.success) {
      refresh();
    }
    return res;
  };

  return {
    status,
    enrollment,
    timeLeft,
    enroll,
    submit,
    refresh,
  };
};
