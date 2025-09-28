'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk'
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/components/ui/sidebar';
import { StatusCard } from '@/components/StatusCard';
import { InlineSpinner } from '@/components/LoadingSpinner';
import { Check, Copy } from 'lucide-react';


const VideoPage = () => {
  const { useCallCallingState, useParticipants } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participants = useParticipants();

  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const { setOpen } = useSidebar();

  const isLoadingState = useMemo(() => {
    return [CallingState.JOINING, CallingState.RECONNECTING].includes(callingState);
  }, [callingState]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareLink(window.location.href);
    }
  }, []);

  useEffect(() => {
    console.log('Participants update:', participants);
  }, [participants]);

  const handleLeave = () => {
    router.push('/dashboard');
    setOpen(true);
  };

  const copyToClipboard = async () => {
    try {
      if (!shareLink) return;
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      window.alert("Failed to copy to clipboard. Please try again.");
    }
  }

  if (isLoadingState) {
    return (
      <StatusCard
        title={callingState === CallingState.RECONNECTING ? 'Reconnecting to call...' : 'Joining call...'}
        className={callingState === CallingState.RECONNECTING ? 'bg-yellow-50 rounded-lg border border-yellow-200' : 'bg-gray-50 rounded-lg'}
        description={callingState === CallingState.RECONNECTING ? 'Please wait while we reconnect to the call...' : 'Please wait while we join the call...'}
      >
        {callingState === CallingState.RECONNECTING ? (
          <div className='animate-pulse rounded-full size-12 bg-yellow-400 mx-auto'></div>
        ) : (
          <InlineSpinner size='lg' />
        )}
      </StatusCard>
    )
  }

  if (callingState !== CallingState.JOINED) {
    return (
      <StatusCard
        title='Unable to join call'
        description={`Current status: ${callingState}`}
        className='bg-red-50 rounded-lg border border-red-200'
      >
        <div className='animate-pulse rounded-full size-12 bg-red-400 mx-auto'></div>
      </StatusCard>
    )
  }


  return (
    <div className='flex flex-col'>
      <div className='flex-1 relative'>
        <SpeakerLayout />
      </div>
      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10'>
        <CallControls onLeave={handleLeave} />
      </div>

      {participants.length === 1 && (
        <div className='absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
          <div className='bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl'>
            <div className='text-center space-y-6'>
              <div className='size-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto'>
                <Copy className='size-8 text-blue-600'/>
              </div>

              <div className='space-y-2'>
                <h2 className='text-2xl font-bold text-gray-900'>
                  Waiting for others to join...
                </h2>
                <p className='text-gray-600'>
                  Share this link with others to join the call:
                </p>
              </div>

              <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
                <div className='flex items-center gap-3'>
                  <div className='flex-1 text-sm text-gray-700 font-mono break-all'>
                    {shareLink || 'Loading link...'}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200
                    flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap'
                  >
                    {copied ? (
                      <>
                        <Check className='size-4'/>
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className='size-4'/>
                        Copy link
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className='text-gray-500 text-sm'>
                Others will be able to join using this link:
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoPage