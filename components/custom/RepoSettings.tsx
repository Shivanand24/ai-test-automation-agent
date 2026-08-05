import React, { useState } from 'react'
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
import { Settings2 } from 'lucide-react'
import { Input } from '../ui/input'
import { UserRepo } from './UserRepoList'
import axios from 'axios'

type Props = {
    repo: UserRepo,
    setReload?: () => void
}

function RepoSettings({ repo, setReload }: Props) {

    const [isOpen, setIsOpen] = useState(false);
    const [repoSettings, setRepoSettings] = useState({
        targetDomain: repo?.targetDomain ?? '',
        globalInstruction: repo?.globalInstruction ?? ''
    })

    React.useEffect(() => {
        setRepoSettings({
            targetDomain: repo?.targetDomain ?? '',
            globalInstruction: repo?.globalInstruction ?? ''
        });
    }, [repo]);

    const handleSave = async () => {
        console.log(repoSettings);


        const result = await axios.post('/api/user-repo/settings', {

            repoId: repo.repoId,
            id: repo.id,
            userId: repo.userId,
            targetDomain: repoSettings.targetDomain,
            globalInstruction: repoSettings.globalInstruction

        });

        console.log(result?.data);
        setIsOpen(false);
        setReload?.();

    }
    return (
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Settings2 className="h-4 w-4 mr-1" /> Project Configuration
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex gap-2 items-center">
                        <Settings2 className="text-primary h-5 w-5" />
                        Project / Repository Settings
                    </DialogTitle>
                    <DialogDescription>
                        Configure project-level defaults used during script generation and execution.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-2">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">APP URL / DEFAULT WEBSITE</label>
                        <Input value={repoSettings?.targetDomain ?? ''}
                            onChange={(e) => setRepoSettings({ ...repoSettings, targetDomain: e.target.value })}
                            placeholder="http://localhost:3000/" className="mt-1" />
                        <p className="text-xs text-gray-500 mt-1">
                            The target address where automated browsers will connect and run test cases.
                        </p>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">GLOBAL TEST INSTRUCTION</label>
                        <Input value={repoSettings?.globalInstruction ?? ''}
                            onChange={(e) => setRepoSettings({ ...repoSettings, globalInstruction: e.target.value })}
                            placeholder="Setup or teardown instructions..." className="mt-1" />
                        <p className="text-xs text-gray-500 mt-1">
                            Include any authentication credentials, setup, or teardown instructions. These are automatically appended to Groq prompts.
                        </p>
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={() => handleSave()}>Save Configuration</Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}

export default RepoSettings