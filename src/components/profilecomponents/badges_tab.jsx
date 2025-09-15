import React from 'react'
import { Gem } from 'lucide-react'

const badges = Array(7).fill('Verified Memberships')

const BadgesTab = () => {
  return (
    <div className="bg-white border p-6 border-[#7c87bc] mt-4 rounded-xl">
      <h2 className="text-2xl font-sf font-semibold mb-4">My Badges</h2>
      <div className="flex flex-wrap gap-4  p-3">
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
    </div>
  )
}

export default BadgesTab