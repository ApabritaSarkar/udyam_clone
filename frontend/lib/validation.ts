import { z } from "zod";

export const detectRule = (field: { name?: string; label?: string; pattern?: string }) => {
  if (field.pattern) {
    return { regex: new RegExp(field.pattern), message: "Invalid format" };
  }
  return null;
};
