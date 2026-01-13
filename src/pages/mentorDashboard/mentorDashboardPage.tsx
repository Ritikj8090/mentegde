import OngoingInternship from "./ongoingInternship"
import SheduleInternship from "./sheduleInternship"


const MentorDashboardPage = () => {
  return (
    <div className=' grid grid-cols-2 gap-3 h-full'>
      <OngoingInternship />
      <SheduleInternship />
    </div>
  )
}

export default MentorDashboardPage
