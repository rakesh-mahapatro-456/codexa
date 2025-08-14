import React from 'react'
import UserLayout from '@/components/layout/UserLayout'
import ProfileCard from '@/components/custom/cards/ProfileCard'
import ProtectedRoute from '@/components/ProtectedRoute'


export default function index() {
  
  return (
    <ProtectedRoute>
      <UserLayout>
    <ProfileCard />
    </UserLayout>
    </ProtectedRoute>
  )
}
