export const InvalidEmailFormat = "Invalid Email Format!";
export const PasswordMustMatch = "Confirm Password must match with Password";

export const Required = (input : string) => input + " is required!";

export const MinLengthError = (input: string, minLength: number) => input + " must be at least " + minLength + " characters long!";
export const MaxiLengthError = (input: string, maxLength: number) => input + " must be less than " + maxLength + " characters!";