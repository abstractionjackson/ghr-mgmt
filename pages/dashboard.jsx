import { useEffect, useState } from 'react';
import { Octokit } from 'octokit';
import ReposList from '../components/ReposList';

export const Dashboard = () => {
    const [viewer, setViewer] = useState({
        login: '',
        repositories: {
            edges: []
        }
    })
    let accessToken;
    if (typeof window !== "undefined") {
        accessToken = localStorage.getItem('ghr-mgmt_access_token')
    }
    useEffect(async() => {
        if (accessToken) {
            const octokit = new Octokit({
                auth: accessToken
            })
            let data = viewer
            try {
                const response = await octokit.graphql(`{
                    viewer { 
                        login
                        repositories(first: 5, orderBy: {
                          field: UPDATED_AT,
                          direction: ASC
                        }) {
                          edges {
                            node {
                              id  
                              createdAt
                              name
                              description
                            }
                          }
                        }
                      }
                }`)
                data = response.viewer
            } catch(error) {
                throw error;
            } finally {
                setViewer(data)
            }
        }
    },[accessToken])
    const { edges } = viewer.repositories;
    return (
        <div className="container">
            <h1>Dash</h1>
            <div className="container">
                <h2>user: {viewer.login}</h2>
            </div>
            <div className="container">
                <ReposList edges={edges} />
            </div>
         </div>
    )
}

export default Dashboard;