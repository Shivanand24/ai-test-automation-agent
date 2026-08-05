import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Play, Loader2, PlayCircle, Settings2, Globe2 } from "lucide-react";
import axios from "axios";
import { TestCase } from "./UserRepoList";

interface Props {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedTestCases: TestCase[];
    onReload: () => void;
}

type QueueItem = TestCase & { queueStatus: 'Queued' | 'Running' | 'Passed' | 'Failed', logs?: string[] };

export default function TestCaseExecutionModel({ isOpen, onOpenChange, selectedTestCases, onReload }: Props) {
    const [targetUrl, setTargetUrl] = useState("");
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [activeTestIndex, setActiveTestIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (isOpen && selectedTestCases.length > 0) {
            setTargetUrl(selectedTestCases[0]?.targetDomain || "http://localhost:3000");
            setQueue(selectedTestCases.map(tc => ({ ...tc, queueStatus: 'Queued', logs: [] })));
            setActiveTestIndex(0);
        }
    }, [isOpen, selectedTestCases]);

    const handleStartExecution = async () => {
        if (queue.length === 0) return;
        setIsRunning(true);
        
        let currentQueue = [...queue];

        for (let i = 0; i < currentQueue.length; i++) {
            setActiveTestIndex(i);
            
            // Update status to running
            currentQueue[i].queueStatus = 'Running';
            setQueue([...currentQueue]);

            try {
                const response = await axios.post('/api/test-cases/run', {
                    testCaseId: currentQueue[i].id,
                    baseUrl: targetUrl,
                    mode: 'generate'
                });

                if (response.data.success) {
                    currentQueue[i].queueStatus = 'Passed';
                    currentQueue[i].logs = response.data.logs;
                } else {
                    currentQueue[i].queueStatus = 'Failed';
                    currentQueue[i].logs = response.data.logs || [response.data.error];
                }
            } catch (error: any) {
                currentQueue[i].queueStatus = 'Failed';
                currentQueue[i].logs = [error?.response?.data?.error || error.message || 'Execution failed'];
            }
            
            setQueue([...currentQueue]);
        }
        
        setIsRunning(false);
    };

    const handleClose = () => {
        if (!isRunning) {
            onReload();
            onOpenChange(false);
        }
    };

    const activeTest = queue[activeTestIndex];

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-5xl p-0 overflow-hidden h-[90vh] max-h-[800px] flex flex-col">
                <DialogHeader className="p-6 border-b bg-gray-50 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <PlayCircle className="w-5 h-5 text-green-700" />
                        <DialogTitle className="text-xl">Browserbase Cloud Test Runner</DialogTitle>
                    </div>
                    <DialogDescription>
                        Run automation scripts completely in the cloud using Browserbase headless infrastructure.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="p-6 border-b flex-shrink-0 flex items-center justify-between gap-4">
                        <div className="flex-1 flex flex-col gap-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                                <Globe2 className="w-3 h-3" /> Target Website URL
                            </label>
                            <Input 
                                value={targetUrl}
                                onChange={(e) => setTargetUrl(e.target.value)}
                                disabled={isRunning}
                            />
                        </div>
                        <div className="flex items-end gap-3 mt-6">
                            <Button variant="outline" className="gap-2">
                                <Settings2 className="w-4 h-4" /> Execution Options
                            </Button>
                            <Button 
                                onClick={handleStartExecution} 
                                disabled={isRunning || queue.length === 0}
                                className="bg-green-700 hover:bg-green-800 text-white gap-2"
                            >
                                {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                                Start Execution
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Queue Sidebar */}
                        <div className="w-1/3 border-r bg-gray-50 overflow-y-auto p-4 flex flex-col gap-3">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Execution Queue</h3>
                            {queue.map((item, idx) => (
                                <div 
                                    key={item.id} 
                                    className={`p-3 rounded-lg border bg-white cursor-pointer transition-colors ${activeTestIndex === idx ? 'border-green-600 ring-1 ring-green-600' : 'hover:border-gray-300'}`}
                                    onClick={() => !isRunning && setActiveTestIndex(idx)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-sm line-clamp-1 pr-2">{item.title}</h4>
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-1 mb-3">{item.description}</p>
                                    <div className="flex justify-between items-center">
                                        <Badge variant="secondary" className="text-[10px]">{item.type}</Badge>
                                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                                            item.queueStatus === 'Passed' ? 'bg-green-100 text-green-700' :
                                            item.queueStatus === 'Failed' ? 'bg-red-100 text-red-700' :
                                            item.queueStatus === 'Running' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                            {item.queueStatus}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Active Test Area */}
                        <div className="w-2/3 flex flex-col p-6 bg-white overflow-hidden">
                            {activeTest ? (
                                <>
                                    <div className="mb-4">
                                        <h2 className="text-lg font-semibold text-gray-900">{activeTest.title}</h2>
                                        <p className="text-sm text-gray-600 mt-1">Expected: {activeTest.expectedResult || 'No specific result defined'}</p>
                                    </div>
                                    
                                    <div className="flex-1 bg-[#0a0a0a] rounded-lg border border-gray-800 flex flex-col overflow-hidden">
                                        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#111111]">
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-500 font-mono text-sm">&gt;_</span>
                                                <span className="text-green-500 font-medium text-sm">Console Terminal Output</span>
                                            </div>
                                            <Badge variant="outline" className="text-gray-400 border-gray-700 bg-transparent text-[10px] uppercase">
                                                {activeTest.queueStatus === 'Running' ? 'Executing' : activeTest.queueStatus === 'Queued' ? 'Idle' : 'Completed'}
                                            </Badge>
                                        </div>
                                        <div className="p-4 font-mono text-sm text-gray-300 overflow-y-auto flex-1 space-y-1">
                                            {activeTest.queueStatus === 'Queued' && (
                                                <div className="text-gray-500">Waiting to run...</div>
                                            )}
                                            {activeTest.queueStatus === 'Running' && (!activeTest.logs || activeTest.logs.length === 0) && (
                                                <div className="text-yellow-500 flex items-center gap-2">
                                                    <Loader2 className="w-3 h-3 animate-spin" /> Executing script in Browserbase...
                                                </div>
                                            )}
                                            {activeTest.logs && activeTest.logs.map((log, i) => (
                                                <div key={i} className={`
                                                    ${log.includes('[ERROR]') ? 'text-red-400' : 
                                                      log.includes('[WARN]') ? 'text-yellow-400' : 
                                                      log.includes('[SYSTEM]') ? 'text-blue-400' : 'text-gray-300'}
                                                `}>
                                                    {log}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-500">
                                    No test case selected
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t bg-gray-50 flex justify-end flex-shrink-0">
                    <Button variant="outline" onClick={handleClose} disabled={isRunning}>
                        Close & Refresh Status
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
