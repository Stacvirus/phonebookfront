import React, { useState } from "react"

function Notify({options}){  
    const [name, setName] = useState('')
    
    function message(){

        let msg = ''
        console.log(options.name)
        if(options.clr == "green"){
            msg = `Added ${options.name}`
         } 
         else{
            msg = `${options.name}`
        }
        return msg;
    }
    const notifyStyles = {
        color: options.clr,
        border: `4px solid ${options.clr}`,
        borderRadius: "5px",
        bacground: "gray",
        padding: "10px 5px",
        fontWeight: "bold",
        fontSize: "20px",
        display: !options.name && "none"
    }
    return(
        <div style={notifyStyles}>
            { options.name && message()}
        </div>
    )
}

export default Notify;