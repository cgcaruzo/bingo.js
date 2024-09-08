import { useContext, useEffect } from 'react'
import { DataContext } from '../context/DataContext'
import { drawNumbers } from '../helpers/drawNumbers'
import { Number } from './Number'

function Main() {
  const { numbers, setNumbers } = useContext(DataContext) 




/*
      */  
  return (
    <>
      

      <main>
        {
          numbers.map((number, index) => {
            return (
            <div className="main-cell"
              key={index}>
              <Number 
                
                disabled={number.disabled}
                text={number.text}>
              </Number>
            </div>
            )
          })
        }
      </main>

    </>
  )
}

export default Main 