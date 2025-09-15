import React, { useEffect, useState } from "react";
import { Pencil, CirclePlus, Cake, User } from "lucide-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ContactInfo = ({ userId,authenticatedUser }) => {
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
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
  const [infoId, setInfoId] = useState(null);
  const [showContactInput, setShowContactInput] = useState(false);
  const [contactInput, setContactInput] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  
  // Edit states
  const [editingContact, setEditingContact] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingLanguageIndex, setEditingLanguageIndex] = useState(-1);
  const [editingWebsiteIndex, setEditingWebsiteIndex] = useState(-1);
  const [editingSocialIndex, setEditingSocialIndex] = useState(-1);
  const [editingGender, setEditingGender] = useState(false);
  const [editingDob, setEditingDob] = useState(false);

  // Edit input values
  const [editContactValue, setEditContactValue] = useState("");
  const [editEmailValue, setEditEmailValue] = useState("");
  const [editLanguageValue, setEditLanguageValue] = useState("");
  const [editWebsiteValue, setEditWebsiteValue] = useState("");
  const [editSocialValue, setEditSocialValue] = useState("");
  const [editGenderValue, setEditGenderValue] = useState("");
  const [editDobValue, setEditDobValue] = useState("");

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get(`${API_BASE_URL}/about/info/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        const data = res.data;
        setInfoId(data.id); // <-- store infoId
        setContact(data.contact || "");
        setEmail(data.email || "");
        setLanguages(
          data.languages_spoken
            ? Array.isArray(data.languages_spoken)
              ? data.languages_spoken
              : [data.languages_spoken]
            : []
        );
        setWebsiteLinks(
          data.website
            ? Array.isArray(data.website)
              ? data.website
              : [data.website]
            : []
        );
        setSocialLinks(
          data.social_link
            ? Array.isArray(data.social_link)
              ? data.social_link
              : [data.social_link]
            : []
        );
        setGender(data.gender || "");
        setDob(data.date_of_birth || "");
      })
      .catch(() => {
        setContact("");
        setEmail("");
        setLanguages([]);
        setWebsiteLinks([]);
        setSocialLinks([]);
        setGender("");
        setDob("");
        setInfoId(null);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleAddLanguageClick = () => setShowLanguageInput(true);
  const handleUpdateInfo = async (field, value) => {
    if (!infoId) return;
    try {
      const token = localStorage.getItem("token");
      
      // Console log the data being sent to backend
      // console.log("=== DEBUG: Data being sent to backend ===");
      // console.log("Field:", field);
      // console.log("Value:", value);
      // console.log("Value type:", typeof value);
      // console.log("Is Array:", Array.isArray(value));
      // console.log("Full request body:", { [field]: value });
      // console.log("========================================");
      
      await axios.put(
        `${API_BASE_URL}/about/info/${infoId}`,
        { [field]: value },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      // Update local state
      if (field === "contact") setContact(value);
      if (field === "email") setEmail(value);
      if (field === "languages_spoken") setLanguages(value);
      if (field === "website") setWebsiteLinks(value);
      if (field === "social_link") setSocialLinks(value);
      if (field === "gender") setGender(value);
      if (field === "date_of_birth") setDob(value);
    } catch (error) {
      // console.error("Error updating info:", error);
      // console.error("Error response:", error.response?.data);
      alert("Failed to update info!");
    }
  };

  // Contact Save
  const handleSaveContact = () => {
    if (contactInput.trim() === "") return;
    handleUpdateInfo("contact", contactInput.trim());
    setShowContactInput(false);
    setContactInput("");
  };

  // Email Save
  const handleSaveEmail = () => {
    if (emailInput.trim() === "") return;
    handleUpdateInfo("email", emailInput.trim());
    setShowEmailInput(false);
    setEmailInput("");
  };

  // Language Save
  const handleSaveLanguage = () => {
    if (languageInput.trim() !== "") {
      const updatedLanguages = [...languages, languageInput.trim()];
      // Console log the value being sent to backend for languages
      // console.log("Sending languages_spoken to backend:", updatedLanguages);
      handleUpdateInfo("languages_spoken", updatedLanguages);
      setLanguages(updatedLanguages);
    }
    setShowLanguageInput(false);
    setLanguageInput("");
  };

  // Website Save
  const handleSaveWebsite = () => {
    if (websiteInput.trim() !== "") {
      const updatedWebsites = [...websiteLinks, websiteInput.trim()];
      handleUpdateInfo("website", updatedWebsites);
      setWebsiteLinks(updatedWebsites);
    }
    setShowWebsiteInput(false);
    setWebsiteInput("");
  };

  // Social Save
  const handleSaveSocial = () => {
    if (socialInput.trim() !== "") {
      const updatedSocials = [...socialLinks, socialInput.trim()];
      handleUpdateInfo("social_link", updatedSocials);
      setSocialLinks(updatedSocials);
    }
    setShowSocialInput(false);
    setSocialInput("");
  };

  // Gender Save
  const handleSaveGender = () => {
    if (gender.trim() !== "") {
      handleUpdateInfo("gender", gender);
    }
    setShowGenderInput(false);
  };

  // DOB Save
  const handleSaveDob = () => {
    if (dob.trim() !== "") {
      handleUpdateInfo("date_of_birth", dob);
    }
    setShowDobInput(false);
  };

  // Edit handlers
  const handleEditContact = () => {
    setEditContactValue(contact);
    setEditingContact(true);
  };

  const handleSaveEditContact = () => {
    if (editContactValue.trim() !== "") {
      handleUpdateInfo("contact", editContactValue.trim());
      setContact(editContactValue.trim());
    }
    setEditingContact(false);
    setEditContactValue("");
  };

  const handleEditEmail = () => {
    setEditEmailValue(email);
    setEditingEmail(true);
  };

  const handleSaveEditEmail = () => {
    if (editEmailValue.trim() !== "") {
      handleUpdateInfo("email", editEmailValue.trim());
      setEmail(editEmailValue.trim());
    }
    setEditingEmail(false);
    setEditEmailValue("");
  };

  const handleEditLanguage = (index, value) => {
    setEditLanguageValue(value);
    setEditingLanguageIndex(index);
  };

  const handleSaveEditLanguage = () => {
    if (editLanguageValue.trim() !== "") {
      const updatedLanguages = [...languages];
      updatedLanguages[editingLanguageIndex] = editLanguageValue.trim();
      handleUpdateInfo("languages_spoken", updatedLanguages);
      setLanguages(updatedLanguages);
    }
    setEditingLanguageIndex(-1);
    setEditLanguageValue("");
  };

  const handleEditWebsite = (index, value) => {
    setEditWebsiteValue(value);
    setEditingWebsiteIndex(index);
  };

  const handleSaveEditWebsite = () => {
    if (editWebsiteValue.trim() !== "") {
      const updatedWebsites = [...websiteLinks];
      updatedWebsites[editingWebsiteIndex] = editWebsiteValue.trim();
      handleUpdateInfo("website", updatedWebsites);
      setWebsiteLinks(updatedWebsites);
    }
    setEditingWebsiteIndex(-1);
    setEditWebsiteValue("");
  };

  const handleEditSocial = (index, value) => {
    setEditSocialValue(value);
    setEditingSocialIndex(index);
  };

  const handleSaveEditSocial = () => {
    if (editSocialValue.trim() !== "") {
      const updatedSocials = [...socialLinks];
      updatedSocials[editingSocialIndex] = editSocialValue.trim();
      handleUpdateInfo("social_link", updatedSocials);
      setSocialLinks(updatedSocials);
    }
    setEditingSocialIndex(-1);
    setEditSocialValue("");
  };

  const handleEditGender = () => {
    setEditGenderValue(gender);
    setEditingGender(true);
  };

  const handleSaveEditGender = () => {
    if (editGenderValue.trim() !== "") {
      handleUpdateInfo("gender", editGenderValue);
      setGender(editGenderValue);
    }
    setEditingGender(false);
    setEditGenderValue("");
  };

  const handleEditDob = () => {
    setEditDobValue(dob);
    setEditingDob(true);
  };

  const handleSaveEditDob = () => {
    if (editDobValue.trim() !== "") {
      handleUpdateInfo("date_of_birth", editDobValue);
      setDob(editDobValue);
    }
    setEditingDob(false);
    setEditDobValue("");
  };

  function renderWebsiteIcon(link) {
    return (
      <img
        src={`https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(
          link
        )}&sz=32`}
        alt="website"
        className="w-6 h-6"
      />
    );
  }
  function renderSocialIcon(link) {
    if (link.includes("facebook.com")) {
      return (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/2048px-2023_Facebook_icon.svg.png"
          alt="fb"
          className="w-6 h-6"
        />
      );
    }
    if (link.includes("instagram.com")) {
      return (
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpNPYBLb6Z4PIJSlr6qXbUy8VZ0w2w4BPPVQ&s"
          alt="instagram"
          className="w-6 h-6"
        />
      );
    }
    if (link.includes("linkedin.com")) {
      return (
        <img
          src="https://i.pinimg.com/736x/b2/f8/28/b2f828513f21444829a619ce563d4d4e.jpg"
          alt="linkedin"
          className="w-6 h-6"
        />
      );
    }
    if (link.includes("x.com") || link.includes("twitter.com")) {
      return (
        <img
          src="https://img.freepik.com/premium-vector/x-rounded-icon_1144215-148.jpg"
          alt="x"
          className="w-6 h-6"
        />
      );
    }
    return (
      <img
        src="https://cdn-icons-png.flaticon.com/512/7046/7046086.png"
        alt="link"
        className="w-6 h-6"
      />
    );
  }

  if (loading)
    return (
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
    );

  return (
    <div className="space-y-8 -mt-5">
      {/* Contact & Email */}
      <div className="flex items-start w-full gap-20">
        <div>
          {/* Contact */}
          <div className="font-sf font-semibold text-2xl mb-1">Contact</div>
          <div className="flex items-center text-gray-700 mt-3">
            {contact ? (
              editingContact ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="border border-[#5a5a5a] rounded px-3 py-2 font-sf w-[60%]"
                    placeholder="Edit Contact"
                    value={editContactValue}
                    onChange={(e) => setEditContactValue(e.target.value)}
                  />
                  <button
                    onClick={handleSaveEditContact}
                    className="bg-[#0017e7] text-white px-8 py-2 rounded font-sf"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <span className="font-sf text-base font-medium text-[#636363] flex items-center">
                  <span className="ml-2 mr-4">
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      className="text-[#4c4c4c]"
                    >
                      <path d="M2 3.5C2 3.224 2.224 3 2.5 3H6.25C6.388 3 6.519 3.056 6.612 3.153L8.862 5.471C9.044 5.663 9.048 5.963 8.871 6.162L7.21 8.03a.25.25 0 0 0-.02.306A12.002 12.002 0 0 0 15.664 16.81a.25.25 0 0 0 .306-.02l1.868-1.662a.25.25 0 0 1 .307-.02l2.317 2.25a.75.75 0 0 1 .238.557V21.5a.5.5 0 0 1-.5.5h-.001C9.798 22 2 14.202 2 4.5V3.5Z" />
                    </svg>
                  </span>
                  {contact}
                  <button
                    className="ml-2 p-1.5 text-gray-500 hover:text-gray-600 rounded-full border border-gray-500 hover:border-gray-500 transition-colors"
                    onClick={handleEditContact}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </span>
              )
            ) : (
              showContactInput ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="border border-[#5a5a5a] rounded px-3 py-2 font-sf w-[60%]"
                    placeholder="Add Contact"
                    value={contactInput}
                    onChange={(e) => setContactInput(e.target.value)}
                  />
                  <button
                    onClick={handleSaveContact}
                    className="bg-[#0017e7] text-white px-8 py-2 rounded font-sf"
                  >
                    Save
                  </button>
                </div>
              ) : authenticatedUser === userId ? (
                
                <button
                  className="flex items-center text-[#0017e7] font-sf font-medium text-lg hover:text-[#0013bf] transition-colors"
                  onClick={() => setShowContactInput(true)}
                >
                  <CirclePlus className="w-7 h-7 mr-1" />
                  Add Contact
                </button>
              ) : null
            )}
          </div>
        </div>
        <div className="flex-1">
          {/* Email */}
          <div className="font-sf font-semibold text-2xl mb-1">Email</div>
          <div className="flex items-center text-gray-700 mt-3">
            <span className="mr-2">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                className="text-[#4c4c4c]"
              >
                <path d="M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5v-13Z" />
                <path d="M2 7l10 6 10-6" />
              </svg>
            </span>
            {editingEmail ? (
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  className="border border-[#5a5a5a] rounded px-3 py-2 font-sf w-[60%]"
                  placeholder="Edit Email"
                  value={editEmailValue}
                  onChange={(e) => setEditEmailValue(e.target.value)}
                />
                <button
                  onClick={handleSaveEditEmail}
                  className="bg-[#0017e7] text-white px-8 py-2 rounded font-sf"
                >
                  Save
                </button>
              </div>
            ) : (
              <span className="font-sf text-base font-medium text-[#636363] flex items-center">
                {email || ''} 
                {!email && authenticatedUser === userId && (
                  <span className="text-[#0017e7] cursor-pointer">Add Email</span>
                )} 
                {email && authenticatedUser === userId && (
                  <button
                    className="ml-2 p-1.5 text-gray-500 hover:text-gray-600 rounded-full border border-gray-500 hover:border-gray-500 transition-colors"
                    onClick={handleEditEmail}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </span>
            )}
          </div>
        </div>
        {authenticatedUser === userId && (
        <div className="flex items-center ml-auto mr-5">
          <button className="p-1.5 text-gray-500 hover:text-gray-600 rounded-full border border-gray-500 hover:border-gray-500 transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
        </div>
        )}
      </div>

      {/* Languages Spoken */}
      <div>
        <div className="flex items-center mb-1">
          <div className="font-sf font-semibold text-2xl">Languages Spoken</div>
          {languages.length > 0 && !showLanguageInput && authenticatedUser === userId && (
            <button
              className="p-1.5 text-gray-500 hover:text-gray-600 rounded-full border border-gray-500 hover:border-gray-500 transition-colors ml-auto"
              onClick={handleAddLanguageClick}
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
        </div>
        {showLanguageInput ? (
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              className="border border-[#5a5a5a] rounded px-3 py-2 font-sf w-[40%]"
              placeholder="Add Language"
              value={languageInput}
              onChange={(e) => setLanguageInput(e.target.value)}
            />
            <button
              onClick={handleSaveLanguage}
              className="bg-[#0017e7] text-white px-8 py-2 rounded font-sf"
            >
              Save
            </button>
          </div>
        ) : authenticatedUser === userId ? (
          <button
            className="flex items-center text-[#0017e7] font-sf font-medium text-lg mt-3 hover:text-[#0013bf] transition-colors"
            onClick={handleAddLanguageClick}
          >
            <CirclePlus className="w-7 h-7 mr-1" />
            Add Language
          </button>
        ) : null}
        <div className="mt-2">
          {languages.map((lang, idx) => (
            lang.split(',').map((language, i) => (
              <div key={i} className="flex items-center gap-2 mt-3">
                {editingLanguageIndex === idx ? (
                  <div className="flex items-center gap-2 w-full">
                    <span>
                      <svg
                        width="25"
                        height="25"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        className="text-[#636363]"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      className="border border-[#5a5a5a] rounded px-3 py-2 font-sf w-[40%]"
                      placeholder="Edit Language"
                      value={editLanguageValue}
                      onChange={(e) => setEditLanguageValue(e.target.value)}
                    />
                    <button
                      onClick={handleSaveEditLanguage}
                      className="bg-[#0017e7] text-white px-8 py-2 rounded font-sf"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <span>
                      <svg
                        width="25"
                        height="25"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        className="text-[#636363]"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
                      </svg>
                    </span>
                    <span className="font-sf text-md text-[#636363] font-medium">
                      {language.trim()}
                    </span>
                    {authenticatedUser === userId && (
                    <button
                      className="p-1.5 text-gray-500 hover:text-gray-600 rounded-full border border-gray-500 hover:border-gray-500 transition-colors"
                      onClick={() => handleEditLanguage(idx, language.trim())}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    )}
                  </>
                )}
              </div>
            ))
          ))}
        </div>
      </div>

      {/* Website and social link */}
      <div>
        <div className="font-sf font-semibold text-2xl mb-1 ">
          Website and social link
        </div>
        <div className="flex flex-col gap-2 mt-1">
          {/* Website Links */}
          {websiteLinks.length > 0 && (
            <div className="mb-2">
              <div className="font-sf text-base font-medium text-gray-700 mb-1 mt-3">
                Website link
              </div>
              {websiteLinks.map((link, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-1">
                  {editingWebsiteIndex === idx ? (
                    <div className="flex items-center gap-2 w-full">
                      <span>{renderWebsiteIcon(link)}</span>
                      <input
                        type="text"
                        className="border border-[#5a5a5a] rounded px-3 py-2 font-sf w-[40%]"
                        placeholder="Edit website link"
                        value={editWebsiteValue}
                        onChange={(e) => setEditWebsiteValue(e.target.value)}
                      />
                      <button
                        onClick={handleSaveEditWebsite}
                        className="bg-[#0017e7] text-white px-8 py-2 rounded font-sf"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <span>{renderWebsiteIcon(link)}</span>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0017e7] underline truncate max-w-xs block"
                      >
                        {link}
                      </a>
                      {authenticatedUser === userId && (
                      <button
                        className="p-1.5 text-gray-500 hover:text-gray-600 rounded-full border border-gray-500 hover:border-gray-500 transition-colors"
                        onClick={() => handleEditWebsite(idx, link)}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
          {showWebsiteInput ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                className="border border-[#5a5a5a] rounded px-3 py-2 font-sf w-[40%]"
                placeholder="Add website link"
                value={websiteInput}
                onChange={(e) => setWebsiteInput(e.target.value)}
              />
              <button
                onClick={handleSaveWebsite}
                className="bg-[#0017e7] text-white px-8 py-2 rounded font-sf"
              >
                Save
              </button>
            </div>
          ) : authenticatedUser === userId ? (
            <button
              className="flex  items-center text-lg text-[#0017e7] font-sf font-medium hover:text-[#0013bf] transition-colors mt-3"
              onClick={() => setShowWebsiteInput(true)}
            >
              <CirclePlus className="w-7 h-7 mr-1" />
              Add a website
            </button>
          ) : null}
          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="mb-2">
              <div className="font-sf text-base font-medium text-gray-700 mb-1 mt-3">
                Social link
              </div>
              <div className="flex flex-wrap gap-6">
                {socialLinks.map((link, idx) =>
                  link.split(',').map((singleLink, i) => (
                    <div key={`${idx}-${i}`} className="flex items-center gap-2 mb-1">
                      {editingSocialIndex === idx ? (
                        <div className="flex items-center gap-2 w-full">
                          <span>{renderSocialIcon(singleLink.trim())}</span>
                          <input
                            type="text"
                            className="border border-[#5a5a5a] rounded px-3 py-2 font-sf w-[510px]"
                            placeholder="Edit social link"
                            value={editSocialValue}
                            onChange={(e) => setEditSocialValue(e.target.value)}
                          />
                          <button
                            onClick={handleSaveEditSocial}
                            className="bg-[#0017e7] text-white px-8 py-2 rounded font-sf"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <>
                          <span>{renderSocialIcon(singleLink.trim())}</span>
                          <a
                            href={singleLink.trim()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0017e7] underline truncate max-w-xs block"
                          >
                            {singleLink.trim()}
                          </a>
                          {authenticatedUser === userId && (
                          <button
                            className="p-1.5 text-gray-500 hover:text-gray-600 rounded-full border border-gray-500 hover:border-gray-500 transition-colors"
                            onClick={() => handleEditSocial(idx, singleLink.trim())}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          )}
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {showSocialInput ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                className="border border-[#5a5a5a] rounded px-3 py-2 font-sf w-[40%]"
                placeholder="Add social link"
                value={socialInput}
                onChange={(e) => setSocialInput(e.target.value)}
              />
              <button
                onClick={handleSaveSocial}
                className="bg-[#0017e7] text-white px-8 py-2 rounded font-sf"
              >
                Save
              </button>
            </div>
          ) : authenticatedUser === userId ? (
            <button
              className="flex mt-3 items-center text-lg text-[#0017e7] font-sf font-medium hover:text-[#0013bf] transition-colors"
              onClick={() => setShowSocialInput(true)}
            >
              <CirclePlus className="w-7 h-7 mr-1" />
              Add a social link
            </button>
          ) : null}
        </div>
      </div>
      
      {/* Gender & Date of Birth */}
      <div className="flex gap-20">
        <div>
          <div className="font-sf font-semibold text-2xl mb-1">Gender</div>
          {gender && !showGenderInput ? (
            editingGender ? (
              <div className="flex items-center gap-2 mt-3">
                <select
                  className="border border-[#5a5a5a] rounded px-3 py-2 font-sf"
                  value={editGenderValue}
                  onChange={(e) => setEditGenderValue(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                <button
                  onClick={handleSaveEditGender}
                  className="bg-[#0017e7] text-white px-8 py-2 rounded font-sf"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center mt-3">
                <User className="w-6 h-6 text-[#636363] mr-2 mb-1" />
                <span className="font-sf text-md text-[#636363] font-medium mr-2">
                  {gender}
                </span>
                {authenticatedUser === userId && (
                <button
                  className="p-1.5 text-gray-500 hover:text-gray-600 rounded-full border border-gray-500 hover:border-gray-500 transition-colors ml-2"
                  onClick={handleEditGender}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                )}
              </div>
            )
          ) : showGenderInput ? (
            <div className="flex items-center gap-2 mt-3">
              <select
                className="border border-[#5a5a5a] rounded px-3 py-2 font-sf"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              <button
                onClick={handleSaveGender}
                className="bg-[#0017e7] text-white px-8 py-2 rounded font-sf"
              >
                Save
              </button>
            </div>
          ) : authenticatedUser === userId ? (
            <button
              className="flex items-center text-[#0017e7] font-sf font-medium  mt-3 hover:text-[#0013bf] transition-colors"
              onClick={() => setShowGenderInput(true)}
            >
              <CirclePlus className="w-7 h-7 mr-1" />
              Add Gender
            </button>
          ) : null}
        </div>
        <div>
          <div className="font-sf font-semibold text-2xl mb-1">
            Date of Birth
          </div>
          {dob && !showDobInput ? (
            editingDob ? (
              <div className="flex items-center gap-2 mt-3">
                <input
                  type="date"
                  className="border border-[#5a5a5a] rounded px-3 py-2 font-sf"
                  value={editDobValue}
                  onChange={(e) => setEditDobValue(e.target.value)}
                />
                <button
                  onClick={handleSaveEditDob}
                  className="bg-[#0017e7] text-white px-8 py-2 rounded font-sf"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center mt-3">
                <Cake className="w-6 h-6 text-[#636363] mr-2 mb-1" />
                <span className="font-sf text-md text-[#636363] font-medium">
                  {dob}
                </span>
                {authenticatedUser === userId && (
                <button
                  className="p-1.5 text-gray-500 hover:text-gray-600 rounded-full border border-gray-500 hover:border-gray-500 transition-colors ml-2"
                  onClick={handleEditDob}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                )}
              </div>
            )
          ) : showDobInput ? (
            <div className="flex items-center gap-2 mt-3">
              <input
                type="date"
                className="border border-[#5a5a5a] rounded px-3 py-2 font-sf"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
              <button
                onClick={handleSaveDob}
                className="bg-[#0017e7] text-white px-8 py-2 rounded font-sf"
              >
                Save
              </button>
            </div>
          ) : authenticatedUser === userId ? (
            <button
              className="flex items-center text-[#0017e7] font-sf font-medium  mt-3  hover:text-[#0013bf] transition-colors"
              onClick={() => setShowDobInput(true)}
            >
              <CirclePlus className="w-7 h-7 mr-1" />
              Add Date of Birth
            </button>
          ) : null }
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;