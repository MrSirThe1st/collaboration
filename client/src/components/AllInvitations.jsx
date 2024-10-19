import React from "react";
import InvitationSentTable from "./InvitationSentTable";
import useGetSentInvitations from "@/hooks/useGetSentInvitations";
import InvitersTable from "./admin/InvitersTable";
import useGetReceivedInvitations from "@/hooks/useGetReceivedInvitations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const AllInvitations = () => {
  useGetSentInvitations();
  useGetReceivedInvitations();
  return (
    <div>
      <Tabs defaultValue="invitationsIn">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="invitationsIn">Invitations received</TabsTrigger>
          <TabsTrigger value="invitationsOut">Invitations sent</TabsTrigger>
        </TabsList>

        <TabsContent value="invitationsIn">
          <InvitersTable />
        </TabsContent>

        <TabsContent value="invitationsOut">
          <InvitationSentTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllInvitations;
