import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const Members = ({ onClose, group }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = Number(localStorage.getItem("user_id"));
  const [removingMemberId, setRemovingMemberId] = useState(null);
  
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);

        const memberIds = Object.keys(group.members || {}).filter(id => group.members[id] === true);
        console.log("memberIds" , memberIds);
        if (memberIds.length === 0) {
          setMembers([]);
          setLoading(false);
          return;
        }


        // ✅ Backend ko POST request bhejte hain members array ke sath
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/group-messages/${
            group.id
          }/members`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              members: memberIds, // sirf IDs bhejte hain
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch group members");
        }

        const data = await response.json();
        console.log("API Response Members:", data.members);

        // ✅ Backend se jo members aaye unhe map karna
        let groupMembers = data.members.map((member) => ({
          id: member.id,
          name: member.name,
          profilePic: member.profile_photo
            ? `${import.meta.env.VITE_API_BASE_URL.replace(
                "/api",
                ""
              )}/storage/${member.profile_photo}`
            : null,
          isAdmin: member.id === group.created_by,
        }));

        setMembers(groupMembers);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [group.members]);

   const handleRemoveMember = async (memberId) => {
    try {
      setRemovingMemberId(memberId);
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/group-chats/remove-member`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            group_id: group.id,
            member_id: memberId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Member removed successfully");
        // Remove the member from local state for immediate UI update
        setMembers(prev => prev.filter(member => member.id !== memberId));
      } else {
        throw new Error(data.message || "Failed to remove member");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error(error.message || "Failed to remove member");
    } finally {
      setRemovingMemberId(null);
    }
  };

  useEffect(() => {
    console.log("got members", members);
  }, [members]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl h-[30rem] mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Members</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-7 h-7 text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <img
                      src={member.profilePic || "/placeholder.svg"}
                      alt={member.name}
                      className="w-14 h-14 rounded-full object-cover mr-3"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {member.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {member.id === group.created_by ? "Admin" : "Member"}
                      </p>
                    </div>
                  </div>
                  {currentUserId === group.created_by && !member.isAdmin && (
                    <button onClick={() => handleRemoveMember(member.id)} className="text-sm bg-[#0017E7] text-white px-4 py-1.5 rounded-lg">
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Members;
