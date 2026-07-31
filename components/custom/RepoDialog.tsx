import React, { useMemo, useContext } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Input } from '../ui/input'
import { UserDeatailContext } from '@/context/UserDeatailContext'

export type Repo = {
    id: number;
    name: string;
    full_name: string;
    url: string;
    fork: boolean;
    language: string;
    private: boolean;
    created_at: string;
    updated_at: string;
    owner: string;
    owner_id: string;
    description: string;
    default_branch: string;
    license: string;
}
function RepoDialog({ setRefreshPage }: { setRefreshPage: (refresh: boolean) => void }) {


    const [repoList, setRepoList] = useState<Repo[]>([])
    const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { userDetails } = useContext(UserDeatailContext);
    const [isOpen, setIsopen] = useState(false);


    useEffect(() => {
        GetRepoList()
    }, [])

    const GetRepoList = async () => {
        const result = await axios.get('/api/github/repos')
        console.log(result.data)
        setRepoList(result.data)
    }

    const filteredRepoList = useMemo(() => {
        const q = searchTerm.toLowerCase().trim();
        if (!q) {
            return repoList;
        }
        return repoList.filter(repo => repo.name.toLowerCase().includes(q));
    }, [repoList, searchTerm])

    const SaveRepoToDB = async () => {

        if (!selectedRepo) return;

        const result = await axios.post('/api/user-repo', {
            repoId: selectedRepo.id,
            userId: userDetails?.id,
            name: selectedRepo.name,
            full_name: selectedRepo.full_name,
            private_: selectedRepo.private,
            html_url: selectedRepo.url,
            description: selectedRepo.description,
            language: selectedRepo.language,
            updated_at: selectedRepo.updated_at,
            owner: selectedRepo.owner,
            default_branch: selectedRepo.default_branch,

        });

        console.log(result.data)
        setIsopen(false)
        setRefreshPage(true);


    }
    return (

        <Dialog open={isOpen} onOpenChange={(open) => setIsopen(open)}>
            <DialogTrigger asChild>
                <Button>+Add Repo</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Repository</DialogTitle>
                    <DialogDescription>
                        Search and select one of your github repositories.
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <Input placeholder='Search Repos by name ..' onChange={(event) => setSearchTerm(event.target.value)} />
                    {/* Repo list */}
                    <ul className="max-h-60 overflow-y-auto border rounded-xl mt-4">
                        {filteredRepoList.map((repo) => (
                            <li
                                key={repo.id}
                                className={`p-4 border-b hover:bg-gray-100 cursor-pointer ${selectedRepo?.id === repo.id ? "bg-gray-100" : null
                                    }`}
                                onClick={() => setSelectedRepo(repo)}
                            >
                                {repo.full_name}
                            </li>
                        ))}
                    </ul>
                </div>
                <DialogFooter className="flex gap-5">
                    <DialogClose asChild>
                        <Button>Cancel</Button>
                    </DialogClose>
                    <Button onClick={() => SaveRepoToDB()}>Add Repo</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}

export default RepoDialog