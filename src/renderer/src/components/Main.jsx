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
    console.log("NUMBERS", numbers.filter(n => n.disabled))
  }
/*
      */  
  return (
    <>
      <button onClick={handleClick }>PRUEBA</button>

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
      <ul>
        {
          numbers.filter(n => n.disabled).map((number, index) => {
            return ` (${number.text}) `
          })
        }
      </ul>
    </>
  )
}

export default Main 