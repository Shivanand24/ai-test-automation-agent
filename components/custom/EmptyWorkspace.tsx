"use client";

import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { Link as LinkIcon } from "lucide-react";

function EmptyWorkspace() {
    return (
        <div className="flex flex-col mt-10 items-center justify-center">
            <Image
                src="/folder.png"
                alt="folder"
                width={70}
                height={70}
            />

            <h2 className="font-medium text-2xl mt-5 mb-4">
                No Repository Connected
            </h2>

            <p className="text-center mx-10 text-gray-500">
                Connect your GitHub account and add a repository to generate
                and run test cases.
            </p>

            <Button className="mt-5">
                <LinkIcon className="h-4 w-4 mr-2" />
                Connect Repository
            </Button>
        </div>
    );
}

export default EmptyWorkspace;