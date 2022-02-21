import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    // this type is NOT for typescript
    // it is for the mongoose (notice the capital 's')
    // here String is refering to an actual constructor
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

export { User };
