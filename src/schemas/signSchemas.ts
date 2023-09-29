import { z } from "zod";

export const payloadSchema = z.object({
  iss: z
    .string({ invalid_type_error: "Issuer (iss) claim has to be a string" })
    .nonempty("Issuer (iss) claim has to be non-empty."),
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
    .nonempty("Subject (sub) claim, if provided, has to be a non-empty string.")
    .optional(),
  jti: z
    .string()
    .nonempty("JWT ID (jti) claim, if provided, has to be a non-empty string.")
    .optional(),
  aud: z
    .union([
      z.string().nonempty(),
      z
        .array(z.string())
        .nonempty(
          "Audience (aud) claim, if provided, has to be a non-empty string or an array of string."
        ),
    ])
    .optional(),
});

export const headerSchema = z.object({
  alg: z.string().nonempty("header.alg has to be provided."),
  verifierID: z
    .number()
    .gte(0, "header.verifierID should be greater than -1")
    .lte(1, "header.verifierID should be less than 2"),
});

export const signOptionsSchema = z.object({
  algorithm: z
    .string({ invalid_type_error: "Algorithm has to be a string" })
    .nonempty("options.algorithm has to be provided."),
  header: headerSchema.optional(),
  verifierID: z
    .number()
    .gte(0, "options.verifierID should be greater than -1")
    .lte(1, "options.verifierID should be less than 2")
    .optional(),
  encoding: z
    .string()
    .nonempty("encoding, if provided, has to be a non-empty string.")
    .optional(),
  noTimestamp: z.boolean().optional(),
  expiresIn: z
    .union([
      z.number().positive(),
      z
        .string()
        .nonempty(
          'options.expiresIn, if provided, has to be a number of seconds or string representing a timespan eg: "1d", "20h", 60'
        ),
    ])
    .optional(),
  notBefore: z
    .union([
      z.number().positive(),
      z
        .string()
        .nonempty(
          'options.notBefore, if provided, has to be a number of seconds or string representing a timespan eg: "1d", "20h", 60'
        ),
    ])
    .optional(),
});
