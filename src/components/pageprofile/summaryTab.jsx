import { Gem } from 'lucide-react';
import React, { useState } from 'react';
import MyMembers from "../pageprofile/myMembers";
import CompanyAffiliations from './companyAffiliations';
import MemberRequest from './memberRequest';
import CompanyInvitaions from './companyInvitations';
import ReqMembers from './reqMembers';
import ReqMembership from "../pageprofile/request_membership";
import PandingRequest from './PandingRequest';
import Overview from './Overview';
import Info from './Info';


const tabs = [
    "Overview",
    "Info"
  ];

const SummaryTab = ({owner_id}) => {
  const [activeTab ,setActiveTab] = useState("Overview");
  const [showreqmemPopup, setShowreqmemPopup] = useState(false);
  const [showReqMembershipPopup, setShowReqMembershipPopup] = useState(false);


  return (
    <div className="bg-white rounded-xl shadow py-6 w-full mx-auto mt-4 border border-[#7c87bc]">
      <h2 className="text-3xl font-bold font-sf px-10 ">Summary</h2>

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

      {showreqmemPopup && (
                    <ReqMembers onClose={() => setShowreqmemPopup(false)} />
             )}
      {showReqMembershipPopup && (
                    <ReqMembership onClose={() => setShowReqMembershipPopup(false)} />
             )}

      
      {activeTab === "Overview" && (
      <Overview owner_id={owner_id} />
    )}
    {activeTab === "Info" && (
      <Info owner_id={owner_id} />
    )}
    
    
   
    </div>
  );
};

export default SummaryTab;