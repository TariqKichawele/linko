'use client'

import { Doc } from '@/convex/_generated/dataModel';
import { useUser } from '@clerk/nextjs';
import React, { useState } from 'react'
import { useChatContext } from 'stream-chat-react';
import { useCreateNewChat } from '@/hooks/useCreateNewChat';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from './ui/dialog';
import UserSearch from './UserSearch';
import Image from 'next/image';
import { XIcon } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { group } from 'console';

const NewChatDialog = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<Doc<'users'>[]>([]);
    const [groupName, setGroupName] = useState('');

    const createNewChat = useCreateNewChat();
    
    const { user } = useUser();
    const { setActiveChannel } = useChatContext();

    const handleSelectUser = (user: Doc<'users'>) => {
      if (!selectedUsers.find(u => u._id === user._id)) {
        setSelectedUsers((prev) => [...prev, user]);
      }
    };

    const removeUser = (userId: string) => {
      setSelectedUsers((prev) => prev.filter(u => u._id !== userId));
    }

    const handleOpenChange = (newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
        setSelectedUsers([]);
        setGroupName('');
      }
    }

    const handleCreateChat = async () => {
      const totalMembers = selectedUsers.length + 1;
      const isGroupChat = totalMembers > 2;

      const channel = await createNewChat({
        members: [
          user?.id as string,
          ...selectedUsers.map(user => user.clerkId),
        ],
        createdBy: user?.id as string,
        groupName: isGroupChat ? groupName.trim() || "" : "",
      });

      setActiveChannel(channel);

      setOpen(false);
      setSelectedUsers([]);
      setGroupName('');
    }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className='sm:max-w-[500px] max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
          <DialogDescription>
            Select users to start a new chat
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <UserSearch onSelectUser={handleSelectUser} className='w-full' />

          {selectedUsers.length > 0 && (
            <div className='space-y-3'>
              <h4 className='text-sm font-medium text-foreground'>
                Selected users ({selectedUsers.length})
              </h4>

              <div className='space-y-2 max-h-[200px] overflow-y-auto'>
                {selectedUsers.map((user) => (
                  <div
                    key={user._id}
                    className='flex items-center justify-between p-2 bg-muted/50 border border-border rounded-lg'
                  >
                    <div className='flex items-center space-x-2'>
                      <Image 
                        src={user.imageUrl}
                        alt={user.name}
                        width={32}
                        height={32}
                        className='size-6 rounded-full object-cover'
                      />
                      <div className='min-w-0 flex-1'>
                        <p className='text-sm font-medium text-foreground truncate'>
                          {user.name}
                        </p>
                        <p className='text-xs text-muted-foreground truncate'>
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeUser(user._id)}
                      className='text-muted-foreground hover:text-destructive transition-colors p-1'
                    >
                      <XIcon className='size-4' />
                    </button>
                  </div>
                ))}

                {selectedUsers.length > 1 && (
                  <div className='space-y-2'>
                    <label htmlFor="groupName" className='text-sm font-medium text-foreground'>
                      Group name (Optional)
                    </label>
                    <Input 
                      id='groupName' 
                      type='text'
                      placeholder='Enter group name (optional)'
                      value={groupName} 
                      onChange={(e) => setGroupName(e.target.value)} 
                      className='w-full'
                    />
                    <p className='text-xs text-muted-foreground'>
                      Leave empty to use default group name: &quot;Group chat (
                        {selectedUsers.length + 1} members)&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateChat}>
            Create Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NewChatDialog