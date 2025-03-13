import InvitersTable from './admin/InvitersTable';
import useGetReceivedInvitations from '@/hooks/useGetReceivedInvitations';


const Invitations = () => {
  useGetReceivedInvitations();
  return (
    <div>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl">
        <InvitersTable />
      </div>
    </div>
  );
}

export default Invitations
