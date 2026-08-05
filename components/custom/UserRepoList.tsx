import React, { useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ListChecks, XCircle, TrendingUp, Sparkles, Loader2, Globe2Icon, Link2Icon, Settings2 } from 'lucide-react';
import { Loader2Icon } from 'lucide-react';
import TestCaseList from './TestCaseList'
import RepoSettings from './RepoSettings'

export type UserRepo = {
    id: number;
    repoId: number;
    userId: number;
    name: string;
    fullName: string;
    private: number;
    htmlUrl: string;
    description: string;
    language: string;
    updatedAt: string;
    owner: string;
    defaultBranch: string;
    targetDomain?: string;
    globalInstruction?: string;
    totalTests?: number;
    passedTests?: number;
    failedTests?: number;
    passRate?: number;
};

interface UserRepoListProps {
    repoList: UserRepo[];
    setReload?: () => void;
}

interface StatusCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    iconBgColor: string;
}

export type TestCase = {
    id: number;
    title: string;
    description: string;
    type: string
    repoId: number;
    createdAt: string;
    targetFiles: string[];
    expectedResult: string;
    repoName: string;
    repoOwner: string;
    userId: string;
    targetRoute: string;
    targetDomain?: string;
    status?: string;
}

type StatusData = {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    passRate: number;
}

const StatusCard = ({ title, value, icon, iconBgColor }: StatusCardProps) => {
    return (
        <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between bg-white shadow-xs">
            <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 font-medium">{title}</span>
                <span className="text-2xl font-bold text-gray-900">{value}</span>
            </div>
            <div className={`p-2.5 rounded-full ${iconBgColor}`}>
                {icon}
            </div>
        </div>
    );
};

