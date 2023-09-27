import { z } from "zod";

export const payloadSchema = z.object({
  iss: z.string().nonempty("Issuer (iss) claim has to be provided."),
  nonce: z.number().positive("A nonce > 0 has to be provided."),
  exp: z.union([
    z.number().positive(),
    z.string().nonempty("Expiration Time (exp) claim has to be provided."),
  ]),
  iat: z
    .number()
    .positive("Issued At (iat) claim, if provided, has to be a positive number.")
    .optional(),
  nbf: z
    .union([
      z.number().positive(),
      z
        .string()
        .nonempty(
          "Not Before (nbf) claim, if provided, has to be a positive number or a non-empty string."
        ),
    ])
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
