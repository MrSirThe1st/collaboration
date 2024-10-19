import React from "react";
import InvitationSentTable from "./InvitationSentTable";
import useGetSentInvitations from "@/hooks/useGetSentInvitations";

const InvitationsOut = () => {
  useGetSentInvitations();
  return (
    <div>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl">
        <InvitationSentTable />
      </div>
    </div>
  );
};

export default InvitationsOut;
