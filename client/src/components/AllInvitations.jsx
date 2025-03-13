import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import InvitationSentTable from "./InvitationSentTable";
import useGetSentInvitations from "@/hooks/useGetSentInvitations";
import InvitersTable from "./admin/InvitersTable";
import useGetReceivedInvitations from "@/hooks/useGetReceivedInvitations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { markAllInvitationsAsRead } from "@/redux/invitationSlice";
import { Send, Inbox, Loader } from "lucide-react";

// Empty state for received invitations
const EmptyReceivedInvitations = () => (
  <div className="flex flex-col items-center justify-center p-8 my-7 text-center min-h-[400px] border-2 border-dashed rounded-lg">
    <div className="relative mb-4">
      <Inbox className="h-16 w-16 text-muted-foreground" />
    </div>
    <h3 className="text-xl font-semibold mb-2">No Invitations Yet</h3>
    <p className="text-muted-foreground mb-4 max-w-md">
      You have not received any project invitations yet. Browse available
      projects to get started with collaboration!
    </p>
  </div>
);

// Empty state for sent invitations
const EmptySentInvitations = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px] border-2 border-dashed rounded-lg">
    <div className="relative mb-4">
      <Send className="h-16 w-16 text-muted-foreground transform rotate-12" />
    </div>
    <h3 className="text-xl font-semibold mb-2">No Sent Invitations</h3>
    <p className="text-muted-foreground mb-4 max-w-md">
      You have not sent any invitations yet. Find talented people and invite them
      to join your projects!
    </p>
  </div>
);

const AllInvitations = () => {
  const dispatch = useDispatch();
  const { senders, loading: receivedLoading } = useSelector(
    (state) => state.invitation
  );
  const { allSentInvitations, loading: sentLoading } = useSelector(
    (state) => state.project
  );
  const [activeTab, setActiveTab] = useState("invitationsIn");

  useGetSentInvitations();
  useGetReceivedInvitations();

  useEffect(() => {
    dispatch(markAllInvitationsAsRead());
  }, [dispatch]);

  useEffect(() => {
    window.setActiveInvitationTab = setActiveTab;
    return () => {
      delete window.setActiveInvitationTab;
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab === "received") {
      setActiveTab("invitationsIn");
    } else if (tab === "sent") {
      setActiveTab("invitationsOut");
    }
  }, []);

  if (receivedLoading && sentLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4 sm:my-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 rounded-lg border border-muted bg-transparent">
          <TabsTrigger
            value="invitationsIn"
            className="data-[state=active]:bg-muted/20 data-[state=active]:text-foreground"
          >
            Received
          </TabsTrigger>
          <TabsTrigger
            value="invitationsOut"
            className="data-[state=active]:bg-muted/20 data-[state=active]:text-foreground"
          >
            Sent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invitationsIn" className="">
          {!senders || senders.length === 0 ? (
            <EmptyReceivedInvitations />
          ) : (
            <InvitersTable />
          )}
        </TabsContent>

        <TabsContent value="invitationsOut" className="my-4 sm:my-7">
          {!allSentInvitations || allSentInvitations.length === 0 ? (
            <EmptySentInvitations />
          ) : (
            <InvitationSentTable />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllInvitations;
