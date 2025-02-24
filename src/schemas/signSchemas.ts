import { z } from "zod";

export const payloadSchema = z.object({
  iss: z
    .string({ invalid_type_error: "Issuer (iss) claim has to be a string" })
    .min(1, "Issuer (iss) claim has to be non-empty."),
  nonce: z
    .number({ invalid_type_error: "nonce has to be a number" })
    .positive("A nonce > 0 has to be provided."),
  exp: z
    .number({
      invalid_type_error: "Expiration Time (exp) claim has to be a number",
    })
    .positive(
      "A positive number as Expiration Time (exp) claim has to be provided."
    ),
  iat: z
    .number()
    .positive(
      "Issued At (iat) claim, if provided, has to be a positive number."
    )
    .optional(),
  nbf: z
    .number()
    .positive(
      "Not Before (nbf) claim, if provided, has to be a positive number."
    )
    .optional(),
  sub: z
    .string()
    .min(1, "Subject (sub) claim, if provided, has to be a non-empty string.")
    .optional(),
  jti: z
    .string()
    .min(1, "JWT ID (jti) claim, if provided, has to be a non-empty string.")
    .optional(),
  aud: z
    .union([
      z.string().min(1,),
      z
        .array(z.string())
        .min(1,
          "Audience (aud) claim, if provided, has to be a non-empty string or an array of string."
        ),
    ])
    .optional(),
}).strict();

export const headerSchema = z.object({
  alg: z.string().min(1, "header.alg has to be provided.")
}).strict();

export const signOptionsSchema = z.object({
  algorithm: z
    .string({ invalid_type_error: "Algorithm has to be a string" })
    .min(1, "options.algorithm has to be provided."),
  header: headerSchema,
  sigEncoding: z
    .string()
    .min(1, "sigEncoding, if provided, has to be a non-empty string."),
  noTimestamp: z.boolean(),
  expiresIn: z
    .union([
      z.number().positive(),
      z
        .string()
        .min(1,
          'options.expiresIn, if provided, has to be a number of seconds or string representing a timespan eg: "1d", "20h", 60'
        ),
    ]),
  notBefore: z
    .union([
      z.number().positive(),
      z
        .string()
        .min(1,
          'options.notBefore, if provided, has to be a number of seconds or string representing a timespan eg: "1d", "20h", 60'
        ),
    ]),
}).partial().strict();
