'use client'

import React from 'react'
import UserSyncWrapper from '@/components/UserSyncWrapper'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserSyncWrapper>
        {children}
    </UserSyncWrapper>
  )
}

export default Layout