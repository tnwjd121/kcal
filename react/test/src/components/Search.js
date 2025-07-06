import React, { useState, useEffect } from 'react'
import { SERVER_URL } from './url'
import { IoSearch } from "react-icons/io5";
import { TiDelete } from "react-icons/ti";
import '../css/search.css'

export default function Search({ onSelect }) {
  const [query, setQuery] = useState('')
  const [foods, setFoods] = useState([])
  const [showResults, setShowResults] = useState(false)

  const fetchFood = () => {
    const trimmedQuery = query.trim().toLowerCase();

  fetch(`${SERVER_URL}/foods`)
    .then(res => res.json())
    .then(data => {
      const filtered = trimmedQuery
        ? data.filter(food =>
            food.foodName.toLowerCase().includes(trimmedQuery)
          )
        : data; 

      setFoods(filtered);
      setShowResults(true);
    })
    .catch(err => console.error(err));
  };


  const clearSearch = () => {
    setQuery('')
    setFoods([])
    setShowResults(false)
  }

  const handleSelectFood = (food) => {
    onSelect(food)
    clearSearch()
  }

  return (
    <div id="search-container">
      <div id="search-box" className={showResults ? 'active' : ''}>
        <IoSearch onClick={fetchFood} id="search-icon" />
        <input
          type="text"
          placeholder="음식명, 브랜드명으로 검색"
          value={query}
          onChange={e => setQuery(e.target.value)}
          id="search-input"
          onKeyDown={e => e.key === 'Enter' && fetchFood()}
        />
        <TiDelete onClick={clearSearch} id="clear-icon" />
      </div>
      {showResults && (
        <ul id="search-results">
          {foods.length > 0 ? (
            foods.map(food => (
              <li key={food.id} onClick={() => handleSelectFood(food)}>
                {food.foodName}
              </li>
            ))
          ) : (
            <li id="search-no-result">검색 결과가 없습니다.</li>
          )}
        </ul>
      )}

    </div>

  )
}
