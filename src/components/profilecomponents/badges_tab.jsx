import React, { useState, useEffect } from 'react'
import { Gem } from 'lucide-react'
import axios from 'axios'

const BadgesTab = () => {
  const [loading, setLoading] = useState(true)
  const [badges, setBadges] = useState([])
  const [verifiedBadgeCount, setVerifiedBadgeCount] = useState(0)

  const checkVerifiedMembershipBadge = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/checkverifiedMembershipbadge`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      
      const totalVerified = response.data.total_verified_memberships || 0
      setVerifiedBadgeCount(totalVerified)
      
      // Create badges array based on verified count (max 7 badges as in your design)
      const badgeCount = Math.min(totalVerified, 7)
      const badgesArray = Array(badgeCount).fill('Verified Memberships')
      setBadges(badgesArray)
      
    } catch (error) {
      console.error("Error checking verified badge:", error)
      setBadges([])
      setVerifiedBadgeCount(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkVerifiedMembershipBadge()
  }, [])

  if (loading) {
    return (
      <div className="bg-white border p-6 border-[#7c87bc] mt-4 rounded-xl">
        <h2 className="text-2xl font-sf font-semibold mb-4">My Badges</h2>
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
    )
  }

  return (
    <div className="bg-white border p-6 border-[#7c87bc] mt-4 rounded-xl">
      <h2 className="text-2xl font-sf font-semibold mb-4">My Badges</h2>
      
      {badges.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg font-sf">
            No verified membership badges yet. 
            You need at least 5 verified memberships to earn badges.
          </p>
          <p className="text-gray-400 text-sm mt-2 font-sf">
            Current verified memberships: {verifiedBadgeCount}/5
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-600 font-sf">
              Total Verified Memberships: <span className="font-semibold">{verifiedBadgeCount}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-4 p-3">
            {badges.map((badge, idx) => (
              <div
                key={idx}
                className="flex items-center bg-[#bbf1fc] rounded-full px-10 py-2 text-cyan-700 text-lg font-medium gap-2"
              >
                <Gem size={25} />
                {badge}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default BadgesTab