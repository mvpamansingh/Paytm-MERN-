import { useEffect, useState } from "react";


function Dashboard() {

  const [userList , setUserList] =useState([])
  const[currentBalance , setCurrentBalance] = useState(0)
  const [searchUserName, setSerchUserName] = useState("")
  const prameter = {
    filter: searchUserName
  }
  const balanceParameter = {
    userId:userId
  }

  const balanceQueryString = new URLSearchParams(balanceParameter).toString()

  const querySting = new URLSearchParams(prameter).toString()

  

  
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MjRkOTJiNmMyNjM0YWU4MzNkODJmNiIsImlhdCI6MTc0NzczNDE5N30.qwurAIn36btwFLDY3OaisJHrty0X-iI6uiFOUVj_kOY"
  useEffect(()=>{

    const fetchUserList = async()=>{

      const reponse = await fetch("http://localhost:3000/getAllUsers?" + querySting,{
        method:"GET",
        headers:{
          "Content-Type":"application/json",
          "authorization" : `Bearer ${token}`
      },

    }
      )

      if(!reponse.ok)
      {
        console.log("Error in fetching user list")
      }

      const data = await reponse.json()

      console.log("Data - " + data.allUsers)
      setUserList(data.allUsers)
    }

    const fetchCurrentBalance =async()=>{

      
      const response = await fetch("http://localhost:3000/getMybalance?",{
        method:"GET",
        headers:{
          "Content-Type":"application/json",
          "userId":userId
        }
      })

      if(!response.ok)
      {
        console.log("Error in fetching balnce")
      }
      
      const data = await response.json()
      setCurrentBalance(data.balance)
    }
    fetchCurrentBalance()

    fetchUserList()

  },[searchUserName, currentBalance])


  return (
    <div className="flex flex-col h-screen w-full pl-10 pr-10">
      <DashboardHeader userName={"aman"}/>
      <DashboardMainCopmonent currentBalance={1000} searchUserName={searchUserName} setSerchUserName={setSerchUserName} userList={userList}/>
    </div>
  );
}








function DashboardMainCopmonent({currentBalance,searchUserName, setSerchUserName, userList})
{

  return(
    <div className="flex flex-col  h-screen w-full">

      <div className="flex flex-row justify-start gap-2 items-center mb-16">
        <div className="text-3xl font-bold">
          Your balance
        </div>
         
        <div className="text-2xl font-medium">
          {currentBalance}
        </div>
      </div>

      <div className="flex justify-start font-bold text-3xl mb-5">
        Users
      </div>

      <input type ="text" value={searchUserName} onChange={(e)=>setSerchUserName(e.target.value)} placeholder="Search Users" className="w-full h-12 rounded-lg border-2 border-gray-300 mb-5 pl-5"/>

      <UsersListComponent userList={userList}/>
    </div>
  )
}

function UsersListComponent({userList})
{
  return(
    <div className="flex flex-col w-full h-screen">
      {
        userList.map((user,index)=>(
          <UserCardComponent key={index} user={user}/>
        ))
      }
    </div>
  )
}


function SendComponent({sendUserDetails})
{
  return(
    <div className="flex flex-col mb-10 h-[700px] w-[700px] bg-white rounded-lg shadow-md p-5 justify-center items-center">

      <div className="text-3xl font-bold mb-10 ">Send Money</div>

      <div className=" flex flex-row justify-start items-center gap-3 w-full">
        <div className="rounded-full bg-green-300 w-16 h-16">
          <div className="justify-center items-center h-full flex flex-row text-2xl ">
          {sendUserDetails.username.charAt(0).toUpperCase()}
          </div>

        </div>
        <div className="text-2xl font-bold">{sendUserDetails.firstName}</div>

      </div>
      
      <div className="flex justify-start text-xl w-full pt-10 pb-5 font-normal">
        Enter the amount you want to send
      </div>
      
      <input type="text" placeholder= "Enter amount" className="rounded-lg border-3 border-gray-300 h-12 pl-5 w-full mb-4"></input>

     <button onClick={()=>{

     }} className="w-full h-12 bg-green-500 text-white rounded-lg">Send Money</button>
    </div>
  )
}
function UserCardComponent({user})
{
  console.log("users-" +user)
  return(
    <div className="flex flex-row justify-between items-center h-19 ">

    
    <div className="flex flex-row justify-start items-center gap-3">
      <div className="rounded-full h-12 w-12 bg-gray-300">
        <div  className="flex flex-col h-full items-center justify-center">{user.username.charAt(0).toUpperCase()}</div>
      </div>
      
      <div className="flex flex-row text-4xl">
        {user.firstName} {user.lastName}
      </div>

    </div>

    <button onClick={()=>{

    }} className="bg-black text-white rounded-lg h-10 w-30  ">Send Money</button>
    </div>
  )
}
function DashboardHeader({userName})
{
  return(
    <div className="flex flex-row justify-between items-center mb-10 pl-10 pr-10 pt-5 pb-3 border-b-2 border-gray-300">
      
      <h1 className="text-5xl font-bold">Paytm</h1>

      <div  className="flex flex-row justify-end items-center gap-3">
      <h1 className="text-3xl font-medium">Hello {userName}</h1>

      <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">

                <div className="flex flex-col justify-center h-full text-xl">
                  {userName.charAt(0).toUpperCase()}
                </div>
          </div>
      </div>
    </div>
  )
}
export { Dashboard ,SendComponent };