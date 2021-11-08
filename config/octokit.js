import { Octokit, App } from "octokit";
import { createOAuthAppAuth } from '@octokit/auth-oauth-app';

export const octokit = new Octokit({
    userAgent: `${process.env.NEXT_PUBLIC_APP_NAME}/${process.env.NEXT_PUBLIC_APP_VERSION}`,
    authStrategy: createOAuthAppAuth,
    auth: {
        clientId: process.env.GITHUB_APP_CLIENT_ID,
        clientSecret: process.env.GITHUB_APP_CLIENT_SECRET
    }
});

