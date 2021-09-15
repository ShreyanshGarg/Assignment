To setup the project on your local machine:

1. Click on `Fork`.
2. Go to your fork and `clone` the project to your local machine.
3. `git clone https://github.com/ShreyanshGarg/Assignment.git`
4. Install all the dependencie mentioned in package.json file of the project by using npm (npm i dependencie_name).
5. Make Sure to run your mongodb server (Type mongod in terminal)
6. And run the local server on port 3000.
----------------------------------------------------------------------------------------------------------------

Note:
.env is provided so you can directly run this project no need to create you own .env file
----------------------------------------------------------------------------------------------------------------

Features Implemented:
+ Designed schema for teacher & user {name,email,phonenumber,password} 
+ Authenticate using JWT
+ Student can add & remove the teacher from their favorite list
+ Find most favorite teacher using MongoDB aggregation
+ Encrypted password using bcrypt library
