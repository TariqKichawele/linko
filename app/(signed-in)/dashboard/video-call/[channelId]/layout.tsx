'use client'

import React, { 
    useCallback, 
    useEffect, 
    useMemo, 
    useState 
} from 'react'
import { 
    Call, 
    StreamCall, 
    StreamTheme, 
    StreamVideo, 
    StreamVideoClient,
    CallingState
} from '@stream-io/video-react-sdk'
import { useUser } from '@clerk/nextjs'
import { useParams } from 'next/navigation'
import { createToken } from '@/actions/createToken'
import { StatusCard } from '@/components/StatusCard'
import { AlertTriangle, Video } from 'lucide-react'
import { InlineSpinner } from '@/components/LoadingSpinner'
import "@stream-io/video-react-sdk/dist/css/styles.css"

if (!process.env.NEXT_PUBLIC_STREAM_API_KEY) {
    throw new Error("NEXT_PUBLIC_STREAM_API_KEY is not set");
}

const VideoCallLayout = ({ children }: { children: React.ReactNode }) => {
    const { user } = useUser();
    const { channelId } = useParams();

    const [call, setCall] = useState<Call | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [client, setClient] = useState<StreamVideoClient | null>(null);

    const streamUser = useMemo(() => {
        if (!user) return null;

        return {
            id: user.id,
            name: user.fullName || user.firstName || user.emailAddresses[0].emailAddress || "Unknown User",
            image: user.imageUrl || "",
            type: "authenticated" as const,
        }
    }, [user]);

    const tokenProvider = useCallback(async () => {
        if (!user?.id) {
            throw new Error("User ID is required");
        }
        return await createToken(user.id);
    }, [user?.id]);

    useEffect(() => {
        if (!streamUser) {
            setClient(null);
            return;
        }

        const newClient = new StreamVideoClient({
            apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY as string,
            user: streamUser,
            tokenProvider,
        });

        setClient(newClient);

        return () => {
            newClient.disconnectUser().catch(console.error);
        }
    }, [streamUser, tokenProvider]);

    useEffect(() => {
        if (!channelId || !client) return;

        setError(null);

        const streamCall = client.call("default", channelId as string);

        const joinCall = async () => {
            try {
                await streamCall.join({ create: true });
                setCall(streamCall);
            } catch (error) {
                setError("Failed to join call");
                console.error("Error joining call:", error);
            }    
        }

        joinCall();

        // Cleanup function to leave call when the component unmounts
        return () => {
            if (streamCall && streamCall.state.callingState === CallingState.JOINED) {
                streamCall.leave();
            }
        }
    }, [channelId, client])

    if (!client) {
        return (
            <StatusCard
                title="Initializing client..."
                description='Setting up video call connection...'
                className='min-h-screen bg-blue-50'
            >
                <InlineSpinner size='lg' />
            </StatusCard>
        )
    }

    if (!call) {
        return (
            <StatusCard
                title="Joining call..."
                className='min-h-screen bg-green-50'
            >
                <div className='animate-bounce size-16 mx-auto'>
                    <div className='size-16 bg-green-200 rounded-full flex items-center justify-center'>
                        <Video className='size-8 text-green-600'/>
                    </div>
                </div>
                <div className='text-green-600 font-mono text-sm bg-green-100 px-3 py-1 rounded-full inline-block'>
                    Call ID: {channelId}
                </div>
            </StatusCard>
        )
    }

    if (error) {
        return (
            <StatusCard
                title="Call Error"
                description={error}
                className='min-h-screen bg-red-50'
                action={
                    <button
                        onClick={() => {
                            window.location.reload();
                        }}
                        className='w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg
                        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                    >
                        Retry
                    </button>
                }
            >
                <div className="size-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <AlertTriangle className="size-8 text-red-600"/>
                </div>
            </StatusCard>
        )
    }

  return (
    <StreamVideo client={client}>
        <StreamTheme className='text-white'>
            <StreamCall call={call}>
                {children}
            </StreamCall>
        </StreamTheme>
    </StreamVideo>
  )
}

export default VideoCallLayout