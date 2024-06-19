import mongoose, { Schema, Document } from 'mongoose';


export interface Message extends Document {
    content: string;
    createdAt: Date;
}


const MessagingSchema: Schema = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});


export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpirey: Date;
    isAcceptingMessages: boolean;
    messages: Message[];
    isVerified: boolean;

}


const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']  // regex for email  

    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    verifyCode: {
        type: String,
        required: [true, 'verify code is required']
    },
    verifyCodeExpirey: {
        type: Date,
        required: true
    },
    isAcceptingMessages: {
        type: Boolean,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    messages: [MessagingSchema]
});


/// export the model

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);

export default UserModel;