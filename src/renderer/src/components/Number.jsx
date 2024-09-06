function Number({disabled, text}) {

  if (disabled) {
    return <div className="main-cell"><div className="number disabled">{text}</div></div>
  } else { 
    return <div className="main-cell"><div className="number">{text}</div></div>
  }
  
}

export default Number
