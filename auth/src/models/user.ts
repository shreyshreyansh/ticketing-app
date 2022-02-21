import mongoose from 'mongoose';

// An interface that describes the properties that are
// required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

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

// we will call this function every time we will create a new user
// instead of using new User(), because using the function we can
// use the typescript functionality as compared to the mongoose function
// new User()
const buildUser = (attrs: UserAttrs) => {
  // check types
  return new User(attrs);
};

export { User, buildUser };
