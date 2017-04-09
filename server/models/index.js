import TempUserSchema from './tempuser';
import UserSchema from './user';
import PatientSchema from './patient';
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB);

const User = mongoose.model('User', UserSchema, 'users');
const TempUser = mongoose.model('TempUser', TempUserSchema, 'tempusers');
const Patient = mongoose.model('Patient', PatientSchema, 'patients');

export { User, TempUser, Patient };
