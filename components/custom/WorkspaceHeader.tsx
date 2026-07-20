import React from 'react';
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';

function WorkspaceHeader() {
    return (
        <div className="flex w-full justify-between p-4">
            {/* Logo */}
            <Image
                src="/logo.svg"
                alt="logo"
                width={80}
                height={80}
            />

            {/* Menu Options */}
            <ul className="flex gap-8 text-xl">
                <li className="hover:text-blue-600 cursor-pointer">
                    Workspace
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                    Pricing
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                    Support
                </li>
            </ul>

            {/* User Button */}
            <UserButton />
        </div>
    );
}

export default WorkspaceHeader;