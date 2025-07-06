import React, { useEffect, useState } from 'react'
import { FaChevronLeft } from "react-icons/fa";
import { FaListUl } from "react-icons/fa";
import "../css/main.css"
import { LuCalendarDays } from "react-icons/lu";
import { FaCirclePlus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../components/url';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export default function Main() {
  // 날짜 관련 변수 (기존 유지)
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const now = new Date();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const day = days[(now.getDay() + 6) % 7];
  const todayWeekDay = (now.getDay() + 6) % 7;

  const year = now.getFullYear();
  const monthIndex = now.getMonth();

  const lastDateThisMonth = new Date(year, monthIndex + 1, 0).getDate();
  const lastDatePrevMonth = new Date(year, monthIndex, 0).getDate();

  const mondayDate = date - todayWeekDay;

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = mondayDate + i;
    if (d < 1) {
      return lastDatePrevMonth + d;
    } else if (d > lastDateThisMonth) {
      return d - lastDateThisMonth;
    } else {
      return d;
    }
  });

  // 기존 급식 데이터 상태
  const [mealData, setMealData] = useState(null);
  const [loadingMeal, setLoadingMeal] = useState(true);

  // 새로 추가: 오늘 식단 데이터 상태 (List 컴포넌트에서 받아오는 형태)
  const [eats, setEats] = useState([]);
  const [loadingEats, setLoadingEats] = useState(true);

  const navigate = useNavigate();

  // 날짜 포맷 함수 (List 컴포넌트에서 사용한 것과 동일)
  const formatDate = (d) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 급식 API 호출 (기존 유지)
  useEffect(() => {
    const API_KEY = '59f9f1b2bc5b4f3d84bb51b3cae8f0fc';
    const ATPT_OFCDC_SC_CODE = 'C10';
    const SD_SCHUL_CODE = '7181036';
    const MLSV_FROM_YMD = '20250704';
    const MLSV_TO_YMD = '20250704';

    const url = `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${API_KEY}&Type=json&ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${SD_SCHUL_CODE}&MLSV_FROM_YMD=${MLSV_FROM_YMD}&MLSV_TO_YMD=${MLSV_TO_YMD}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.mealServiceDietInfo) {
          const meal = data.mealServiceDietInfo[1].row;
          setMealData(meal);
        } else {
          setMealData([]);
        }
        setLoadingMeal(false);
      })
      .catch(() => {
        setMealData([]);
        setLoadingMeal(false);
      });
  }, []);

  // 오늘 eats 데이터 API 호출 (List 컴포넌트처럼)
  useEffect(() => {
    fetch(`${SERVER_URL}/eats`)
      .then(res => res.json())
      .then(data => {
        setEats(data);
        setLoadingEats(false);
      })
      .catch(err => {
        console.error(err);
        setEats([]);
        setLoadingEats(false);
      })
  }, []);

  // 오늘 날짜에 해당하는 eats만 필터링
  const todayEats = eats.filter(e => e.eatDate === formatDate(now));

  // 오늘 섭취량 총합 계산
  const totalCalories = todayEats.reduce((sum, item) => sum + item.calories, 0);
  const totalCarbs = todayEats.reduce((sum, item) => sum + item.carbohydrates, 0);
  const totalProtein = todayEats.reduce((sum, item) => sum + item.protein, 0);
  const totalFat = todayEats.reduce((sum, item) => sum + item.fat, 0);

  // 기존 급식 데이터 가공 (기존 유지)
  const processedMeals = mealData?.map(meal => {
    const replaced = meal.DDISH_NM.replace(/<br\/?>/g, '\n');
    const items = replaced.split('\n').filter(Boolean);
    const cleanedItems = items.map(item => item.replace(/\(.*?\)/g, '').trim());

    const allergyMatches = replaced.match(/\(([\d.]+)\)/g) || [];
    const allergyNumbers = Array.from(new Set(
      allergyMatches
        .map(str => str.replace(/[()]/g, '').split('.').map(n => n.trim()))
        .flat()
    ))
      .map(Number)
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);

    const allergyWithLabel = allergyNumbers.length > 0
      ? allergyNumbers.map(num => `${num}번`).join(' / ')
      : '없음';

    return {
      menu: cleanedItems.join(' / '),
      allergy: allergyWithLabel,
    };
  });

  const GOAL_CARBS = 100;   // 목표 탄수화물 (g)
  const GOAL_PROTEIN = 100; // 목표 단백질 (g)
  const GOAL_FAT = 100;     // 목표 지방 (g)
  const GOAL_CALORIES = 1000;

  const caloriesPercent = Math.min(Math.round((totalCalories / GOAL_CALORIES) * 100), 100);






  return (
    <div id='body'>
      <div id='main-top' className='body-padding'>
        <div>
          <FaChevronLeft />
        </div>
        <div onClick={() => navigate('/list')}><FaListUl /></div>
      </div>
      <div id='main-date'>
        <div id='main-date-text' className='body-padding'>
          {`${month}.${date} ${day}`}    <LuCalendarDays />
        </div>
        <div id='main-date-weekend' className='body-padding'>
          <div
            className='main-date-weekend-data'>
            {days.map((day, idx) => (
              <div
                key={day}
                className='main-date-weekend-day'
                style={{
                  backgroundColor: idx === todayWeekDay ? '#00a99d' : 'transparent',
                  color: idx === todayWeekDay ? 'white' : 'black'
                }}
              >
                {day}
              </div>
            ))}
          </div>
          <div className='main-date-weekend-data'>
            {weekDates.map((dateNum, idx) => {
              return (
                <div
                  key={idx}
                  className='main-date-weekend-day'
                >
                  {dateNum}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div id='main-nice'>
        <div id='main-nice-top'>
          <div id='main-nice-title'>급식 메뉴</div>
          <div id='main-nice-button'>기록하기</div>
        </div>
        <div id='main-nice-data'>
          {processedMeals && processedMeals.length > 0 ? (
            processedMeals.map((meal, idx) => (
              <div key={idx}>
                <div id='main-nice-data-meal'>{meal.menu}</div>
                <div id='main-nice-data-allg'>알레르기 주의 물질</div>
                <div id='main-nice-data-allgNum'>{meal.allergy || '없음'}</div>
              </div>
            ))
          ) : (
            <div>급식 정보가 없습니다.</div>
          )}
        </div>
      </div>
      <div id='main-add'>
        <div id='main-add-left'>
          <div className="circle-bg"></div>
          <img src={require('../img/food.png')}></img>
        </div>
        <div id='main-add-mid'>
          <div id='main-add-mid-subtitle'>건강한 습관을 만드는</div>
          <div id='main-add-mid-title'>오늘 식단 기록하기</div>
        </div>
        <div id='main-add-right' onClick={() => navigate('/add')}><FaCirclePlus /></div>
      </div>
      <div id="main-list">
        <div id="main-list-title">목표 섭취 영양</div>
        <div id="main-list-content">
          <div id="main-list-left">
            <div id="main-list-left">
              <div id="nutrient">
                <div id="nutrient-label" className="carb">탄</div>
                <div id="nutrient-info">
                  <div className="percent">
                    {totalCarbs > 0 ? `${Math.min(Math.round((totalCarbs / GOAL_CARBS) * 100), 100)}%` : '0%'}
                  </div>
                  <div className="gram">
                    <span className="span-text">{Math.round(totalCarbs)}</span> / {GOAL_CARBS}g
                  </div>
                </div>
              </div>

              <div id="nutrient">
                <div id="nutrient-label" className="protein">단</div>
                <div id="nutrient-info">
                  <div className="percent">
                    {totalProtein > 0 ? `${Math.min(Math.round((totalProtein / GOAL_PROTEIN) * 100), 100)}%` : '0%'}
                  </div>
                  <div className="gram">
                    <span className="span-text">{Math.round(totalProtein)}</span> / {GOAL_PROTEIN}g
                  </div>
                </div>
              </div>

              <div id="nutrient">
                <div id="nutrient-label" className="fat">지</div>
                <div id="nutrient-info">
                  <div className="percent">
                    {totalFat > 0 ? `${Math.min(Math.round((totalFat / GOAL_FAT) * 100), 100)}%` : '0%'}
                  </div>
                  <div className="gram">
                    <span className="span-text">{Math.round(totalFat)}</span> / {GOAL_FAT}g
                  </div>
                </div>
              </div>
            </div>
          </div>
<div id="main-list-right">
  <div style={{ width: 120, height: 120 }}>
    <CircularProgressbarWithChildren
      value={caloriesPercent}
      strokeWidth={15} 
      styles={buildStyles({
        pathColor: '#00a99d',
        trailColor: '#eee',
      })}
    >
      <div style={{ fontSize: 12 }}> kcal
      </div>
      <div style={{ fontSize: 16, fontWeight: 'bold' }}>
        {GOAL_CALORIES.toLocaleString()}
      <div style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
      {Math.round(totalCalories)}
      </div>
      </div>
    </CircularProgressbarWithChildren>
  </div>
</div>
        </div>
      </div>
    </div>
  )
}
