import { z } from "zod";

export const verifyOptionsSchema = z
  .object({
    audience: z.union([
      z.string().min(1, ),
      z
        .array(z.string())
        .min(1, 
          "options.audience, if provided, has to be a non-empty string or an array of string."
        ),
    ]),
    issuer: z.union([
      z.string().min(1, ),
      z
        .array(z.string())
        .min(1, 
          "options.issuer, if provided, has to be a non-empty string or an array of string."
        ),
    ]),
    subject: z
      .string()
      .min(1, "options.subject, if provided, has to be a non-empty string."),
    jwtid: z
      .string()
      .min(1, "options.jwtid, if provided, has to be a non-empty string."),
    clockTimestamp: z
      .number()
      .positive(
        "options.clockTimestamp, if provided, has to be a positive number."
      ),
    nonce: z
      .number({
        invalid_type_error: "options.nonce, if provided, has to be a number",
      })
      .positive("options.nonce, if provided, has to be a positive integer"),
    ignoreNotBefore: z.boolean({
      invalid_type_error:
        "options.ignoreNotBefore, if provided, has to be a boolean",
    }),
    clockTolerance: z
      .number()
      .positive(
        "options.clockTolerance, if provided, has to be a positive number."
      ),
    ignoreExpiration: z.boolean({
      invalid_type_error:
        "options.ignoreExpiration, if provided, has to be a boolean.",
    }),
    maxAge: z
      .number()
      .positive("options.maxAge, if provided, has to be a positive number."),
    complete: z.boolean({
      invalid_type_error: "options.complete, if provided, has to be a boolean",
    }),
    algorithm: z
      .string()
      .min(1, 
        "options.algorithm, if provided, has to be a non-empty string."
      ),
  })
  .partial()
  .strict();
