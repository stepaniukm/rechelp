import { number, object, string, type Input } from "valibot";

export const googleClaimsSchema = object({
  sub: string(),
  name: string(),
});

export type GoogleClaims = Input<typeof googleClaimsSchema>;
