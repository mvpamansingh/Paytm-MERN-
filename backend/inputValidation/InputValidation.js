const mongoose  = require('mongoose');
const zod = require('zod');

const signUpSchema = zod.object({
    userName:zod.string(),
    firstName :zod.string(),
      lastName:zod.string() , 
      password:zod.string()
})



const updateSchema = zod.object({
    userName:zod.string()
    , firstName:zod.string()
    , lastName:zod.string()
    ,password:zod.string()
})

const signInSchema = zod.object({

    userName:  zod.string(),
    password:zod.string()
})

// const sendMoneySchema = zod.object({
//     senderId: zod.instanceof(mongoose.Types.ObjectId),
//     recieverId: zod.instanceof(mongoose.Types.ObjectId),
//     money: zod.number(),
    
// })

const sendMoneySchema = zod.object({
    senderId: zod.string().refine(
        val => {
            try {
                return mongoose.Types.ObjectId.isValid(val);
            } catch (error) {
                return false;
            }
        },
        { message: "Invalid senderId format" }
    ),
    reciverId: zod.string().refine(
        val => {
            try {
                return mongoose.Types.ObjectId.isValid(val);
            } catch (error) {
                return false;
            }
        },
        { message: "Invalid reciverId format" }
    ),
    money: zod.number().positive(),
});
module.exports ={
    signUpSchema,
    updateSchema,
    signInSchema,
    sendMoneySchema
}