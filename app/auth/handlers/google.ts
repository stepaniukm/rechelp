import type { H3Event } from "h3";
import {
  eventHandler,
  createError,
  getQuery,
  getRequestURL,
  sendRedirect,
} from "h3";
import { withQuery, parsePath } from "ufo";
import { ofetch } from "ofetch";
import { defu } from "defu";
import { useRuntimeConfig } from "#imports";
import type { OAuthConfig } from "#auth-utils";

export interface OAuthGoogleConfig {
  clientId?: string;
  clientSecret?: string;
  scope?: string[];
  authorizationURL?: string;
  tokenURL?: string;
  authorizationParams?: Record<string, string>;
}

export function googleEventHandler({
  config,
  onSuccess,
  onError,
}: OAuthConfig<OAuthGoogleConfig>) {
  return eventHandler(async (event: H3Event) => {
    // @ts-ignore
    config = defu(config, useRuntimeConfig(event).oauth?.google, {
      authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenURL: "https://oauth2.googleapis.com/token",
      authorizationParams: {},
    }) as OAuthGoogleConfig;
    const { code, state } = getQuery(event);

    if (state) {
      // @ts-expect-error Wrong type
      config.authorizationParams.state = state;
    }

    if (!config.clientId) {
      const error = createError({
        statusCode: 500,
        message: "Missing NUXT_OAUTH_GOOGLE_CLIENT_ID env variables.",
      });
      if (!onError) throw error;
      return onError(event, error);
    }

    const redirectUrl = getRequestURL(event).href;

    if (!code) {
      config.scope = config.scope || ["email", "profile"];
      // Redirect to Google Oauth page
      return sendRedirect(
        event,
        withQuery(config.authorizationURL as string, {
          response_type: "code",
          client_id: config.clientId,
          redirect_uri: redirectUrl.replace(/\??state=\w+/gm, ""),
          scope: config.scope.join(" "),
          ...config.authorizationParams,
        }),
      );
    }

    const body: any = {
      grant_type: "authorization_code",
      redirect_uri: parsePath(redirectUrl).pathname,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
    };
    const tokens: any = await ofetch(config.tokenURL as string, {
      method: "POST",
      body,
    }).catch((error) => {
      return { error };
    });
    if (tokens.error) {
      const error = createError({
        statusCode: 401,
        message: `Google login failed: ${
          tokens.error?.data?.error_description || "Unknown error"
        }`,
        data: tokens,
      });
      if (!onError) throw error;
      return onError(event, error);
    }

    const accessToken = tokens.access_token;
    const user: any = await ofetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return onSuccess(event, {
      tokens,
      user,
    });
  });
}
