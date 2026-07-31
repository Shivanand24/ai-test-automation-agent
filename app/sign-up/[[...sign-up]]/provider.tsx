"use client"

import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { UserDeatailContext } from '@/context/UserDeatailContext';

function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const [userDetails, setUserDetails] = useState<any>();

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
            setUserDetails(result.data?.user || result.data);
        } catch (error) {
            console.error("Error creating user:", error);
        }
    }

    return (
        <UserDeatailContext.Provider value={{ userDetails, setUserDetails }}>
            <div>{children}</div>
        </UserDeatailContext.Provider>
    )
}

export default Provider