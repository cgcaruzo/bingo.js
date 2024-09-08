import arrozPedroniLogo from '../assets/arrozPedroni.jpg'
import { useContext, useEffect } from 'react'
import { DataContext } from '../context/DataContext'
import { drawNumbers } from '../helpers/drawNumbers'

function HeaderLeft() {
  const { numbers, setNumbers } = useContext(DataContext) 

  const handleClick = (e) => {
    e.preventDefault()
    const newNumbers = drawNumbers(numbers)
    setNumbers(newNumbers)
  }
/*<h1 className="title">El Arroz del Pedroni</h1>*/
  return (
    <>
      <header className="header-left">
        
        <h1 className="big-title">Bingo</h1>
      </header>
    </>
  )
}

export default HeaderLeft
