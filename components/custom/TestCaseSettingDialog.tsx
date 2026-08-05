import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import axios from 'axios'
import { SettingsIcon } from 'lucide-react'
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
import { Textarea } from '../ui/textarea'
import { TestCase } from './UserRepoList'

type props = {
    testCase?: TestCase
    setReload: () => void
}

function TestCaseSettingDialog({ testCase, setReload }: props) {
    const [formTestCase, setFormTestCase] = useState({
        title: testCase?.title || '',
        description: testCase?.description || '',
        targetRoute: testCase?.targetRoute || '',
        expectedResult: testCase?.expectedResult || '',
    })

    useEffect(() => {
        if (testCase) {
            setFormTestCase({
                title: testCase.title || '',
                description: testCase.description || '',
                targetRoute: testCase.targetRoute || '',
                expectedResult: testCase.expectedResult || '',
            })
        }
    }, [testCase])

    const handleChange = (field: string, value: string) => {
        setFormTestCase(prev => ({ ...prev, [field]: value }))
    }


    const updateCase = async () => {
        try {
            const result = await axios.post('/api/test-cases/settings', {
                testCase: formTestCase,
                testCaseId: testCase?.id
            });
            console.log(result?.data);
            setReload();
        } catch (error: any) {
            console.error("Failed to update test case:", error);
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="icon" variant="outline">
                    <SettingsIcon className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Testing Requirements</DialogTitle>
                    <DialogDescription>
                        Modifying these parameters automatically clears pre-generated scripts to ensure synchronization.
                    </DialogDescription>
                </DialogHeader>

                <div className='mt-0'>
                    <div className='mt-5'>
                        <label className='text-gray-500'> TEST TITLE</label>

                        <input
                            value={formTestCase?.title ?? ''}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder='Test Title'
                            className='border rounded-md w-full p-2'
                        />
                    </div>

                    <div className='mt-5'>
                        <label className='text-gray-500'> DESCRIPTION/ACTION</label>
                        <Textarea
                            value={formTestCase?.description ?? ''}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder='Description'
                            className='border rounded-md w-full p-2'
                        />
                    </div>

                    <div className='mt-5'>
                        <label className='text-gray-500'> TARGET ROUTE/PATH</label>
                        <input
                            value={formTestCase?.targetRoute ?? ''}
                            onChange={(e) => handleChange('targetRoute', e.target.value)}
                            placeholder='Target Route'
                            className='border rounded-md w-full p-2'
                        />
                    </div>

                    <div className='mt-5'>
                        <label className='text-gray-500'> EXPECTED RESULT</label>
                        <Textarea
                            value={formTestCase?.expectedResult ?? ''}
                            onChange={(e) => handleChange('expectedResult', e.target.value)}
                            placeholder='Expected Result'
                            className='border rounded-md w-full p-2'
                        />
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={'outline'}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={updateCase}>Update Case</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default TestCaseSettingDialog


