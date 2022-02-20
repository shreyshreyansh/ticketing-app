# Ticketing App
Provides services for buyers and sellers of tickets for sports, concerts, theater and other live entertainment events.

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


