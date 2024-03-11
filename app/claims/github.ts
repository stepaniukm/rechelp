import { number, object, string, type Input } from "valibot";

export const githubClaimsSchema = object({
  id: number(),
  name: string(),
});

export type GithubClaims = Input<typeof githubClaimsSchema>;
