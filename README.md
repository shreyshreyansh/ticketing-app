# Ticketing App
A microservice architecture that provides services for buyers and sellers of tickets for sports, concerts, theater and other live entertainment events.

## Features
- Production grade authentication service
- Sellers can list their tickets
- Sellers can update the price of the listed ticket
- Buyers are buy tickets
- Buyers will have a 15 minutes window to buy a ticket
- During that 15 minutes window no one can buy the ticket
- Handles the case when buyer buy the ticket and seller at the same time increases the price of the ticket
- Production grade payment service

## Design
<img src='https://user-images.githubusercontent.com/53744971/154432135-bd3d116d-1a00-475e-a490-be849607266f.jpg' width='600' /> <br/>
```
Here common refers to a npm custom build library by us, which will be shared with all the services
```

## Tech Stack
- `Next.js`
- `Node.js`
- `Express.js`
- `Mongodb`
- `Redis`
- `NATS`
- `Stripe.js`
- `Typescript`

## Services
- `auth`: Everything related to user signup/signin/signout
- `tickets`: Tickets creation/editing. Knows whether a ticket can be updated
- `orders`: Order creation/editing
- `expiration`: Watches for order to be created, cancels them after 15 minutes
- `payments`: Handles credit card payments. Cancels order if payments fails, completes if payment succeeds

*Auth*
|Route|Method|Body|Purpose|
|:--------:|:--------:|:--------:|:--------:|
|api/users/signup|POST|{email: string, password: string}|Signup for an account|
|api/users/signin|POST|{email: string, password: string}|Signin to an existing account|
|api/users/signout|POST|{}|Signout of an account|
|api/users/currentuser|GET|-|Return info about the user|

## Schema
- *User*
  |   Name   |   Type   |
  |:--------:|:--------:|
  |  email   |  string  |
  | password |  string  |

- *Ticket*
  |   Name   |   Type   |
  |:--------:|:--------:|
  |  title   |  string  |
  |  price   |  number  |
  |  userId   |  Ref to User  |
  |  orderId   |  Ref to Order  |

- *Order*
  |   Name   |   Type   |
  |:--------:|:--------:|
  |  userId   |  Ref to User  |
  |  status   |  Created, Cancelled, Awaiting payment, Completed  |
  |  ticketId   |  Ref to Ticket  |
  |  expiresAt   |  Date  |

- *Charge*
  |   Name   |   Type   |
  |:--------:|:--------:|
  |  orderId   |  Ref to Order  |
  |  status   |  Created, Failed, Completed  |
  | amount | number|
  |  stripeId   |  string  |
  |  stripeRefundId   |  string  |

## Events
- `UserCreated` `UserUpdated`
- `OrderCreated` `OrderCancelled` `OrderExpired`
- `TicketCreated` `TicketUpdated`
- `ChargeCreated`

## GCP Integration
- when we make changes in the `synced` files <br/>
<img src='https://user-images.githubusercontent.com/53744971/154624748-b23ef477-5a05-4da3-8366-42cb6aece326.jpg' width='600' /> <br/>
- when we make changes in the `unsynced` files <br/>
<img src='https://user-images.githubusercontent.com/53744971/154624908-d449959b-341c-4809-ae53-5a56daa90589.jpg' width='600' /> <br/>

## Error Handling!
- we will make two classes `RequestValidationError` and `DatabaseConnectionError` which will extend to the `Error` class and so that they can add custom features to the `Error` class like reason of the error and message to show regarding the error
- inside the `error-handler` middleware we will check if it is invoked due to the `RequestValidationError` or `DatabaseConnectionError`, and based on the error type it will send custom messages to the client
<img src='https://user-images.githubusercontent.com/53744971/154793278-468bc44c-d13c-4f44-953d-1a29b9a711ca.jpg' width='600' /> <br/>

### Error Response
- All error response that we send out from our server will have this structure
```
{
  errors: {
    message: string,
    field?: string
  }[]
}
```

### Custom Errors Verification
- All the error classes like `RequestValidationError` and `DatabaseConnectionError` should contain a `statusCode` variable and a `serializeErrors` method.
- To ensure all error classes *stick to the rule* we will make a **CustomError Abstract Class**
```
NOTE: on abstract class
- cannot be instantiated
- used to setup requirements for subclasses
- when we compile TS to JS, we end up with a class definition in JS from abstract class in TS unlike an interface as it does not exist in JS 
```

## Signup Flow
<img src='https://user-images.githubusercontent.com/53744971/154844948-9d9079c9-6fbc-4d59-b956-cfa830ccfee9.jpg' width='800' /> <br/>

## MongoDB User Collection
- `Mongoose User Model` represents the entire collection of users
- `Mongoose User Document` represents one single user <br/>
<img src='https://user-images.githubusercontent.com/53744971/154901624-8539d931-1a3f-4baf-9c2d-6e6ca2880d6f.jpg' width='600' /> <br/>

## Auth Mechanism
- We will be using JWT with cookies for our auth mechanism <br/>
<img src='https://user-images.githubusercontent.com/53744971/155264598-315fd270-a753-4590-8a05-eb87048fb86a.jpg' width='600' /> <br/>
- Because we're using `Next.js`, we're conducting server-side rendering, which means that if we want the client's initial request to include a JWT token, we'll have to rely on cookies <br/>
<img src='https://user-images.githubusercontent.com/53744971/155265164-5cfbbfbb-d2d0-47f3-8cef-f3753bc8ee7e.jpg' width='600' /> <br/>

## Storing secrets in K8s cluster
- In our Kubernetes cluster, we build an object called `secret` that contains multiple key-value combinations and is shared across all pods through environment variables.<br/>
<img src='https://user-images.githubusercontent.com/53744971/155273850-c995e808-ff71-47c6-b1ca-bd15e5d285fc.jpg' width='600' /> <br/>
- Creating a secret object (imperative)
```
kubectl create secret generic jwt-secret --from-literal=jwt=asdf
```

## Signin Flow
<img src='https://user-images.githubusercontent.com/53744971/155291547-7f02a078-e1c3-497f-9334-b244f8e73c89.jpg' width='600' /> <br/>

## Current User Flow
- This route is used to check if the user accessing the resources is logged in <br/>
<img src='https://user-images.githubusercontent.com/53744971/155298665-d5729d18-8290-4f32-81db-1cf3cb8ac908.jpg' width='600' /> <br/>

## Testing
### Workflow
<img src='https://user-images.githubusercontent.com/53744971/155828813-ac239c90-b571-47aa-8b8c-c6dd89a957d2.jpg' width='600' /> <br/>

## Client
### Component tree
<img src='https://user-images.githubusercontent.com/53744971/156011878-e45edbb2-2bf4-4115-88c2-d6b4f6b67ad2.jpg' width='600' /> <br/>
