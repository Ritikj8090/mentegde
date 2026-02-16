
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import OngoingInternship from './ongoingInternship'
import SearchInternship from './searchInternship'

const UserDashboardPage = () => {
  return (
    <div className="h-full w-full">
      <Tabs defaultValue="Ongoing" className="w-full block md:hidden space-y-2">
        {/* make tabs full width */}
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger className="w-full" value="Ongoing">
            Ongoing Internships
          </TabsTrigger>

          <TabsTrigger className="w-full" value="Scheduled">
            Search Internships
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Ongoing">
          <OngoingInternship />
        </TabsContent>

        <TabsContent value="Scheduled">
          <SearchInternship />
        </TabsContent>
      </Tabs>
      <div className="md:grid hidden grid-cols-2 gap-3 h-full w-full">
        <OngoingInternship />
        <SearchInternship />
      </div>
    </div>
  )
}

export default UserDashboardPage
