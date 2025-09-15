import { useEffect, useState } from "react";
import ReqMembers from "./reqMembers";
import MyAgents from "./MyAgents";
import AffiliatedAgencies from "./AffiliatedAgencies";
import RequestAgencyModal from "./about_request_agency";
import RequestAgentModal from "./about_request_agent";
import AgenciesInvitations from "./AgenciesInvitations";
import AgentsRequests from "./AgentsRequests";

const tabs = [
  "My Agents",
  "Affiliated Agencies",
  "Agencies Invitations",
  "Agents Requests",
];

const AgentsTab = () => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showRequestModalAgent, setShowRequestModalAgent] = useState(false);
  const [activeTab, setActiveTab] = useState("My Agents");
  const [showreqagentPopup, setShowreqagentPopup] = useState(false);
  const [showReqAgenciesPopup, setShowReqAgenciesPopup] = useState(false);
  
  const handleCloseRequestModal = () => {
    setShowRequestModal(false);
  };
  
  const handleCloseRequestModalAgent = () => {
    setShowRequestModalAgent(false);
  };

  useEffect(() => {
    if (showRequestModal || showRequestModalAgent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showRequestModal , showRequestModalAgent]);

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
          {activeTab === "Pending Request" ? "Invited Members" : activeTab}
        </h2>
        {activeTab === "My Agents" ? (
          <button
            className="px-4 py-2 border border-black rounded-md"
            onClick={() => setShowRequestModalAgent(true)}
          >
            Request Agents
          </button>
        ) : activeTab === "Affiliated Agencies" ? (
          <button
            onClick={() => setShowRequestModal(true)}
            className="px-4 py-2 border border-black rounded-md"
          >
            Request Agencies
          </button>
        ) : (
          ""
        )}
      </div>

    
      {showRequestModal && (
        <RequestAgencyModal
          open={showRequestModal}
          onClose={handleCloseRequestModal}
          agency={null}
          readable={false}
        />
      )}
      
      {showRequestModalAgent && (
        <RequestAgentModal
          open={showRequestModalAgent}
          onClose={handleCloseRequestModalAgent}
          agent={null}
          readable={false}
        />
      )}

      {activeTab === "My Agents" && <MyAgents />}

      {activeTab === "Affiliated Agencies" && <AffiliatedAgencies />}

      {activeTab === "Agencies Invitations" && <AgenciesInvitations />}
      {activeTab === "Agents Requests" && <AgentsRequests />}
    </div>
  );
};

export default AgentsTab;
