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
    favoriteRec: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Recommendation",
    }, 
});


userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword;
    }
});

const User = mongoose.model('User', userSchema)

export default User;