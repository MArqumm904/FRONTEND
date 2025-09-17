import React, { useState, useEffect } from "react";
import { CirclePlus, Pencil, Plus, Trash } from "lucide-react";
import OverviewModal from "./about_overview_tab";
import AddEducation from "./add_education";
import EducationCard from "./added_education_card";
import AddCertificate from "./add_certificate";
import CertificateCard from "./certificate_card";
import AddSkill from "./add_skill";
import SkillCard from "./added_skill_card";
import DeleteModal from "./delete_modal";
import axios from "axios";
import ContactInfo from './ContactInfo';

const ProfileAbout = ({user_id}) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [overviewText, setOverviewText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState({
    type: "",
    itemId: null,
  });
  const [showEducation, setEducation] = useState(false);
  const [educationList, setEducationList] = useState([]);
  const [showAllEducation, setShowAllEducation] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [showCertificate, setCertificate] = useState(false);
  const [certificateList, setCertificateList] = useState([]);
  const [editingEducation, setEditingEducation] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [isCertificateEditMode, setIsCertificateEditMode] = useState(false);
  const [showSkill, setShowSkill] = useState(false);
  const [skillList, setSkillList] = useState([]);
  const [editingSkill, setEditingSkill] = useState(null);
  const [isSkillEditMode, setIsSkillEditMode] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [showLanguageInput, setShowLanguageInput] = useState(false);
  const [languageInput, setLanguageInput] = useState("");
  const [websiteLinks, setWebsiteLinks] = useState([]);
  const [showWebsiteInput, setShowWebsiteInput] = useState(false);
  const [websiteInput, setWebsiteInput] = useState("");
  const [socialLinks, setSocialLinks] = useState([]);
  const [showSocialInput, setShowSocialInput] = useState(false);
  const [socialInput, setSocialInput] = useState("");
  const [gender, setGender] = useState("");
  const [showGenderInput, setShowGenderInput] = useState(false);
  const [dob, setDob] = useState("");
  const [showDobInput, setShowDobInput] = useState(false);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [loadingEducation, setLoadingEducation] = useState(false);
  const [loadingCertificates, setLoadingCertificates] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const authenticatedUser = localStorage.getItem("user_id");

  // Function to fetch education data
  const fetchEducation = async () => {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    if (!userId || !token) return;

    setLoadingEducation(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/about/education/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Education API Response:", res.data);
      let data = res.data;
      if (Array.isArray(data)) {
        setEducationList(data);
      } else if (Array.isArray(data.education)) {
        setEducationList(data.education);
      } else if (data.education) {
        setEducationList([data.education]);
      } else {
        setEducationList([]);
      }
    } catch (error) {
      console.error("Education fetch error:", error);
      setEducationList([]);
    } finally {
      setLoadingEducation(false);
    }
  };

  // Function to fetch certificates
  const fetchCertificates = async () => {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    if (!userId || !token) return;

    setLoadingCertificates(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/about/certification/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Certificates API Response:", res.data);
      let data = res.data;
      if (Array.isArray(data)) {
        setCertificateList(data);
      } else if (Array.isArray(data.certificates)) {
        setCertificateList(data.certificates);
      } else if (data.certificates) {
        setCertificateList([data.certificates]);
      } else {
        setCertificateList([]);
      }
    } catch (error) {
      console.error("Certificates fetch error:", error);
      setCertificateList([]);
    } finally {
      setLoadingCertificates(false);
    }
  };

  // Function to fetch skills
  const fetchSkills = async () => {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    if (!userId || !token) return;

    setLoadingSkills(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/about/skills/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let data = res.data;
      if (Array.isArray(data)) {
        setSkillList(data);
      } else if (Array.isArray(data.skills)) {
        setSkillList(data.skills);
      } else if (data.skills) {
        setSkillList([data.skills]);
      } else {
        setSkillList([]);
      }
    } catch (error) {
      console.error("Skills fetch error:", error);
      setSkillList([]);
    } finally {
      setLoadingSkills(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Overview Tab
    if (activeTab === "Overview") {
      if (!user_id || !token) {
        setLoadingOverview(false);
        return;
      }
      setLoadingOverview(true);
      axios
        .get(`${API_BASE_URL}/about/overview/${user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setOverviewText(res.data.description || ""))
        .catch(() => setOverviewText(""))
        .finally(() => setLoadingOverview(false));
    }

    // Education Tab
    if (activeTab === "Education") {
      fetchEducation();
      fetchCertificates();
    }

    // Skill Tab
    if (activeTab === "Skill") {
      fetchSkills();
    }
  }, [activeTab, API_BASE_URL]);

  // GET USER PROFILE
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    // if (!userId) return;
    fetch(`${import.meta.env.VITE_API_BASE_URL}/user/profile/${user_id}`)
      .then((res) => res.json())
      .then((data) => setUserProfile(data.user))
      .catch(() => setUserProfile(null));
  }, []);

  // MODAL OPEN CLOSE FUNCTIONS
  useEffect(() => {
    if (showModal || showEducation || showCertificate || showSkill || showDeleteModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showModal, showEducation, showCertificate, showSkill, showDeleteModal]);

  const tabs = ["Overview", "Education", "Skill", "Info"];

  // SAVE EDUCATION
  const handleEducationSave = async (educationData) => {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;

    try {
      if (
        isEditMode &&
        editingEducation !== null &&
        educationList[editingEducation]?.id
      ) {
        // Edit mode: PUT request
        const educationId = educationList[editingEducation].id;
        await axios.put(
          `${API_BASE_URL}/about/education/${educationId}`,
          { ...educationData, user_id: userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${API_BASE_URL}/about/education`,
          { ...educationData, user_id: userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      // Refresh education data after save
      fetchEducation();
    } catch (error) {
      console.error("Error saving education:", error);
    } finally {
      setEducation(false);
      setEditingEducation(null);
      setIsEditMode(false);
    }
  };

  // SAVE CERTIFICATE
  const handleCertificateSave = async (certificateData) => {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
  
    try {
      const isEditing = isCertificateEditMode && editingCertificate !== null && certificateList[editingCertificate]?.id;
      const certificateId = isEditing ? certificateList[editingCertificate].id : null;
      
      // Check if we have a new photo file
      const hasNewPhoto = certificateData.certificate_photo instanceof File;
      
      let requestData, headers;
      
      if (hasNewPhoto) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append("title", certificateData.title || "");
        formData.append("organization", certificateData.organization || "");
        formData.append("start_year", certificateData.start_year || "");
        formData.append("end_year", certificateData.end_year || "");
        formData.append("description", certificateData.description || "");
        formData.append("user_id", userId);
        formData.append("certificate_photo", certificateData.certificate_photo);
        
        requestData = formData;
        headers = { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" };
      } else {
        // Use JSON for text-only data
        requestData = {
          title: certificateData.title,
          organization: certificateData.organization,
          start_year: certificateData.start_year,
          end_year: certificateData.end_year,
          description: certificateData.description,
          user_id: userId
        };
        headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
      }
  
      // Make API call
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/about/certification/${certificateId}`, requestData, { headers });
      } else {
        await axios.post(`${API_BASE_URL}/about/certification`, requestData, { headers });
      }
  
      fetchCertificates();
    } catch (error) {
      console.error("Error saving certificate:", error);
      if (error.response?.data?.errors) {
        alert("Validation errors: " + JSON.stringify(error.response.data.errors));
      }
    } finally {
      setCertificate(false);
      setEditingCertificate(null);
      setIsCertificateEditMode(false);
    }
  };

  const handleEducationEdit = (education, index) => {
    console.log("Editing education:", education, "at index:", index);
    setEditingEducation(index);
    setIsEditMode(true);
    setEducation(true);
  };

  const handleCertificateEdit = (certificate, index) => {
    console.log("Editing certificate:", certificate, "at index:", index);
    setEditingCertificate(index);
    setIsCertificateEditMode(true);
    setCertificate(true);
  };

  const handleAddEducation = () => {
    setEditingEducation(null);
    setIsEditMode(false);
    setEducation(true);
  };

  const handleAddCertificate = () => {
    setEditingCertificate(null);
    setIsCertificateEditMode(false);
    setCertificate(true);
  };

  const handleCloseEducationModal = () => {
    setEducation(false);
    setEditingEducation(null);
    setIsEditMode(false);
  };

  const handleCloseCertificateModal = () => {
    setCertificate(false);
    setEditingCertificate(null);
    setIsCertificateEditMode(false);
  };

  // SAVE SKILL
  const handleSkillSave = async (skillData) => {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;

    try {
      if (
        isSkillEditMode &&
        editingSkill !== null &&
        skillList[editingSkill]?.id
      ) {
        const skillId = skillList[editingSkill].id;
        await axios.put(
          `${API_BASE_URL}/about/skills/${skillId}`,
          { ...skillData, user_id: userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${API_BASE_URL}/about/skills`,
          { ...skillData, user_id: userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchSkills();
    } catch (error) {
      console.error("Error saving skill:", error);
      if (error.response?.data?.errors) {
        console.error("Validation errors:", error.response.data.errors);
      }
    } finally {
      setShowSkill(false);
      setEditingSkill(null);
      setIsSkillEditMode(false);
    }
  };

  const handleAddSkill = () => {
    setEditingSkill(null);
    setIsSkillEditMode(false);
    setShowSkill(true);
  };

  const handleSkillEdit = (skill, idx) => {
    setEditingSkill(idx);
    setIsSkillEditMode(true);
    setShowSkill(true);
  };

  const handleCloseSkillModal = () => {
    setShowSkill(false);
    setEditingSkill(null);
    setIsSkillEditMode(false);
  };

  const handleAddLanguageClick = () => {
    setShowLanguageInput(true);
    setLanguageInput("");
  };

  const handleSaveLanguage = () => {
    if (languageInput.trim() !== "") {
      setLanguages([...languages, languageInput.trim()]);
    }
    setShowLanguageInput(false);
    setLanguageInput("");
  };

  // SAVE OVERVIEW
  const handleSaveOverview = (text) => {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    if (!userId || !token) return;

    const method = overviewText ? "put" : "post";
    const url = overviewText
      ? `${API_BASE_URL}/about/overview/${userId}`
      : `${API_BASE_URL}/about/overview`;

    axios({
      method: method,
      url: url,
      data: { description: text },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setOverviewText(res.data.description || text);
        setShowModal(false);
      })
      .catch((err) => {
        console.error("Error saving overview:", err);
      });
  };

  // UNIVERSAL DELETE MODAL OPENER
  const openDeleteModal = (type, itemId = null) => {
    setDeleteModalData({ type, itemId });
    setShowDeleteModal(true);
  };

  // UNIVERSAL DELETE FUNCTION
  const handleDeleteItem = (type, itemId = null) => {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;

    let url;
    let successCallback;

    switch (type) {
      case "overview":
        url = `${API_BASE_URL}/about/overview/${userId}`;
        successCallback = () => {
          setOverviewText("");
          setShowDeleteModal(false);
        };
        break;
      case "education":
        url = `${API_BASE_URL}/about/education/${itemId}`;
        successCallback = () => {
          fetchEducation(); // Refresh education data after delete
          setShowDeleteModal(false);
        };
        break;
      case "certificate":
        url = `${API_BASE_URL}/about/certification/${itemId}`;
        successCallback = () => {
          fetchCertificates(); // Refresh certificate data after delete
          setShowDeleteModal(false);
        };
        break;
      case "skill":
        url = `${API_BASE_URL}/about/skills/${itemId}`;
        successCallback = () => {
          fetchSkills(); // Refresh skills data after delete
          setShowDeleteModal(false);
        };
        break;
      default:
        console.error("Unknown delete type:", type);
        return;
    }

    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        successCallback();
      })
      .catch((err) => {
        console.error(`Error deleting ${type}:`, err);
      });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-sf font-semibold text-gray-900 mb-6 -mt-3">
              Hello, I'm {userProfile?.name}.
            </h3>
            {loadingOverview ? (
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
            ) : overviewText ? (
              <div className="relative">
                <p className="text-gray-700 text-lg font-sf whitespace-pre-line">
                  {overviewText}
                </p>
                {/* Swap the positions and styles of Edit and Delete buttons */}
                {authenticatedUser === user_id && (
                  <>
                <button
                  onClick={() => openDeleteModal("overview")}
                  className="absolute -top-10 border rounded-full border-[#ff4d4f] right-0 p-2 text-red-500 hover:text-red-700"
                >
                  <Trash className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="absolute -top-10 border rounded-full border-[#707070] right-12 p-2 text-gray-500 hover:text-gray-700"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                </>
              )}
              </div>
            ) : authenticatedUser === user_id ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <CirclePlus className="w-12 h-12 text-[#0017e7]" />
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="text-[#0017e7] font-medium hover:text-[#0013bf] transition-colors"
                >
                  Add Overview
                </button>
              </div>
            ) : null}
          </div>
        );
      case "Education":
        return (
          <div className="space-y-4">
            {loadingEducation || loadingCertificates ? (
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
            ) : (
              <>
                {/* Education heading - Show above Add Education box when entries exist */}
                {educationList.length > 0 && (
                  <h2 className="text-2xl font-sf font-semibold text-gray-900 mb-4">
                    Education
                  </h2>
                )}

                {authenticatedUser === user_id && (
                <div className="border border-[#000] rounded-lg p-6 bg-gray-50">
                  <h3 className="text-lg font-sf font-semibold text-gray-900 mb-2">
                    Add Education
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 font-sf">
                    Show your academic background to build trust with employers
                    or clients.
                  </p>
                  <button
                    onClick={handleAddEducation}
                    className="bg-[#0017e7] mt-7 font-sf text-white px-4 py-2 rounded-md text-sm hover:bg-[#0013bf] transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Education
                  </button>
                </div>
              )}

                {/* Show added education entries */}
                {educationList.length > 0 && (
                  <div className="space-y-4">
                    {/* Show only first education or all if showAllEducation is true */}
                    {(showAllEducation
                      ? educationList
                      : educationList.slice(0, 1)
                    ).map((education, index) => (
                      <EducationCard
                        key={index}
                        education={education}
                        onEdit={() => handleEducationEdit(education, index)}
                        onDelete={() =>
                          openDeleteModal("education", education.id)
                        }
                        authenticatedUser={authenticatedUser}
                        user_id={user_id}
                      />
                    ))}

                    {/* Show More/Show Less button only if there are more than 1 education entries */}
                    {educationList.length > 1 && (
                      <button
                        onClick={() => setShowAllEducation(!showAllEducation)}
                        className="text-[#000] font-sf text-sm px-4 py-2 border border-black rounded-md hover:bg-gray-50 transition-colors"
                      >
                        {showAllEducation ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </div>
                )}

                {/* Certification heading - Show above Add Certification box when entries exist */}
                {certificateList.length > 0 && (
                  <h2 className="text-2xl font-sf font-semibold text-gray-900 mb-4">
                    Certification
                  </h2>
                )}

                {/* Add Certification Box */}
                {authenticatedUser === user_id && (
                <div className="border border-[#000] rounded-lg p-6 bg-gray-50">
                  <h3 className="text-lg font-sf font-semibold text-gray-900 mb-2">
                    Add Certification
                  </h3>
                  <p className="text-gray-600 font-sf text-sm mb-4">
                    Show your certifications to build trust with employers or
                    clients.
                  </p>
                  <button
                    onClick={handleAddCertificate}
                    className="bg-[#0017e7] mt-7 font-sf text-white px-4 py-2 rounded-md text-sm hover:bg-[#0013bf] transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Certification
                  </button>
                </div>
              )}

                {/* Show added certificate entries */}
                {certificateList.length > 0 && (
                  <div className="">
                    {/* Show only first certificate or all if showAllCertificates is true */}
                    {(showAllCertificates
                      ? certificateList
                      : certificateList.slice(0, 1)
                    ).map((certificate, index) => (
                      <CertificateCard
                        key={index}
                        certificate={certificate}
                        onEdit={() => handleCertificateEdit(certificate, index)}
                        onDelete={() =>
                          openDeleteModal("certificate", certificate.id)
                        }
                        authenticatedUser={authenticatedUser}
                        user_id={user_id}
                      />
                    ))}

                    {/* Show More/Show Less button only if there are more than 1 certificate entries */}
                    {certificateList.length > 1 && (
                      <button
                        onClick={() =>
                          setShowAllCertificates(!showAllCertificates)
                        }
                        className="mt-5 text-[#000] font-sf text-sm px-4 py-2 border border-black rounded-md hover:bg-gray-50 transition-colors"
                      >
                        {showAllCertificates ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        );
      case "Skill":
        return (
          <div className="space-y-4">
            {loadingSkills ? (
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
            ) : (
              <>
                {/* Skill heading - Show above Add Skill box when entries exist */}
                {skillList.length > 0 && (
                  <h2 className="text-2xl font-sf font-semibold text-gray-900 mb-4">
                    Skills
                  </h2>
                )}

                {/* Add Skill Box */}
                {authenticatedUser === user_id && (
                <div className="border border-[#000] rounded-lg p-6 bg-gray-50">
                  <h3 className="text-lg font-sf font-semibold text-gray-900 mb-2">
                    Add Skill
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 font-sf">
                    Show your skills to build trust with employers or clients.
                  </p>
                  <button
                    onClick={handleAddSkill}
                    className="bg-[#0017e7] mt-7 font-sf text-white px-4 py-2 rounded-md text-sm hover:bg-[#0013bf] transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Skill
                  </button>
                </div>
                )}

                {/* Show added skill entries */}
                {skillList.length > 0 && (
                  <div className="space-y-2">
                    {skillList.map((skill, idx) => (
                      <SkillCard
                        key={idx}
                        skill={skill}
                        onEdit={() => handleSkillEdit(skill, idx)}
                        onDelete={() =>
                          openDeleteModal("skill", skill.id)
                        }
                        authenticatedUser={authenticatedUser} 
                        user_id={user_id}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        );
      case "Info":
        return (
          <ContactInfo authenticatedUser={authenticatedUser} userId={user_id} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-6">
      <div className="bg-white rounded-lg border border-[#7c87bc] overflow-hidden ">
        {/* Header */}
        <div className="p-6 border-gray-200">
          <h2 className="text-3xl font-sf font-semibold text-gray-900 mb-6">
            About
          </h2>

          {/* Tabs */}
          <div className="flex space-x-8 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 text-md font-medium font-sf transition-colors relative ${
                  activeTab === tab
                    ? "text-[#0017e7] border-b-2 border-[#0017e7]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">{renderContent()}</div>
      </div>

      {/* Modals */}
      <OverviewModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveOverview}
        initialText={overviewText}
      />

      <AddEducation
        isOpen={showEducation}
        initialData={
          isEditMode && editingEducation !== null
            ? educationList[editingEducation]
            : null
        }
        isEditMode={isEditMode}
        onClose={handleCloseEducationModal}
        onSave={handleEducationSave}
      />

      <AddCertificate
        isOpen={showCertificate}
        initialData={
          isCertificateEditMode && editingCertificate !== null
            ? certificateList[editingCertificate]
            : null
        }
        isEditMode={isCertificateEditMode}
        onClose={handleCloseCertificateModal}
        onSave={handleCertificateSave}
      />

      <AddSkill
        isOpen={showSkill}
        initialData={
          isSkillEditMode && editingSkill !== null
            ? skillList[editingSkill]
            : ""
        }
        isEditMode={isSkillEditMode}
        onClose={handleCloseSkillModal}
        onSave={handleSkillSave}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={() =>
          handleDeleteItem(deleteModalData.type, deleteModalData.itemId)
        }
        type={deleteModalData.type}
      />
    </div>
  );
};

export default ProfileAbout;