# URL Shortener APP

# Description

The main goal of this app is to shorten a long URL into a short one.
Guest users would get an auto generated short URL. Members (registered users) on the other hand can create their own short URLs. 
Members have also a table in their home page that contains all their short URLS with the associated original URLs.

# Tech used

## Front-end

### React
A UI library that is used to build the front-end part of the app.
### PrimeReact
It is a React UI component library that helped in creating forms, tables, and Modals.
### PrimeFlex
Utility-first CSS library to accompany plain CSS.
### Yup
A JavaScript schema builder for value parsing and validation. It was used in this app to validate the sign-up form at front-end.

## Back-end

### Express
This framework was used to build the back-end part of the project
### Prisma ORM 
A next-generation object-relational mapper that was used to manage the database in the app.
### Passport.js
It is an authentication middleware for Node.js very helpful for managing authentication. It was used to authenticate users locally in the app via the session-based authentication technique. 
### express-validator
A middleware that is used to validate the registration form data at the back-end 

# Installation

1- Clone the repository by writing in the terminal the Linux command:
  
     git clone https://github.com/amjadsh92/url_shortener_project.git

2-  cd to both the Backend and Frontend directories and install all dependencies using

    npm install

3-  cd to the Backend directory.\
\
     Configure the database.\
\
    Prisma supports all the database management systems listed here: https://www.prisma.io/docs/orm/overview/databases. You can use that link to check how you can configure the app based on the database management system you are using.

4- For example, if you are using postgres:\
\
   Go to the .env file and configure database connection:
   
     DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"

   Replace username, password, and mydb(your database name) with your PostgreSQL details. If you are not using the app locally replace localhost with your host address.

5- In the prisma folder, open schema.prisma file and change the provider to "postgres" 

         datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }


 6- Run 
    
      npx prisma migrate dev

   To apply schema changes.

 7- Run

     npx prisma generate
   to generate prisma client.

 8- Run 

     npx prisma db seed

   to populate the Sessions table.
   
9- Go to Frontend directory and type

      npm run dev

   to run the front-end server.   

10- Go to Backend directory and type

      npm run dev

   to run the back-end server.      
   
     
   

      

    

    
    
    
    
    
     

