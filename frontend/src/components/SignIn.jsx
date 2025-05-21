import { useState } from "react"
import { useNavigate } from "react-router-dom"



function SignIn()
{


    const [userNameVal, setUserNameVal] = useState("")
    const [passwordVal, setPasswordVal] = useState("")

    return(
        <div className="bg-gray-400 flex flex-row  items-center justify-center h-screen w-full">
            
            <SignInComponent userNameVal={userNameVal} passwordVal={passwordVal} setPasswordVal={setPasswordVal} setUserNameVal={setUserNameVal} />
        </div>
    )
}





function SignInComponent({userNameVal, passwordVal, setUserNameVal, setPasswordVal})
{
    const navigate = useNavigate()
    return(
        <div>


            

            <form className="space-y-4 bg-white p-6 rounded-lg shadow-md pt-5">

                <h1 className="text-4xl font-bold text-center mb-4">Sign In</h1>
                <h1 className="text-2xl font-sans text-gray-500 text-center ">Enter your credential to access your account</h1>



                <h1 className="text-xl font-medium text-left font-sans">UserName</h1>
                <input type="text" value={userNameVal} onChange={(e)=>{setUserNameVal(e.target.value)}} placeholder="User name" className="border p-2 w-full"/>

                <h1 className="text-xl font-medium text-left font-sans">Password</h1>
                <input type="password" value={passwordVal} onChange={(e)=>{setPasswordVal(e.target.value)}} placeholder="Password" className="border p-2 w-full"/>


                <button type="button" onClick={ async()=>{
                     console.log(`UserName: ${userNameVal} Password: ${passwordVal}`)

                     const response = await fetch("http://localhost:3000/signin", {
                        method:"POST",
                        headers:{
                            "Content-Type":"application/json"
                        },
                        body:JSON.stringify({
                            userName:userNameVal,
                            password:passwordVal
                        })
                     })

                     const data = await response.json()
                        console.log(data)
                     if(data.res=="success")
                     {
                        console.log("Login Success")
                        localStorage.setItem("token", data.token)
                        localStorage.setItem("userId", data._userId)
                        navigate("/dashboard")
                     }
                }
                   
                } className="bg-black text-white p-2 w-full cursor-pointer">Sign Up</button>

                <div className="flex flex-row justify-center items-center gap-3">
                <h1 className="text-xl font-medium text-center font-sans">Don't have an account?</h1>
                <h1 onClick={
                    ()=>{
                        navigate("/signup")
                    }
                } className="underline underline-offset-1 font-medium cursor-pointer" >SignUp</h1>
                </div>
               

            </form>
        </div>
    )
}

export {SignIn}