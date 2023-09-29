import { z } from "zod";

export const verifyOptionsSchema = z
  .object({
    audience: z.union([
      z.string().nonempty(),
      z
        .array(z.string())
        .nonempty(
          "options.audience, if provided, has to be a non-empty string or an array of string."
        ),
    ]),
    issuer: z.union([
      z.string().nonempty(),
      z
        .array(z.string())
        .nonempty(
          "options.issuer, if provided, has to be a non-empty string or an array of string."
        ),
    ]),
    subject: z
      .string()
      .nonempty("options.subject, if provided, has to be a non-empty string."),
    jwtid: z
      .string()
      .nonempty("options.jwtid, if provided, has to be a non-empty string."),
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
      .nonempty(
        "options.algorithm, if provided, has to be a non-empty string."
      ),
    verifierID: z
      .number()
      .gte(0, "options.verifierID should be greater than -1")
      .lte(1, "options.verifierID should be less than 2"),
  }).partial();
