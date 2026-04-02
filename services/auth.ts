import { User } from "@/types";
import { apiFetch } from "@/utils/api";

export const Register = async (data: User) => {
  const res = await apiFetch(`auth/signup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error((await res.json()).error);
  }
  const result = await res.json();
  console.log(result.message);
  return result.message;
};
