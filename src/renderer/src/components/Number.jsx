function Number({disabled, text}) {

  if (disabled) {
    return <div className="number disabled">{text}</div>
  } else { 
    return <div className="number">{text}</div>
  }
  
}

export default Number
