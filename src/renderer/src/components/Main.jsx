import { useContext, useEffect } from 'react'
import { DataContext } from '../context/DataContext'
import Number from './Number'

function Main() {
  const { numbers, setNumbers } = useContext(DataContext) 

  const handleClick = (e) => {
    e.preventDefault();
    const newNumbers = [...numbers]
    const randomIndex = Math.floor(Math.random() * newNumbers.length)
    newNumbers[randomIndex].disabled = true
    setNumbers(newNumbers)
  }
/*
    <button onClick={handleClick }>PRUEBA</button>
      */  
  return (
    <>
      <main>
        {
          numbers.map((number, index) => {
            return <Number 
              key={index}
              disabled={number.disabled}
              text={number.text}>
            </Number>
          })
        }
      </main>
    </>
  )
}

export default Main 