const UserRepoList = ({ repoList, setReload }: UserRepoListProps) => {
    const [loadingRepoId, setLoadingRepoId] = useState<number | null>(null);

    const onGenerateTestCase = async (repo: UserRepo) => {
        try {
            setLoadingRepoId(repo.id);

            // 1. Fetch GitHub token
            const tokenRes = await axios.get('/api/github/token');
            const githubToken = tokenRes.data?.token;

            if (!githubToken) {
                alert("GitHub token missing. Please reconnect your GitHub account.");
                return;
            }

            // 2. Parse owner and repo name from fullName (e.g. "rrs301/portfolio-web-testing")
            const [owner, repoName] = repo.fullName.split('/');

            // 3. Make POST request to generate test cases
            const result = await axios.post('/api/generate-test-case', {
                userId: repo.userId.toString(),
                repoId: repo.repoId.toString(),
                owner: owner || repo.owner,
                repo: repoName || repo.name,
                branch: repo.defaultBranch || 'main',
                githubToken: githubToken
            });

            console.log("Generated test cases:", result.data);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || error?.message || "Failed to generate test cases";
            console.error("Error generating test cases:", errorMessage);
        } finally {
            setLoadingRepoId(null);
        }
    };

    const GetTestCases = async (repoId: number) => {
        try {
            setLoadingRepoId(repoId);
            setTestCases([]);
            setTestCasesRepoId(repoId);
            const res = await axios.get(`/api/test-cases?repoId=${repoId}`);
            if (Array.isArray(res.data)) {
                const fetchedTestCases = res.data;
                const totalTests = fetchedTestCases.length;
                const passedTests = fetchedTestCases.filter((tc: any) => tc.status === 'passed').length;
                const failedTests = fetchedTestCases.filter((tc: any) => tc.status === 'failed').length;
                const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

                setStatusData({
                    totalTests,
                    passedTests,
                    failedTests,
                    passRate
                });
                setTestCases(fetchedTestCases);
            }
        } catch (error: any) {
            console.error("Error fetching test cases:", error);
        } finally {
            setLoadingRepoId(null);
        }
    }

    const [testCases, setTestCases] = useState<TestCase[]>([]);
    const [testCasesRepoId, setTestCasesRepoId] = useState<number | null>(null);
    const [statusData, setStatusData] = useState<StatusData>({
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        passRate: 0
    });




    return (
        <div className="mt-8">
            <h2 className="my-4 font-bold text-xs tracking-wider text-gray-700 uppercase">REPOSITORIES</h2>
            <Accordion type="single" collapsible className="w-full flex flex-col gap-3"
                onValueChange={(value) => {
                    if (value) {
                        GetTestCases(Number(value));
                    }
                }}>

                {repoList?.map((repo, index) => {

                    // const totalTests = repo.totalTests ?? 0;
                    // const passedTests = repo.passedTests ?? 0;
                    // const failedTests = repo.failedTests ?? 0;
                    // const passRate = repo.passRate ?? (totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0);
                    const testCaseLoading = loadingRepoId === Number(repo.repoId?.toString() || index.toString());
                    const isCurrentRepoTestCases = testCasesRepoId === Number(repo.repoId?.toString() || index.toString());
                    //const passRate = totalTests > 0 ? Math.round((passedTests/ totalTests)*100):0
                    return (

                        <AccordionItem
                            value={repo.repoId?.toString() || index.toString()}
                            key={repo.id || index}
                            className="border border-gray-200 rounded-2xl px-5 py-1 bg-white shadow-xs"
                        >
                            <AccordionTrigger className="hover:no-underline py-4 border-b-0">
                                <div className="flex items-center gap-4 text-left">
                                    <Image src={'/github.png'} alt="github" width={32} height={32} />
                                    <div className="flex flex-col items-start">
                                        <h2 className="font-semibold text-gray-900 text-sm">{repo.fullName}</h2>
                                        <p className="text-xs text-gray-500 font-normal">
                                            {repo.defaultBranch || 'main'} • {repo.language || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </AccordionTrigger>



                            <AccordionContent className="pt-2 pb-4">
                                <div className="flex flex-col gap-4">
                                    {/* Target Domain & Configuration Banner */}
                                    <div className="bg-gray-50 p-3 border rounded-xl flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Link2Icon className="h-4 w-4 text-gray-500" />
                                            <h2 className="font-medium text-gray-700">Target Domain:</h2>
                                            <h2 className="bg-white p-1 px-2 border border-gray-300 rounded-md text-primary font-semibold">
                                                {repo.targetDomain || testCases[0]?.targetDomain || 'http://localhost:3000/'}
                                            </h2>
                                        </div>

                                        <RepoSettings repo={repo} setReload={setReload} />
                                    </div>
                                    {/* 4 Status Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                        <StatusCard
                                            title="Total Tests"
                                            value={statusData.totalTests}
                                            icon={<ListChecks className="h-5 w-5 text-blue-600" />}
                                            iconBgColor="bg-blue-50"
                                        />
                                        <StatusCard
                                            title="Passed"
                                            value={statusData.passedTests}
                                            icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                                            iconBgColor="bg-emerald-50"
                                        />
                                        <StatusCard
                                            title="Failed"
                                            value={statusData.failedTests}
                                            icon={<XCircle className="h-5 w-5 text-rose-600" />}
                                            iconBgColor="bg-rose-50"
                                        />
                                        <StatusCard
                                            title="Pass Rate"
                                            value={`${statusData.passRate}%`}
                                            icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
                                            iconBgColor="bg-purple-50"
                                        />
                                    </div>
                                    {!testCaseLoading && isCurrentRepoTestCases && testCases.length !== 0 && <TestCaseList testCases={testCases} onReload={() => GetTestCases(repo.id)} />}

                                    {testCaseLoading ? (
                                        <h2 className='flex gap-3 items-center'> <Loader2Icon className='animate-spin h-4 w-4' /> Please Wait...</h2>
                                    ) : (
                                        /* Generate AI Test Cases Box */
                                        (!isCurrentRepoTestCases || testCases?.length === 0) && <div className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/60 gap-4">
                                            <div>
                                                <h3 className="font-semibold text-sm text-gray-900">Generate AI Test Cases</h3>
                                                <p className="text-xs text-gray-500">
                                                    Analyze this repository and generate automated test cases using AI.
                                                </p>
                                            </div>

                                            <Button
                                                disabled={loadingRepoId === repo.id}
                                                onClick={() => onGenerateTestCase(repo)}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-4 py-2 rounded-lg flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                                            >
                                                {loadingRepoId === repo.id ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Generating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="w-4 h-4" />
                                                        Generate Test Cases
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
}

export default UserRepoList;