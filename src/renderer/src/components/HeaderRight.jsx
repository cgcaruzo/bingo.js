import arrozPedroniLogo from '../assets/arrozPedroni.jpg'
import { useContext, useEffect, useState } from 'react'
import { DataContext } from '../context/DataContext'
import { drawNumbers } from '../helpers/drawNumbers'
import { Number } from './Number'

function HeaderRight() {
  const { numbers, setNumbers, restartNumbers } = useContext(DataContext) 
  const [ isPlaying, setIsPlaying ] = useState(false)
  const [ isMixing, setIsMixing ] = useState(false)
  const [intervalId, setIntervalId] = useState(null);

  const handleClick = (e) => {
    e.preventDefault()
    const newNumbers = drawNumbers(numbers)
    setNumbers(newNumbers)
  }

  const handlePlay = (e) => {
    e.preventDefault()
    console.log("PLAYING1", isPlaying)
    setIsPlaying(!isPlaying)

  
    console.log("PLAYING2", isPlaying)
  }

  const handleRestart = (e) => {
    e.preventDefault()
    const resp = confirm("¿Quiere reiniciar el tablero?")
    if (resp) {
      clearInterval(intervalId)
      setIntervalId(null)
      setIsPlaying(false)
      restartNumbers()
    }
  }

  useEffect(() => {
    const myFunction = () => {
      const newNumbers = drawNumbers(numbers)
      if (newNumbers) {
        setNumbers(newNumbers)
        try {
          const lastDrawn = document.getElementsByClassName("last-drawns")[0].getElementsByTagName("li")[0].getElementsByClassName("number")[0] || null
          lastDrawn.style.animation = 'none'
          lastDrawn.offsetWidth
          lastDrawn.style.animation = ''
          const bigNumber = document.getElementById("big-number").getElementsByClassName("number")[0]
          bigNumber.style.animation = 'none'
          bigNumber.offsetWidth
          bigNumber.style.animation = ''
        } catch (e) {
          console.log(e)
        }

      } else {
        clearInterval(intervalId)
      }
      
    }

    if (isPlaying) {
      document.getElementById("btn-play").innerHTML =  "⏸"
      const id = setInterval(myFunction, 5000)
      setIntervalId(id) 
    } else {
      document.getElementById("btn-play").innerHTML = "▶"
      clearInterval(intervalId)
      setIntervalId(null)
    }


    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isPlaying])

  return (
    <>
      <header className="header-right">
        <div id="big-number" className="big-number">
          {
            numbers.filter(n => n.disabled)
                  .sort((n1,n2)=> n1.pickOrder - n2.pickOrder)
                  .slice(-1)
                  .reverse()
                  .map((number, index) => 
                      <Number 
                        key={index}
                        disabled={false}
                        text={number.text}>
                      </Number>
                  )
          }
        </div>
        <ul className="last-drawns">
          {
            numbers.filter(n => n.disabled)
                  .sort((n1,n2)=> n1.pickOrder - n2.pickOrder)
                  .slice(-6,-1)
                  .reverse()
                  .map((number, index) => 
                    <li key={index}>
                      <Number 
                        key={index}
                        disabled={false}
                        text={number.text}>
                      </Number>
                    </li>
                  )
          }
        </ul>
        <ul className="buttons">
          <li key="1">
            <button id="btn-play" onClick={handlePlay }>▶</button>
          </li>
          <li key="2">
            <button onClick={handleRestart }>🔁</button>
          </li>
        </ul>
      </header>
    </>
  )
}

export default HeaderRight
