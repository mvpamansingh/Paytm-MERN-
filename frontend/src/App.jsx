import React from 'react'
import {BrowserRouter, Routes,Route ,useNavigate} from 'react-router-dom'
import { SignUp } from './components/SignUp'
import { SignIn } from './components/SignIn'
import { Dashboard, SendComponent } from './components/Dashboard'
import { SendPage } from './components/SendPage'
import { ProtectedRoute } from './components/Protected'
function App() {

  return (
    <div>
        {/* <Dashboard/> */}
      
        <BrowserRouter>

        <Routes>
          <Route path= "/" element = {<SignUp/>}/>
          <Route path ="/signup" element ={<SignUp/>}/>
          <Route path = "signin" element ={<SignIn/>} />
          <Route path = "/dashboard" element ={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
            }/>

          <Route path="/sendmoney" element = {
            <ProtectedRoute>
              <SendPage/>
            </ProtectedRoute>
            
            }/>

        </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
