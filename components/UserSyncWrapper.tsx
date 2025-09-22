'use client'

import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import React, { useCallback, useEffect, useState } from 'react'
import LoadingSpinner from './LoadingSpinner';
import streamClient from '@/lib/stream';
import { createToken } from '@/actions/createToken';

const UserSyncWrapper = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoaded: isUserLoaded } = useUser();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const createOrUpdateUser = useMutation(api.users.upsertUser);

    const syncUser = useCallback(async () => {
        if (!user?.id) return;

        try {
            setIsLoading(true);
            setError(null);

            const tokenProvider = async () => {
                if (!user?.id) {
                    throw new Error("User ID is required");
                };

                const token = await createToken(user.id);
                return token;
            }

            await createOrUpdateUser({
                clerkId: user.id,
                name: user.fullName || user.firstName || user.emailAddresses[0].emailAddress || "Unknown User",
                email: user.emailAddresses[0].emailAddress || "Unknown Email",
                imageUrl: user.imageUrl || "",
            });
            
            await streamClient.connectUser(
                {
                    id: user.id,
                    name: user.fullName || user.firstName || user.emailAddresses[0].emailAddress || "Unknown User",
                    image: user.imageUrl || "",
                },
                tokenProvider
            )
        } catch (error) {
            setError("Failed to sync user data");
            console.error("Error syncing user data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [createOrUpdateUser, user]);

    const disconnectUser = useCallback(async () => {
        try {
            await streamClient.disconnectUser();
        } catch (error) {
            setError("Failed to disconnect user");
            console.error("Error disconnecting user:", error);
        }
    }, []);

    useEffect(() => {
        if (!isUserLoaded) return;

        if (user) {
            syncUser();
        } else {
            disconnectUser();
            setIsLoading(false);
        }

        // Cleanup function to disconnect user when the component unmounts
        return () => {
            if (user) {
                disconnectUser();
            }
        }
        
    }, [user, isUserLoaded, syncUser, disconnectUser])

    if (!isUserLoaded || isLoading) {
        return (
            <LoadingSpinner 
                size='lg'
                message={!isUserLoaded ? "Loading..." : "Syncing user data..."}
                className='min-h-screen'
            />
        )
    }

    if (error) {
        return (
            <div className='flex-1 items-center justify-center bg-white px-6'>
                <p className='text-red-500 text-lg font-semibold mb-2'>
                    Sync Error
                </p>
                <p className='text-gray-600 text-center mb-4'>{error}</p>
                <p className='text-gray-500 text-sm text-center'>
                    Please refresh the page and try again.
                </p>
            </div>
        )
    }
  return (
    <div>{children}</div>
  )
}

export default UserSyncWrapper