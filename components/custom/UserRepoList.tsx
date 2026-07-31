import React from 'react'
import Image from 'next/image'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ListChecks, XCircle, TrendingUp, Sparkles } from 'lucide-react';

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
    totalTests?: number;
    passedTests?: number;
    failedTests?: number;
    passRate?: number;
}

interface UserRepoListProps {
    repoList: UserRepo[];
}

interface StatusCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    iconBgColor: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, value, icon, iconBgColor }) => {
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

const UserRepoList: React.FC<UserRepoListProps> = ({ repoList }) => {
    return (
        <div className="mt-8">
            <h2 className="my-4 font-bold text-xs tracking-wider text-gray-700 uppercase">REPOSITORIES</h2>
            <Accordion type="single" collapsible className="w-full flex flex-col gap-3">
                {repoList?.map((repo, index) => {
                    const totalTests = repo.totalTests ?? 0;
                    const passedTests = repo.passedTests ?? 0;
                    const failedTests = repo.failedTests ?? 0;
                    const passRate = repo.passRate ?? (totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0);

                    return (
                        <AccordionItem
                            value={repo.id?.toString() || index.toString()}
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
                                    {/* 4 Status Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                        <StatusCard
                                            title="Total Tests"
                                            value={totalTests}
                                            icon={<ListChecks className="h-5 w-5 text-blue-600" />}
                                            iconBgColor="bg-blue-50"
                                        />
                                        <StatusCard
                                            title="Passed"
                                            value={passedTests}
                                            icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                                            iconBgColor="bg-emerald-50"
                                        />
                                        <StatusCard
                                            title="Failed"
                                            value={failedTests}
                                            icon={<XCircle className="h-5 w-5 text-rose-600" />}
                                            iconBgColor="bg-rose-50"
                                        />
                                        <StatusCard
                                            title="Pass Rate"
                                            value={`${passRate}%`}
                                            icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
                                            iconBgColor="bg-purple-50"
                                        />
                                    </div>

                                    {/* Generate AI Test Cases Box */}
                                    <div className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/60 gap-4">
                                        <div>
                                            <h3 className="font-semibold text-sm text-gray-900">Generate AI Test Cases</h3>
                                            <p className="text-xs text-gray-500">
                                                Analyze this repository and generate automated test cases using AI.
                                            </p>
                                        </div>
                                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-4 py-2 rounded-lg flex items-center gap-2 self-start sm:self-auto">
                                            <Sparkles className="w-4 h-4" />
                                            Generate Test Cases
                                        </Button>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    )
}

export default UserRepoList