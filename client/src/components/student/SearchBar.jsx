import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({ data }) => {
  const navigate = useNavigate()
  const [input, setInput] = useState(data ? data : '')
  const [isFocused, setIsFocused] = useState(false)

  const onSearchHandler = (e) => {
    e.preventDefault()
    if (input.trim()) {
      navigate('/course-list/' + input.trim())
    }
  }

  return (
    <form 
      onSubmit={onSearchHandler} 
      className={`
        max-w-xl w-full flex items-center bg-white rounded-lg transition-shadow duration-200
        ${isFocused ? 'shadow-lg ring-2 ring-blue-400' : 'shadow border border-white/20'}
      `}
    >
      <div className="flex items-center justify-center pl-4">
        <img 
          className="w-5 h-5 opacity-60" 
          src={assets.search_icon} 
          alt="search_icon" 
        />
      </div>
      <input 
        onChange={e => setInput(e.target.value)} 
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={input} 
        type="text" 
        className="w-full px-3 py-4 outline-none text-gray-700 placeholder-gray-500"
        placeholder="Search for courses, topics, or skills..." 
      />
      <button 
        type='submit'
        disabled={!input.trim()}
        className={`
          px-6 py-4 m-1 rounded-md font-medium transition-all duration-200
          ${input.trim() 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
        `}
      >
        Search
      </button>
    </form>
  )
}

export default SearchBar