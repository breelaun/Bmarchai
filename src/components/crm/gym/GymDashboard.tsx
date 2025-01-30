import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MembersList } from "./members/MembersList";
import { ClassesList } from "./classes/ClassesList";
import { EquipmentList } from "./equipment/EquipmentList";
import { CheckInsList } from "./check-ins/CheckInsList";
import { MembershipPlans } from "./memberships/MembershipPlans";
import { Users, CalendarCheck, Dumbbell, ClipboardList, CreditCard } from "lucide-react";

const GymDashboard = () => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Check-ins</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment Status</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="check-ins">Check-ins</TabsTrigger>
          <TabsTrigger value="memberships">Membership Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <MembersList />
        </TabsContent>

        <TabsContent value="classes">
          <ClassesList />
        </TabsContent>

        <TabsContent value="equipment">
          <EquipmentList />
        </TabsContent>

        <TabsContent value="check-ins">
          <CheckInsList />
        </TabsContent>

        <TabsContent value="memberships">
          <MembershipPlans />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GymDashboard;