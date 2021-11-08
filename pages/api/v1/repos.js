import { Octokit } from "octokit"

export default async function handler(req, res) {
    const access_token = req.headers['authorization'].split(' ')[1]
    const octokit = new Octokit({
        auth: access_token
    })
    if (req.method === 'PATCH') {
        const { ids } = req.body 
        const repositoryNames = []
        for (const id of ids) {
            const result = await octokit.graphql(`
                mutation archiveRepo($id:String) {
                    archiveRepository(input: {
                    repositoryId: $id
                    }) {
                    repository {
                        isArchived
                        name
                    }
                    }
                }
            `,
            {
                id
            }
            )
            console.log(result)
        }
        res.json({ archived: repositoryNames });
    } else if (req.method === 'DELETE') {
        const { names } = req.body;
        for (const name of names) {
            try {
                const { data: {
                    login
                }} = await octokit.rest.users.getAuthenticated()
                await octokit.rest.repos.delete({ owner: login, repo: name })
            } catch (error) {
                throw error
            } finally {
                res.end(204)
            }
        }
        res.end()
    }
    res.end()
}