import { useContext } from 'react'
import { DataContext } from '../context/DataContext'
import { Number } from './Number'

function Main() {
  const { numbers } = useContext(DataContext)

  return (
    <>
      <main>
        {numbers.map((number) => {
          return (
            <div className="main-cell" key={number.text}>
              <div
                className="number-wrapper"
                title={
                  number.disabled
                    ? `Sacado en posición #${number.pickOrder}`
                    : `Número ${number.text}`
                }
              >
                <Number disabled={number.disabled} text={number.text} />
              </div>
            </div>
          )
        })}
      </main>
    </>
  )
}

export default Main
