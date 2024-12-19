import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String, 
        required: true, 
        unique: true,
    },
    hashedPassword: {
        type:String,
        required: true},
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword;
    }
});

const User = mongoose.model('User', userSchema)

export default User;