import React from 'react'

const AIBadge = () => {
  return (
    <button className="flex items-center gap-1 bg-[#F1ECFF] text-sm px-3 py-1 rounded-lg  hover:bg-[#EDE0FF]">
      <img src="/assets/icons/brand-icon.png" alt="AI Icon" className="w-4 h-4" />
      AI Assistant
    </button>
  )
}

export { AIBadge }