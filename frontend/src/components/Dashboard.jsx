import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"


function Dashboard() {

    const token = localStorage.getItem("token")
  const userId= localStorage.getItem("userId")

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

      
      const response = await fetch("http://localhost:3000/getMybalance?"+balanceQueryString,{
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
  const[money, setMoney] = useState(0)
  const userId =localStorage.getItem("userId")
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
      
      <input type="number" value={money} onChange={(e)=>setMoney(e.target.value)} placeholder= "Enter amount" className="rounded-lg border-3 border-gray-300 h-12 pl-5 w-full mb-4"></input>

     <button onClick={async()=>{

      // const response = await fetch("http://localhost:3000/sendMoney", {
      //   method:"POST",
      //   headers:{
      //     "Content-Type":"application/json"
      //   },
      //   body:JSON.stringify({
      //     senderId:userId,
      //     money:money,
      //     reciverId:sendUserDetails._userid 
      //   })
      // })

      // if(!response.ok)
      // {
      //   console.log("Error in sending money")
      // }

      // const data = await response.json()
      // console.log("Data - " + data)
        const moneyAmount = parseFloat(money);
  
  if (isNaN(moneyAmount) || moneyAmount <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  // Log the data being sent for debugging
  console.log("Sending:", {
    senderId: userId,
    money: moneyAmount,
    reciverId: sendUserDetails._userid
  });

  const response = await fetch("http://localhost:3000/sendMoney", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authorization": `Bearer ${localStorage.getItem("token")}`  // Add auth token
    },
    body: JSON.stringify({
      senderId: userId,
      money: moneyAmount,
      reciverId: sendUserDetails._userid
    })
  });

  // Better error handling
  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error in sending money:", errorData);
    alert(errorData.message || "Failed to send money");
    return;
  }

  const data = await response.json();
  console.log("Success:", data);
  alert("Money sent successfully!");
  
     }} className="w-full h-12 bg-green-500 text-white rounded-lg">Send Money</button>
    </div>
  )
}
function UserCardComponent({user})
{
  const navigate = useNavigate()
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
      navigate("/sendmoney",{
        state:{
          sendUserDetails:user,
        }
      })
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