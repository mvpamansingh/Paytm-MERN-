import React from 'react'
import {BrowserRouter, Routes,Route ,useNavigate} from 'react-router-dom'
import { SignUp } from './components/SignUp'
import { SignIn } from './components/SignIn'
import { Dashboard, SendComponent } from './components/Dashboard'
import { SendPage } from './components/SendPage'
function App() {

  return (
    <div>
        {/* <Dashboard/> */}
      
        <BrowserRouter>

        <Routes>
          
          <Route path ="/signup" element ={<SignUp/>}/>
          <Route path = "signIn" element ={<SignIn/>} />
          <Route path = "/dashboard" element ={<Dashboard/>}/>

          <Route path="/sendMonney" element = {<SendPage/>}/>

        </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
