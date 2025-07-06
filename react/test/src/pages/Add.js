import React, { useState } from 'react'
import Search from '../components/Search';
import "../css/add.css"
import { useNavigate } from 'react-router-dom';
import { AiFillMinusCircle } from "react-icons/ai";

export default function Add() {

  const [selectedFoods, setSelectedFoods] = useState([])
  const [category, setCategory] = useState('')

  const handleSelectFood = (food) => {
    const exists = selectedFoods.some(f => f.id === food.id)
    if (!exists) {
      setSelectedFoods(prev => [...prev, { ...food, amount: 100.0 }]) // 기본 중량 70.0g
    }
  }

  const handleAmountChange = (id, delta) => {
    setSelectedFoods(prev =>
      prev.map(f =>
        f.id === id
          ? { ...f, amount: Math.max(0, parseFloat((f.amount + delta).toFixed(1))) }
          : f
      )
    )
  }

  const handleDelete = (id) => {
    setSelectedFoods(prev => prev.filter(f => f.id !== id))
  }


  const handleSave = () => {
    if (!category) {
      alert('섭취 시간을 선택하세요.')
      return
    }

const today = new Date();
const eatDate = today.toLocaleDateString('sv-SE')

    const eatData = selectedFoods.map(f => {
      const ratio = f.amount / 100
      return {
        amount: f.amount,
        calories: parseFloat((f.calories * ratio).toFixed(1)),
        carbohydrates: parseFloat((f.carbohydrates * ratio).toFixed(1)),
        protein: parseFloat((f.protein * ratio).toFixed(1)),
        fat: parseFloat((f.fat * ratio).toFixed(1)),
        sugar: parseFloat((f.sugar * ratio).toFixed(1)),
        category: category,
        eatDate: eatDate,
        foodId: f.id,
        foodName: f.foodName
      }
    })

    // 서버로 저장 요청
    fetch('http://localhost:8080/eat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eatData)
    })
      .then(res => {
        if (res.ok) {
          alert("섭취 데이터가 저장되었습니다.")
          setSelectedFoods([])
          setCategory('')
        } else {
          alert("저장 실패")
        }
      })
      .catch(err => console.error(err))
  }

  const getNutritionSummary = () => {
    const total = {
      calories: 0,
      carbohydrates: 0,
      protein: 0,
      fat: 0
    }

    selectedFoods.forEach(f => {
      const ratio = f.amount / 100
      total.carbohydrates += f.carbohydrates * ratio
      total.protein += f.protein * ratio
      total.fat += f.fat * ratio
      total.calories += f.calories * ratio
    })

    const totalGrams = total.carbohydrates + total.protein + total.fat
    const carbsPercent = totalGrams ? (total.carbohydrates / totalGrams) * 100 : 0
    const proteinPercent = totalGrams ? (total.protein / totalGrams) * 100 : 0
    const fatPercent = totalGrams ? (total.fat / totalGrams) * 100 : 0

    return {
      ...total,
      carbsPercent,
      proteinPercent,
      fatPercent
    }
  }

  const summary = getNutritionSummary();
  const isEmpty = selectedFoods.length === 0;

  const navigate = useNavigate();



  return (
    <div id='body'>
      <div id='add-top'>
        <Search onSelect={handleSelectFood} />
        <div id='return-button' onClick={() => navigate('/')}>취소</div>
      </div>
      <div id='add-type'>
        {['아침', '점심', '저녁', '간식'].map((type) => (
          <button
            id='add-type-button'
            key={type}
            onClick={() => setCategory(type)}
            style={{
              backgroundColor: category === type ? '#3db54b' : '#ffffff',
              color: category === type ? '#fff' : '#acacac'
            }}
          >
            {type}
          </button>
        ))}
      </div>
      <div id="add-summary">
        <div id='add-summary-text'>
          <div id='add-summary-title'>총 열량</div>
          <div id='add-summary-kcal'>{Math.round(summary.calories).toLocaleString()}kcal</div>
        </div>
        <div id='add-summary-data'>
          <div id='add-summary-graph'>
            {!isEmpty ? (
              <>
                <div
                  className='carbohydrates graph-div'
                  style={{ width: `${summary.carbsPercent}%` }}
                >
                  <span className='graph-text'>{Math.round(summary.carbsPercent)}%</span>
                </div>
                <div
                  className='protein graph-div'
                  style={{ width: `${summary.proteinPercent}%` }}
                >
                  <span>{Math.round(summary.proteinPercent)}%</span>
                </div>
                <div
                  className='fat graph-div'
                  style={{ width: `${summary.fatPercent}%` }}
                >
                  <span>{Math.round(summary.fatPercent)}%</span>
                </div>
              </>
            ) : (
              <div id='graph-div-zero'>
                <span>{Math.round(summary.fatPercent)}%</span>
              </div>
            )}
          </div>
          <div id="graph-legend">
            <div className="legend-item">
              <div className="legend-color-box carbohydrates"></div>
              <span>탄 {Math.round(summary.carbohydrates)}g</span>
            </div>
            <div className="legend-item">
              <div className="legend-color-box protein"></div>
              <span>단 {Math.round(summary.protein)}g</span>
            </div>
            <div className="legend-item">
              <div className="legend-color-box fat"></div>
              <span>지 {Math.round(summary.fat)}g</span>
            </div>
          </div>
        </div>
      </div>

      <div id="add-food">
        <div id='add-food-top'>
          <div className='add-food-title'>섭취 음식</div>
          <div className='add-food-title'>{selectedFoods.length}개</div>
        </div>

        <div id='add-food-list'>
          {selectedFoods.map(food => (
            <div key={food.id}
              id='add-food-card'>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div id='add-foodname'>{food.foodName}</div>
                <div onClick={() => handleDelete(food.id)} id='delete-button'>
                  <AiFillMinusCircle />
                </div>
              </div>
              <hr id='card-hr' />
              <div
                id='card-amount-title'>섭취중량(g)</div>
              <div
                id='card-amout'>
                <div onClick={() => handleAmountChange(food.id, -10)} className='card-button'>-</div>
                <div id='card-button-amount'>{food.amount.toFixed(1)}</div>
                <div onClick={() => handleAmountChange(food.id, 10)} className='card-button'>+</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        onClick={handleSave}
        id='add-button'
        className={isEmpty ? 'disabled' : ''}
      >
        저장
      </div>
    </div>
  )
}
