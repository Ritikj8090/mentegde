import React from 'react'
import OngoingInternship from './ongoingInternship'
import SearchInternship from './searchInternship'

const UserDashboardPage = () => {
  return (
    <div className=' grid grid-cols-2 gap-3 h-full'>
        <OngoingInternship />
        <SearchInternship />
      
    </div>
  )
}

export default UserDashboardPage
