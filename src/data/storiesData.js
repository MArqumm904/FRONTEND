import axios from "axios";

export const fetchStories = async () => {
  try {
    console.log("Fetching stories...");
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return [];
    }

    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/stories`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Stories response:", response.data);

    if (response.data.status === "success") {
      return response.data.data;
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch stories:", error);
    console.error("Error response:", error.response?.data);
    return [];
  }
};

export const fetchUserStories = async (userId) => {
  try {
    console.log("Fetching user stories for userId:", userId);
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return [];
    }

    if (!userId) {
      console.error("No userId provided");
      return [];
    }

    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/user-stories/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("User stories response:", response.data);

    if (response.data.status === "success") {
      console.log("User stories data:", response.data.data);
      return response.data.data;
    }

    console.log("API returned non-success status:", response.data.status);
    return [];
  } catch (error) {
    console.error("Failed to fetch user stories:", error);
    console.error("Error response:", error.response?.data);
    return [];
  }
};
