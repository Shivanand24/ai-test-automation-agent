"use client"

import React, { useEffect } from 'react'
import { useUser } from '@clerk/nextjs';
import axios from 'axios';

function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    console.log("Provider Loaded");
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            createNewUser();
        }
    }, [user]);

    const createNewUser = async () => {
        try {
            const email = user?.primaryEmailAddress?.emailAddress;
            const name = user?.fullName;

            if (!email) return;

            const result = await axios.post('/api/users', { name, email });
            console.log("Result", result.data);
        } catch (error) {
            console.error("Error creating user:", error);
        }
    }

    return (
        <div>{children}</div>
    )
}

export default Provider