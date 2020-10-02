import { UsernamePasswordInput } from "src/resolvers/UsernamePasswordInput";
import isEmail from "validator/lib/isEmail";

export const validateRegister = (options: UsernamePasswordInput) => {
  if (!isEmail(options.email)) {
    return [
      {
        field: "email",
        message: "Please provide a valid email.",
      },
    ];
  }
  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "Username cannot include @ sign.",
      },
    ];
  }
  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "Username must be at least 2 characters long.",
      },
    ];
  }
  if (options.password.length <= 2) {
    return [
      {
        field: "password",
        message: "Password must be at least 2 characters long.",
      },
    ];
  }

  return null;
};
