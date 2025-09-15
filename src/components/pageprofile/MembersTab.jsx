import { Gem } from "lucide-react";
import React, { useState } from "react";
import MyMembers from "../pageprofile/myMembers";
import CompanyAffiliations from "./companyAffiliations";
import MemberRequest from "./memberRequest";
import CompanyInvitaions from "./companyInvitations";
import ReqMembers from "./reqMembers";
import ReqMembership from "../pageprofile/request_membership";
import PandingRequest from "./PandingRequest";

const tabs = [
  "My Members",
  "Company Affiliations",
  "Member Request",
  "Company Invitations",
  "Pending Request",
];

const MembersTab = () => {
  const [activeTab, setActiveTab] = useState("My Members");
  const [showreqmemPopup, setShowreqmemPopup] = useState(false);
  const [showReqMembershipPopup, setShowReqMembershipPopup] = useState(false);
  const [requestsCount, setRequestsCount] = useState(0);

  const handleRequestsUpdate = (requests) => {
    setRequestsCount(requests.length);
  };

  return (
    <div className="bg-white rounded-xl shadow py-6 w-full mx-auto mt-4 border border-[#7c87bc]">
      <h2 className="text-3xl font-bold font-sf px-10 ">Membership</h2>

      <div className="my-6">
        <div className="col-span-12">
          <div className="border-b border-[#7c87bc] overflow-hidden">
            <div className="px-10 py-5 pb-0">
              <div className="flex items-center space-x-10">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-lg font-sf font-medium transition-colors relative wrap-none ${
                      activeTab === tab
                        ? "text-[#0017e7] border-b-2 border-[#0017e7] pb-4"
                        : "text-gray-500 hover:text-gray-700 pb-4"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 mt-10 flex items-center justify-between px-10">
        <h2 className="text-3xl font-bold font-sf">
          {activeTab === "Pending Request"
            ? "Invited Members"
            : activeTab === "Member Request"
            ? `Member Requestes (${requestsCount})`
            : activeTab}
        </h2>
        {activeTab === "My Members" ? (
          <button
            className="px-4 py-2 border border-black rounded-md"
            onClick={() => setShowreqmemPopup(true)}
          >
            Request Members
          </button>
        ) : activeTab === "Company Affiliations" ? (
          <button
            onClick={() => setShowReqMembershipPopup(true)}
            className="px-4 py-2 border border-black rounded-md"
          >
            Request Membership
          </button>
        ) : (
          ""
        )}
      </div>

      {showreqmemPopup && (
        <ReqMembers onClose={() => setShowreqmemPopup(false)} />
      )}
      {showReqMembershipPopup && (
        <ReqMembership onClose={() => setShowReqMembershipPopup(false)} />
      )}

      {activeTab === "My Members" && <MyMembers />}
      {activeTab === "Company Affiliations" && <CompanyAffiliations />}
      {activeTab === "Member Request" && (
        <MemberRequest onRequestsUpdate={handleRequestsUpdate} />
      )}

      {activeTab === "Company Invitations" && <CompanyInvitaions />}

      {activeTab === "Pending Request" && <PandingRequest />}
    </div>
  );
};

export default MembersTab;
