import { useState } from 'react';

const ReposListItem = ({
    node: {
        id,
        key,
        createdAt,
        name,
        description
    },
    isChecked,
    handleChange
}) => {
    description = description ? description : 'n/a'
    return (
        <tr key={key}>
            <td>
                <input
                    type="checkbox"
                    name="repo-item"
                    id="repo-item"
                    checked={isChecked}
                    onChange={() => handleChange(id)}
                    value={id} />
                </td>
            <td className="repos data-timestamp">{new Date(createdAt).toLocaleDateString()}</td>
            <td className='repos repo-name'>{name}</td>
            <td className='repos repo-desc'>{description}</td>
        </tr>
    )

}
export default function ReposList({ edges=[] }) {
    const [items, setItems] = useState(Object.fromEntries(edges.map(({node}) => [node.id, false])))
    const handleChange = (id) => {
        const newState = Object.assign(items, {
            [id]: !items[id]
        })
        setItems(newState)
    }
    const handleClick =() => {
        const selection = edges.filter(({node}) => items[node.id])
        alert(JSON.stringify(selection))
    }
    const handleArchive = async () => {
        // send a patch request to /repos
        const selection = getSelection()
        const ids = selection.map(({node}) => node.id)
        const payload = JSON.stringify({ ids });
        const method = "PATCH"
        const access_token = localStorage.getItem('ghr-mgmt_access_token');
        try {
            const result = await fetch('/api/v1/repos', {
                method,
                body: payload,
                headers: {
                    'Content-Type':'application/json',
                    "Authorization": `Bearer ${access_token}`
                }
            })
            console.log(await result.json())
        } catch (error) {
            throw error;
        } finally {
            // mark the archived repos in secondary style
        }
    }
    const handleDelete = async () => {
        const selection = getSelection();
        try {
            const method = 'DELETE'
            const access_token = localStorage.getItem('ghr-mgmt_access_token')
            const body = JSON.stringify({ names: selection.map(({ node }) => node.name)})
            await fetch('/api/v1/repos', {
                method,
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Bearer ${access_token}`,
                },
                body
            });
        } catch(error) {
            throw error;
        } finally {
            //update the list of repos, and fill in the list
        }
    }
    function getSelection() {
        return edges.filter(({ node }) => items[node.id])
    }
    return (
        <div className="container" style={{
            fontSize: '12px'
        }}>

            <h3>Repos</h3>

            <table>

                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Created At</th>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        edges.map(({ node }) => (
                                <ReposListItem
                                    key={node.id}
                                    node={node}
                                    isChecked={items[node.id]}
                                    handleChange={handleChange}
                                />
                            )
                        )
                    }
                </tbody>

            </table>

        <button onClick={handleClick}>Read</button>
        <button onClick={handleArchive}>Archive</button>
        <button onClick={handleDelete}>Delete</button>

        </div>
    )
}