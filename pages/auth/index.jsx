import { useRouter } from 'next/router';
import { useEffect } from "react";

export default function Auth() {
    const router = useRouter();
    const { code } = router.query
    let to;
    useEffect(async() => {
        if (router.isReady) {
            const authUrl  = new URL('/api/v1/auth', process.env.NEXT_PUBLIC_APP_BASE_URL)
            authUrl.search = new URLSearchParams({ code })
            let accessToken;
            try {
                const response = await fetch(authUrl);
                const {access_token} = await response.json()
                accessToken = access_token
                to = accessToken ? '/dashboard' : '/error'
            } catch (error) {
                to = '/error'
                throw error
            } finally {
                //todo - lift access token to state or place in localstorage
                localStorage.setItem('ghr-mgmt_access_token', accessToken)
                router.push(to)
            }
        }
    },[code])
    return (
        <div>
            <h1>Authenticating User {code}</h1>
        </div>
    )
}