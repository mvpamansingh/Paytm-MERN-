import { useLocation } from "react-router-dom"
import { SendComponent } from "./Dashboard"

function SendPage()
{

    const location = useLocation()
    const sendUserDetails = location.state?.sendUserDetails
    return(
        <div className="bg-gray-400 flex flex-row  items-center justify-center h-screen w-full">
            <SendComponent sendUserDetails={sendUserDetails}/>
        </div>
    )
}

export {SendPage}