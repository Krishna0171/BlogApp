export const InvalidEmailFormat = "Invalid Email Format!";
export const LargeFileSizeError = "File size is too large!"


export const MustMatch = (match: string, to: string) =>
  match + " must match with " + to;

export const Required = (input: string) => input + " is required!";

export const MinLengthError = (input: string, minLength: number) =>
  input + " must be at least " + minLength + " characters long!";
export const MaxiLengthError = (input: string, maxLength: number) =>
  input + " must be less than " + maxLength + " characters!";
