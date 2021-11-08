
const client_id = process.env.GITHUB_APP_CLIENT_ID;
const scopes = ['public_repo', 'delete_repo']

export const AuthBtn = () => {
    const authUrl = new URL('https://github.com/login/oauth/authorize')
    const authUrlSearchParams = new URLSearchParams({ client_id, scope: scopes.join(' ')})
    authUrl.search = authUrlSearchParams
    return (
        <div className="container">
            <a href={authUrl}>Auth</a>
        </div>
    )
}