import { use } from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function SignUp()
{
    const [firstNameVal ,setFirstNameVal] = useState("")
    const [lastNameVal, setLastNameVal] = useState("")
    
    const [userNameVal, setUserNameVal] = useState("")
    const [passwordVal, setPasswordVal] = useState("")

    useEffect(()=>{

        async function SignUpApi()
        {
            console.log("signup api function called")
            // const response = await fetch("http://localhost:5000/signup", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify({
            //         firstName: firstNameVal,
            //         lastName: lastNameVal,
            //         userName: userNameVal,
            //         password: passwordVal
            //     })
            // })
        }
    },[])
    return(
        <div className="bg-gray-400 h-screen flex flex-row justify-center items-center ">
            
            <SignupComponent setFirstNameVal={setFirstNameVal} setLastNameVal={setLastNameVal } 
            setUserNameVal={setUserNameVal} setPasswordVal={setPasswordVal} firstNameVal={firstNameVal}
            lastNameVal={lastNameVal} userNameVal={userNameVal} passwordVal={passwordVal} />
        </div>
    )
}


function SignupComponent({firstNameVal,lastNameVal,userNameVal,passwordVal, setFirstNameVal,setLastNameVal,setUserNameVal,setPasswordVal})
{
    const navigate = useNavigate()

    return(
        <div>


            

            <form className="space-y-4 bg-white p-6 rounded shadow-md pt-5">

                <h1 className="text-4xl font-bold text-center mb-4">Sign Up</h1>
                <h1 className="text-2xl font-sans text-gray-500 text-center ">Enter your information to create a new account</h1>

                <h1 className="text-xl font-medium text-left font-sans">First Name</h1>
                <input type="text" value={firstNameVal} onChange={(e)=>{setFirstNameVal(e.target.value)}} placeholder="First name" className="border p-2 w-full"/>

                <h1 className="text-xl font-medium text-left font-sans">Last Name</h1>
                <input type="text" value={lastNameVal} onChange={(e)=>{setLastNameVal(e.target.value)}} placeholder="Last name" className="border p-2 w-full"/>


                <h1 className="text-xl font-medium text-left font-sans">UserName</h1>
                <input type="text" value={userNameVal} onChange={(e)=>{setUserNameVal(e.target.value)}} placeholder="User name" className="border p-2 w-full"/>

                <h1 className="text-xl font-medium text-left font-sans">Password</h1>
                <input type="password" value={passwordVal} onChange={ (e)=>{setPasswordVal(e.target.value)}} placeholder="Password" className="border p-2 w-full"/>


                <button type="button" onClick={async()=>{
                        
                        const response = await fetch("http://localhost:3000/signup", {
                            method:"POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                userName:userNameVal,
                                firstName: firstNameVal,
                                lastName: lastNameVal,
                                password: passwordVal
                            })

                        })
                        const data = await response.json()
                        if(response.ok)
                        {
                                localStorage.setItem("token",data.token)
                                localStorage.setItem("userId",data._userId)
                                navigate("/dashboard")
                        }
                }} className="bg-black text-white p-2 w-full cursor-pointer">Sign Up</button>

                <div className="flex flex-row justify-center items-center gap-3">
                <h1 className="text-xl font-medium text-center font-sans">Already have an account?</h1>
                <h1 onClick={()=>{
                    navigate("/signin")
                }} className="underline underline-offset-1 font-medium cursor-pointer" >Login</h1>
                </div>
               

            </form>
        </div>
    )
}

export {SignUp}