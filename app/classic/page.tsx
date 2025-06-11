import React from 'react'
import SearchBox from '../components/SearchBox'
const ClassicPage = () => {
  return (
    <div>
      <SearchBox />
      <div className="guess-container">
        <div className="guess-row">
          <div className="guess-cell"></div>
          <div className="guess-cell"></div>
          <div className="guess-cell"></div>
          <div className="guess-cell"></div>
          <div className="guess-cell"></div>
        </div>
      </div>
    </div>
  )
}

export default ClassicPage