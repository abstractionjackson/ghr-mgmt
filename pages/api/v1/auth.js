import { Octokit } from "octokit";
import { createOAuthUserAuth } from '@octokit/auth-oauth-user'

export default async function handler(req,res) {
    const { code } = req.query;
    try {
        const auth = createOAuthUserAuth({
            clientId: process.env.GITHUB_APP_CLIENT_ID,
            clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
            code
        });
        const { token } = await auth();
        res.json({ "access_token": token })
    } catch (error) {
        res.send(error)
    } finally {
        res.end()
    }
}