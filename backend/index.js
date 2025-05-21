const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")
const app = express();
const jwt =   require("jsonwebtoken")
const {User, Accounts} = require("./models/Users");

const { signUpSchema, updateSchema, signInSchema, sendMoneySchema } = require("./inputValidation/InputValidation");
const { JWT_SECRET } = require("./config");
const { authMiddleware } = require("./authMiddleware");

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://aman:pekqNxZgJNQr9mBo@my-c.ab2v591.mongodb.net/",{useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>{console.log("Connected to MongoDb")})
.catch((err)=>{ console.log("Error while connecting to MongoDB" + err)})

app.get("/", (re,res)=>{

    res.json({
        mssg:"Hello There from backend"
    })
})

app.post("/signUp",async (req,res)=>{

 const {userName,firstName,  lastName , password} = req.body

 try{

    const parseData = signUpSchema.safeParse(req.body)

    if(!parseData.success)
    {
        return res.json({
            message:"Wrong input data",
        })
    }
    const userExists = await User.countDocuments({userName:userName})
    if(userExists>0)
    {
        return res.status(400).json({
            mssg:"User already exists"
        })
    }
    const newUser = new User({
        userName:userName,
        firstName: firstName,
        lastName: lastName,
        password:password
     })

     
     const newU = await newUser.save()
     const id = newU._id
     const newAccount = new Accounts({
        userId:id,
        balance:randomIntFromInterval(500,1000)
     })

await newAccount.save()
    const JWT_token = jwt.sign({id},JWT_SECRET)

     res.json({
        message :"User added !",
        token:JWT_token,
        _userId:id
    })

 }
 catch(err)
 {
    console.log("Error in adding user " + err)
    res.status(500).json({
        message :"Error in adding user"
    })
 }




});

app.put("/updateUser", authMiddleware,async (req,res)=>{

    const {userName, firstName, lastName,password} = req.body

    
    try{

        const parsedata =updateSchema.safeParse(req.body)

        if(!parsedata.success){
            return res.json({
                message:"Wrong input data",
            })
        }
        
        const updatedUser =await User.findOneAndUpdate({userName:userName},{firstName:firstName,lastName:lastName,password:password},{ new: true })

        if(!updatedUser)
        {
            console.log("User not found")

            return res.status(400).json({
                "message":"User not found"
            })
        }
        
        res.status(200).json({
            message:  "Userupdate successfully",
            updatedUser:updatedUser
        })
    }
    catch(err)
    {
        console.log("Error in updating user " + err)
        res.status(500).json({
            message :"Error in updating user"
        })
    }



});

app.post("/signIn",async (req,res)=>{

 const {userName ,password} = req.body

 try{

    const parseData = signInSchema.safeParse(req.body)

    if(!parseData.success)
    {
        return res.status(400).json({
            message:"Wrong inputs"
        })

    }

    const userExist = await User.countDocuments({userName:userName,password:password})

    if(userExist===0)
    {
        return res.status(400).json({
            message:"User not found / or password is incorrect"
        })
    }
const currentUser =await User.findOne({userName:userName,password:password})

const id = currentUser._id

    const token = jwt.sign({id},JWT_SECRET)

    res.json({
        res:"success",
        token:token,
        _userId:id
    })

 }
 catch(err)
 {
    console.log(`Error - ${err}`)
    res.status(500).json({
        res:"fail",
        message :"Error in signing in user"
    })
 }
});
app.get("/getAllUsers", authMiddleware ,async (req,res)=>{

    const {filter} = req.query || ""
    try{
        const allUsers =await User.find({
            $or :[
                {
                    'firstName' : {'$regex' : filter}
                },
                {
                    'lastName' : {'$regex' :filter }
                }
            ]
        }

            // Will throw error if used with await syntax 
        //     ,(err,res)=>{
        //     if(err)
        //     {
        //         console.log("Error in getting all users " + err)
        //     }
        //     else if(res)
        //     {
        //         console.log("All users " + res)
        //     }
        // }
    )
    
        res.json({
            allUsers:allUsers.map(user => ({
                username: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                _userid: user._id
            }))
        })
    }
    catch(err)
    {
        console.log("Error in getting all users " + err)
        res.status(500).json({
            message :"Error in getting all users"
        })
    }


});


app.get("/getMybalance", async (req,res)=>{

    const {userId} = req.query

    try{

        const mybalance = await Accounts.findOne({userId:userId})

        if(!mybalance)
        {
            return res.status(400).json({
                message:"Account not found"
            })
        }
        
        res.status(200).json({
            balance:mybalance.balance
        })
    }
    catch(err)
    {
        res.status(500).json({
            message:"Error in getting balance"
        })
    }

})

app.post("/sendMoney", async(req,res)=>{

    const {reciverId , money, senderId } =req.body

    try{

        const parseData = sendMoneySchema.safeParse(req.body)
        if(!parseData.success)
        {
            return res.status(400).json({
                message:"Wrong Input data",
                details:parseData.error.errors
            })
        }

        const senderAccount = await Accounts.findOne({userId:senderId})
        const recieverAcount = await Accounts.findOne({userId:reciverId})

        if(!recieverAcount)
        {
            return res.status(400).json({
                message:"Reciever account not found"
            })
        }

        if(!senderAccount)
        {
            return res.status(400).json({
                message:"Sender account not found"
            })
        }

        if(senderAccount.balance<money)
        {
            res.status(400).json({
                message:"Insufficient balance"
            })
        }

        const session = await mongoose.startSession()
         session.startTransaction()

        try{
            const newReceverbalance = recieverAcount.balance +money
            const newSenderbalance= senderAccount.balance -money
    
            await Accounts.findOneAndUpdate({userId:senderId},{balance:newSenderbalance})
            await Accounts.findOneAndUpdate({userId:reciverId},{balance:newReceverbalance})
            await session.commitTransaction()
            res.status(200).json({
                message:"Money sent successfully"
            })
        }
        catch(err)
        {
            
            session.abortTransaction()
            console.log("Error in sending money " + err)
            res.status(500).json({
                message:"Error in sending money"
            })
        }
        finally{
            session.endSession()
        }
      
    }
    catch(err)
    {   
        console.log("Error in sending money " + err)
        res.status(400).json({
            message:"Error in sending money"
        })

    }
})


app.listen(3000, (err)=>{

    if(err)
    {
        console.log("Error in starting server" + err)
    }
    else
    {
        console.log("Server running on port " + 3000)
    }
})


function randomIntFromInterval(min, max) {
    // Ensure min and max are integers
    min = Math.ceil(min);
    max = Math.floor(max);
    // Generate random number, scale to range, round down, and shift by min
    return Math.floor(Math.random() * (max - min + 1)) + min; 
  }