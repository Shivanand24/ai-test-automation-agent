import React, { useState } from "react";
import { TestCase } from "./UserRepoList";

import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

import {
    RefreshCw,
    SettingsIcon,
    Play
} from "lucide-react";
import TestCaseSettingDialog from "./TestCaseSettingDialog";

type Props = {
    testCases: TestCase[];
    onReload: () => void;
};

function TestCaseList({ testCases, onReload }: Props) {

    const [selectedTestCases, setSelectedTestCases] = useState<TestCase[]>([]);

    const handleSelectdedTestCase = (checked: boolean | string, testCase: TestCase) => {

        if (checked) {
            setSelectedTestCases((prev: any) => [...prev, testCase])
        } else {
            setSelectedTestCases((prev: any) => prev.filter((tc: any) => tc.id !== testCase.id))
        }

    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <h2 className="font-medium text-primary">
                    Generated Test Cases
                </h2>

                <Button size="sm" onClick={() => onReload()}>
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Refresh
                </Button>
            </div>

            <div className="border rounded-md mt-3">
                {testCases.map((testCase, index) => (
                    <div
                        key={index}
                        className="p-4 border-b flex items-center justify-between"
                    >
                        <div className="flex gap-3 items-center">
                            <Checkbox
                                checked={selectedTestCases.some((tc: any) => tc.id === testCase.id)}
                                onCheckedChange={(checked) => handleSelectdedTestCase(checked, testCase)} />

                            <div>
                                <h2 className="font-medium">
                                    {testCase?.title}
                                </h2>

                                <p className="text-xs text-gray-500">
                                    {testCase?.description}
                                </p>
                            </div>
                        </div>

                        <div className="gap-4 flex items-center">
                            <Badge variant="secondary">
                                {testCase?.type}
                            </Badge>

                            <Badge variant="secondary">
                                Pending
                            </Badge>

                            <TestCaseSettingDialog testCase={testCase} setReload={onReload} />
                        </div>
                    </div>
                ))}

                <div className="p-4 bg-gray-50 border-t flex items-center justify-between rounded-b-md">
                    <h2 className="font-medium text-gray-700">Run Selected Test Case</h2>
                    <Button disabled={selectedTestCases.length === 0} className="bg-green-700 hover:bg-green-800 text-white">
                        <Play className="h-4 w-4 mr-2" />
                        Run Selected
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default TestCaseList;