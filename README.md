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

## Tech Stack
- `Typescript`
- `Node.js`
- `Express.js`
- `Stripe.js`

## Services
- `auth`: Everything related to user signup/signin/signout
- `tickets`: Tickets creation/editing. Knows whether a ticket can be updated
- `orders`: Order creation/editing
- `expiration`: Watches for order to be created, cancels them after 15 minutes
- `payments`: Handles credit card payments. Cancels order if payments fails, completes if payment succeeds

## Schema
![Screenshot 2022-02-17 130943](https://user-images.githubusercontent.com/53744971/154428157-46a28bc1-9eff-423e-bc14-9cac13ac0646.jpg)
