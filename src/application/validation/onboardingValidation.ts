import { EUserGender } from "@core/enums/UserGender";
import { EBabyGender } from "@core/enums/BabyGender";

export function validateFirstName(value: string): string | null {
  if (value.trim().length < 2)
    return "First name must be at least 2 characters.";
  if (!/^[a-zA-Z\s]+$/.test(value.trim()))
    return "First name must contain letters only.";
  return null;
}

export function validateLastName(value: string): string | null {
  if (value.trim().length < 2)
    return "Last name must be at least 2 characters.";
  if (!/^[a-zA-Z\s]+$/.test(value.trim()))
    return "Last name must contain letters only.";
  return null;
}

export function validateUserBirthDate(value: Date | null): string | null {
  if (!value) return "Date of birth is required.";
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  if (value > eighteenYearsAgo) return "You must be at least 18 years old.";
  return null;
}

export function validateMobile(value: string): string | null {
  const digitsOnly = value.replace(/\D/g, "");
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return "Enter a valid phone number.";
  }
  return null;
}

export function validateUserGender(value: string | null): string | null {
  if (!value) return "Please select a gender.";
  if (!Object.values(EUserGender).includes(value as EUserGender)) {
    return "Invalid gender selection.";
  }
  return null;
}

export function validateBabyName(value: string): string | null {
  if (value.trim().length < 2)
    return "Baby name must be at least 2 characters.";
  return null;
}

export function validateBabyBirthDate(value: Date | null): string | null {
  if (!value) return "Date of birth is required.";
  const today = new Date();
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
  if (value > today) return "Date of birth cannot be in the future.";
  if (value < fiveYearsAgo) return "Baby cannot be older than 5 years.";
  return null;
}

export function validateBabyGender(value: string | null): string | null {
  if (!value) return "Please select a gender.";
  if (!Object.values(EBabyGender).includes(value as EBabyGender)) {
    return "Invalid gender selection.";
  }
  return null;
}
