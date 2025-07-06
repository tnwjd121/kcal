import React, { useEffect, useState } from 'react'
import "../css/list.css"
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { LuCalendarDays } from 'react-icons/lu'
import { SERVER_URL } from '../components/url'
import { useNavigate } from 'react-router-dom'

export default function List() {

  const [eats, setEats] = useState([])
  const [date, setDate] = useState(new Date())
  const navigate = useNavigate();

  const formatDate = (d) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleDateChange = (delta) => {
    const newDate = new Date(date)
    newDate.setDate(date.getDate() + delta)
    setDate(newDate)
  }

  useEffect(() => {
    fetch(`${SERVER_URL}/eats`)
      .then(res => res.json())
      .then(data => setEats(data))
      .catch(err => console.error(err))
  }, [])

  const todayEats = eats.filter(e => e.eatDate === formatDate(date))

  const totalCalories = todayEats.reduce((sum, item) => sum + item.calories, 0)
  const totalAmount = todayEats.reduce((sum, item) => sum + item.amount, 0)
  const totalCarbs = todayEats.reduce((sum, item) => sum + item.carbohydrates, 0)
  const totalProtein = todayEats.reduce((sum, item) => sum + item.protein, 0)
  const totalFat = todayEats.reduce((sum, item) => sum + item.fat, 0)

  const groupedByCategory = todayEats.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || []
    acc[item.category].push(item)
    return acc
  }, {})


  return (
    <div id='body'>
      <div id='list-top' className='body-padding'>
        <div onClick={() => navigate('/')}><FaChevronLeft /></div>
        <div><LuCalendarDays /></div>
      </div>
      <div id='list-info'>
        <div id='list-info-date-nav'>
          <div onClick={() => handleDateChange(-1)} className='nav'><FaChevronLeft /></div>
          <div id='list-info-date'>{formatDate(date)}</div>
          <div onClick={() => handleDateChange(1)} className='nav'><FaChevronRight /></div>
        </div>
        <div id='list-info-summary'>
          <div id='list-info-title'>총 섭취량</div>
          <div id='list-info-kcal'>{Math.round(totalCalories).toLocaleString()}kcal  먹었어요!</div>
          <div id='list-info-weight'>총 중량 : {totalAmount.toFixed(1)}g</div>
          <div id='list-info-legend'>
            <div className="legend-box carb"></div> 탄 {Math.round(totalCarbs)}g
            <div className="legend-box protein"></div> 단 {Math.round(totalProtein)}g
            <div className="legend-box fat"></div> 지 {Math.round(totalFat)}g
          </div>
        </div>
      </div>
      <div id='list-card'>
        {Object.entries(groupedByCategory).map(([category, foods]) => (
          <div key={category}>
            <div className='list-meal'>{category}</div>
            {foods.map((item, idx) => (
              <div className='list-card-item' key={idx}>
                <div className='list-card-name'>{item.foodName}</div>
                <hr id='card-hr' />
                <div id='list-card-info'>
                  <div className='list-card-info-kcal'>칼로리(kcal) {item.calories}</div>
                  <div className='list-card-info-amount'>섭취중량(g)   {item.amount}</div>
                </div>
                <div id='list-card-nutrition'>
                  <div className='nutrition'>탄수화물  {item.carbohydrates}</div>
                  <div className='nutrition'>단백질    {item.protein}</div>
                  <div className='nutrition'>지방 {item.fat}</div>
                  <div className='nutrition'>당류 {item.sugar}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
