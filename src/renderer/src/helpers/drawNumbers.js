export const drawNumbers = (numbers) => {
  const enabledNumbers = numbers.filter((n) => !n.disabled)

  if (enabledNumbers.length === 0) {
    return null
  }

  const newNumbers = numbers.map((n) => ({ ...n }))
  const randomIndex = Math.floor(Math.random() * enabledNumbers.length)
  const randomNumber = enabledNumbers[randomIndex]
  const indexInOriginalArray = numbers.indexOf(randomNumber)

  newNumbers[indexInOriginalArray] = {
    ...newNumbers[indexInOriginalArray],
    disabled: true,
    pickOrder: newNumbers.length - enabledNumbers.length + 1
  }

  return newNumbers
}
