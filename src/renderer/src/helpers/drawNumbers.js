import { useContext, useEffect } from 'react'

export const drawNumbers = (numbers) => {
  const newNumbers = [...numbers]
  const enabledNumbers = numbers.filter(n => !n.disabled)

  if (enabledNumbers.length === 0) {
    console.log('Todos los números están deshabilitados.')
    return false
  }

  const randomIndex = Math.floor(Math.random() * enabledNumbers.length)
  const randomNumber = enabledNumbers[randomIndex]

  const indexInOriginalArray = numbers.indexOf(randomNumber)

  newNumbers[indexInOriginalArray].disabled = true
  newNumbers[indexInOriginalArray].pickOrder = newNumbers.length - enabledNumbers.length + 1

  return newNumbers
  
}