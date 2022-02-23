import mongoose from 'mongoose';

import { Password } from '../services/password';

// An interface that describes the properties that are
// required to create a new User
// (what it takes to create a user)
interface UserAttrs {
  email: string;
  password: string;
}

// An inteface that describes the properties that a User Model has
// (what entire collection of users looks like)
// The reason for making this interafe is the using userSchema.statics.build
// doesn't inform TS that User model will have a build() function.
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties that a User Document has
// (what properties a single user has)
/**
    This interface is used because the properties we pass to the user constructor
    don't match with the properties available on a user
    E.g,
    const user = new User({ email: 'test@test.com', password: '123456' });
    console.log(user); // { email: '...', password: '...', createdAt: '...', updatedAt: '...' }
    So, here we can see additional properties we added by the mongoose to we have to inform
    TS about this.
 */
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  // if we have extra properties we should add here
  // createdAt: string;
  // updatedAt: string;
}
const userSchema = new mongoose.Schema(
  {
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
  },
  {
    // mongoose will use this to covert its object to json
    // therefore we can customize it to the response we want
    // to give to the client
    toJSON: {
      /**
       *
       * @param doc The mongoose document which is being converted
       * @param ret The plain object representation which has been converted
       */
      transform(doc, ret) {
        // we don't want to show password property in any JSON representation
        delete ret.password;

        // we don't want to show version property in any JSON representation
        delete ret.__v;

        // renaming _id to id
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

/**
 * 
    We may also define our own custom document instance methods.
    ---
    // define a schema
    const animalSchema = new Schema({ name: String, type: String });

    // assign a function to the "methods" object of our animalSchema
    animalSchema.methods.findSimilarTypes = function(cb) {
        return mongoose.model('Animal').find({ type: this.type }, cb);
    };

    Now all of our animal instances have a findSimilarTypes method available to them.

    const Animal = mongoose.model('Animal', animalSchema);
    const dog = new Animal({ type: 'dog' });

    dog.findSimilarTypes((err, dogs) => {
        console.log(dogs); // woof
    });
    ---
 */

/**
 * 
    You can add static functions to your model. There are two equivalent ways to add a static:
        -   Add a function property to schema.statics
        -   Call the Schema#static() function
    ---
    // Assign a function to the "statics" object of our animalSchema
    animalSchema.statics.findByName = function(name) {
        return this.find({ name: new RegExp(name, 'i') });
    };
    // Or, equivalently, you can call `animalSchema.static()`.
    animalSchema.static('findByBreed', function(breed) { return this.find({ breed }); });

    const Animal = mongoose.model('Animal', animalSchema);
    let animals = await Animal.findByName('fido');
    animals = animals.concat(await Animal.findByBreed('Poodle'));
    ---
 */

// mongoose pre save hook to hash the password before storing it into the database
userSchema.pre('save', async function (done) {
  // use case: this function will run even if we update an existing customer in the collection
  // so if the user changes the email, we will again hash the hashed password therefore we will
  // first check if the user's password is modified then only do the hashing
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  // as mongoose is an old library it does not handle async await therefore it provides us with a
  // callback function done to know when the function is over
  done();
});

// we will call this function from our model every time we will create a new user
// instead of using plain new User(), because using the function we can
// use the typescript functionality as compared to the naked mongoose function
// new User()
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// we told TS that User model will have a build property with the help of
// UserDoc, UserModel interfaces used in model generic
/**
    // function definition of mongoose.model
    // it accepts the type document(T) and model(U) and returns a model(U)
    export function model<T extends Document, U extends Model<T>>(...):U;
 */
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// we can use User.build() to create a new user
/**
 * 
    Example
    const user = User.build({
        email: 'test@test.com',
        password: '123456'
    });

    NOTE: TS compiler will still show error for User.build
    saying that Property 'build' does not exist on type 'Model<any, {}, {}, {}>'.
    Therefore we need to create an interface for a User model (UserModel) in which we will give
    the build function manually and we will create a user document (UserDoc) to represent the 
    single user inside the collection and use it in UserModel
 */

export { User };
