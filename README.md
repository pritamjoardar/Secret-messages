# Secret Messages Web Application

## Overview

Welcome to the Secret Messages Web Application! This platform allows users to send and receive messages securely while maintaining anonymity. The application features a robust login system with OTP (One-Time Password) verification to ensure the safety and privacy of user identities.

You can preview and try the website live in Vercel here : [secret-messages.com](https://secret-messages-bice.vercel.app/)

## Table of Contents

- Features
- Installation
- Usage
- Screenshots
- Technologies Used
- Contributing
- License

## Features

- Anonymous Identity: Users can communicate without revealing their true identity.
- Secure Login: Login system secured with OTP for verification.
- Message Encryption: All messages are encrypted to ensure privacy.
- User-Friendly Interface: Simple and intuitive design for ease of use.
- Cross-Platform: Compatible with both web and mobile devices.

## Installation

## Prerequisites
- Node.js
- npm

## Steps

1. Clone the repository:
  
  
```bash
git clone https://github.com/pritamjoardar/Secret-messages.git
cd secret-messages
```
2. Install dependencies:
```bash
npm install
  ```
3. Set up environment variables:
   
   Create a .env file in the root directory and configure the following variables:
```bash
DATABASE_URL=demo
OTP_SERVICE_API_KEY=demo
  ```
4. Run the application:
   
```bash
npm start
  ```
## Usage
1. Register: Create a new account using an anonymous identity.
2. Login: Enter your credentials and verify your identity using the OTP sent to your registered email.
3. Send Messages: Compose and send encrypted messages to other users.
4. Receive Messages: View received messages in your inbox, decrypted and secure.

# Screenshots
## Home Page
![image](https://github.com/pritamjoardar/Secret-messages/assets/111422356/b3c6bf4c-e61f-4789-85b4-b20ffe7d4d2d)

## Registration Page
![image](https://github.com/pritamjoardar/Secret-messages/assets/111422356/f135ecec-31f9-4b71-9c76-68a8da1a1925)

## OTP Verification
![image](https://github.com/pritamjoardar/Secret-messages/assets/111422356/502533e2-160f-42f9-923e-c2a6ead23895)

## Messaging Interface
## Copy the unique link
![image](https://github.com/pritamjoardar/Secret-messages/assets/111422356/cd866554-23bc-4e26-b95a-f89c41d81aa0)

## send messages to user without login

![image](https://github.com/pritamjoardar/Secret-messages/assets/111422356/0171e110-2d25-49f6-8a57-93570de4d33b)

## Technologies Used
- Frontend:
  - NextJs
  - HTML/CSS
  - TailwindCSS
  - shadcn
- Backend:
  - Node.js
  - Express.js
- Database:
  - MongoDB 
- Security:

  - next/auth for authentication
  - OTP (One-Time Password) for verification
  - bcrypt (Squared the password)

## Contributing
We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch 
3. Make your changes.
4. Commit your changes (git commit -m 'Add some feature').
5. Push to the branch (git push origin feature-branch).
6. Open a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
For any queries or issues, please reach out to:

- Link:  [https://www.pritamjoardar.online/](https://www.pritamjoardar.online/)
- GitHub: [pritamjoardar](https://github.com/pritamjoardar)

## Made with ❤️ by Pritam Joardar.

