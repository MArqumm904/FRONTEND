import { Gem } from 'lucide-react'
import React, { useState } from 'react'
import RemoveMember from './removeMember';

const members = [
  {
    name: 'Lina Ashraf',
    subtitle: 'UX Research, Wireframing, Figma',
    profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
    coverImage: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=120&fit=crop',
    verified: false
  },
  {
    name: 'Junaid Farooq',
    subtitle: 'UI Design, Prototyping, Adobe XD',
    profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
    coverImage: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=300&h=120&fit=crop',
    verified: true
  },
  {
    name: 'Alina Qureshi',
    subtitle: 'Node.js, Express, MongoDB',
    profilePic: 'https://randomuser.me/api/portraits/women/68.jpg',
    coverImage: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300&h=120&fit=crop',
    verified: false
  },
  {
    name: 'Taimoor Siddiqui',
    subtitle: 'TypeScript, Next.js, GraphQL',
    profilePic: 'https://randomuser.me/api/portraits/men/65.jpg',
    coverImage: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=300&h=120&fit=crop',
    verified: true
  },
];


const myMembers = () => {
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  
  const handleRemoveClick = (member) => {
    setSelectedMember(member);
    setShowRemoveModal(true);
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setSelectedMember(null);
  };

  const handleConfirmRemove = () => {
    setShowRemoveModal(false);
    setSelectedMember(null);
  };

  return (
    <div className="relative">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-10">
        {members.map((member, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden flex flex-col items-center">
            {/* Cover Image */}
            <div className="w-full h-28 bg-gray-200 relative">
              <img src={member.coverImage} alt="Cover" className="w-full h-full object-cover" />
              {/* Profile Pic */}
              <div className="absolute left-1/2 -bottom-14 transform -translate-x-1/2">
                <img src={member.profilePic} alt={member.name} className="w-24 h-24 rounded-full border-4 border-white object-cover " />
              </div>
            </div>
            <div className="pt-16 pb-6 px-4 flex flex-col items-center w-full">
              <div className={`${member.verified === true ? "flex items-center gap-x-2 mb-1" : " "}`}>
                <h3 className="font-bold text-lg text-gray-900 font-sf">{member.name}</h3>
                
                {member.verified && (
                  <div className='p-2 rounded-full bg-[#BBF1FC]'>
                    <Gem className={`w-4 h-4 text-cyan-600`}/>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-4 text-center font-sf">{member.subtitle}</p>
            </div>
            <div className="w-full px-3 pb-3">
              <button
                onClick={() => handleRemoveClick(member)}
                className="w-full bg-[#0017e7] text-white rounded-lg py-2 font-semibold font-sf hover:bg-[#0012b7] transition-colors"  
              >
                Remove Member
              </button>
            </div>
          </div>
        ))}
      </div>
        {/* Remove Member Modal */}
      {showRemoveModal && (
        <RemoveMember 
          onCancel={handleCancelRemove}
          onBlock={handleConfirmRemove}
          name={selectedMember?.name}
        />
      )}
      </div>
  )
}

export default myMembers
