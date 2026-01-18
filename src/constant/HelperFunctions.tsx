import { SetStateAction } from "react";
//please
// Timer based on start_time
export const updateRemainingTimer = (
  sessionEndTime: string,
  setRemainingTime: React.Dispatch<React.SetStateAction<string>>
) => {
  const now = Date.now();
  const endTime = new Date(sessionEndTime).getTime();
  const difference = endTime - now;
  if (difference <= 0) {
    setRemainingTime("00:00:00");
    return;
  }

  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  setRemainingTime(formattedTime);
};

// Function to calculate live duration
export const getLiveDuration = (
  sessionStartTime: string,
  setSessionLive: React.Dispatch<React.SetStateAction<string>>
) => {
  const startTime = new Date(sessionStartTime).getTime();
  const now = Date.now();
  const difference = now - startTime; // Difference in milliseconds
  if (difference <= 0) {
    setSessionLive("00:00:00"); // If session hasn't started yet
    return;
  }

  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  setSessionLive(
    `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`
  );
};

export function calculateAge(dob:Date | string | undefined): number {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // If birthday hasn't occurred yet this year, subtract 1
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}
