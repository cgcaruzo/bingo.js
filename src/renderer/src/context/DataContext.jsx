import { useState } from "react";
import { createContext } from "react";

export const DataContext = createContext();

export const DataProvider = ({children}) => {

    const defaultNumbers = [...Array(90).keys()].map(i => i + 1)
        .map((n) => {
          return { disabled: false, text: n, pickOrder : null} 
        }
    )

    const [numbers, setNumbers] = useState(defaultNumbers);

    const restartNumbers = () => {
        setNumbers(defaultNumbers)
    }

    return (
        <DataContext.Provider 
            value={{numbers, setNumbers, restartNumbers}}
        >
            {children}
        </DataContext.Provider>
    )
}