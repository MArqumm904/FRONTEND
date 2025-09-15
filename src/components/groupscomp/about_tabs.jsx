import { useState, useEffect } from "react";
import { Plus, Edit3 } from "lucide-react";
import axios from "axios";
import DescriptionModal from "../groupscomp/descriptionmodal";
import CategoryModal from "../groupscomp/categorymodal";
import HistoryModal from "../groupscomp/historymodal";

const SimpleAboutTab = ({ groupId,owner_id }) => {
  const [description, setDescription] = useState("");
  const [groupCategory, setGroupCategory] = useState("");
  const [groupHistory, setGroupHistory] = useState("");
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("group id receive on about tab of groups:", groupId);
  console.log("owner id receive on about tab of groups:", owner_id);
  const user_id = localStorage.getItem('user_id');


  useEffect(() => {
    const fetchGroupData = async () => {
      if (!groupId || !owner_id) return;

      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/groups/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              user_id: owner_id === user_id ? user_id : owner_id
            },
          }
        );
        const groupData = response.data.data;

        if (groupData.group_description) {
          setDescription(groupData.group_description);
        }

        if (groupData.group_type) {
          setGroupCategory(groupData.group_type);
        }

        if (groupData.group_history) {
          setGroupHistory(groupData.group_history);
        }

        console.log("Fetched group data:", groupData);
      } catch (err) {
        console.error("Error fetching group data:", err);
        setError("Failed to load group information");
      } finally {
        setLoading(false);
      }
    };
    fetchGroupData();
  }, [groupId]);

  // Handle save functions to update both state and API (optional)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const handleDescriptionSave = async (newDescription) => {
    setDescription(newDescription);
    try {
      await axios.post(
        `${API_BASE_URL}/groups/${groupId}`,
        {
          group_description: newDescription,
        },
        axiosConfig
      );
    } catch (err) {
      console.error("Error updating description:", err);
    }
  };

  const handleCategorySave = async (newCategory) => {
    setGroupCategory(newCategory);
    try {
      await axios.post(
        `${API_BASE_URL}/groups/${groupId}`,
        {
          group_type: newCategory,
        },
        axiosConfig
      );
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  const handleHistorySave = async (newHistory) => {
    setGroupHistory(newHistory);
    try {
      await axios.post(
        `${API_BASE_URL}/groups/${groupId}`,
        {
          group_history: newHistory,
        },
        axiosConfig
      );
    } catch (err) {
      console.error("Error updating history:", err);
    }
  };

  const SectionCard = ({
    title,
    content,
    onAddClick,
    onEditClick,
    isGroupCategory = false,
  }) => (
    <div className="py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[1.7rem] font-semibold text-gray-900">{title}</h3>
        {content && owner_id === user_id && (
          <button
            onClick={onEditClick}
            className="bg-white border border-[#707070] p-2 rounded-full hover:bg-gray-50 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>

      {content ? (
        isGroupCategory ? (
          <p className="text-gray-700 text-lg whitespace-pre-line">
            This is a <span className="font-bold text-black">{content}</span>{" "}
            group — anyone can view posts and join freely. Content is visible to
            all users, even those who aren't members.
          </p>
        ) : (
          <p className="text-gray-700 text-lg whitespace-pre-line">{content}</p>
        )
      ) : !content && owner_id === user_id ? (
        <div className="flex items-center space-x-2 mt-5">
          <button
            onClick={onAddClick}
            className="flex items-center space-x-2 text-[#0017e7] text-lg font-medium hover:text-[#0012b7] transition-colors"
          >
            <div className="w-6 h-6 rounded-full border border-[#0017e7] flex items-center justify-center">
              <Plus className="w-4 h-4 text-[#0017e7]" />
            </div>
            <span>Add Overview</span>
          </button>
        </div>
      ): null}
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="mx-auto mt-5 border border-[#7c87bc] rounded-lg">
        <div className="flex justify-center items-center py-10">
          <svg
            className="animate-spin h-8 w-8 text-[#0017e7]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mx-auto mt-5 border border-[#7c87bc] rounded-lg">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-7 py-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-[#0017e7] hover:text-[#0012b7]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-5 border border-[#7c87bc] rounded-lg">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Content */}
        <div className="px-7 py-3">
          {/* Description Section */}
          <SectionCard
            title="Description"
            content={description}
            onAddClick={() => setShowDescriptionModal(true)}
            onEditClick={() => setShowDescriptionModal(true)}
          />

          {/* Group Category Section */}
          <SectionCard
            title="Group Category"
            content={groupCategory}
            onAddClick={() => setShowCategoryModal(true)}
            onEditClick={() => setShowCategoryModal(true)}
            isGroupCategory={true}
          />

          {/* Group History Section */}
          <SectionCard
            title="Group History"
            content={groupHistory}
            onAddClick={() => setShowHistoryModal(true)}
            onEditClick={() => setShowHistoryModal(true)}
          />
        </div>
      </div>

      {/* Modals */}
      <DescriptionModal
        isOpen={showDescriptionModal}
        onClose={() => setShowDescriptionModal(false)}
        onSave={handleDescriptionSave}
        title="Description"
        initialText={description}
      />

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSave={handleCategorySave}
        title="Group Category"
        initialText={groupCategory}
      />

      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        onSave={handleHistorySave}
        title="Group History"
        initialText={groupHistory}
      />
    </div>
  );
};

export default SimpleAboutTab;
