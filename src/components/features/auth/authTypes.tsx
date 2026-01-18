export interface User {
  id: string;
  full_name: string;
  email: string;
  role: "user" | "mentor";
  gender: string;
  avatar?: string; // Optional field for profile picture
}
