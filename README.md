# Frontend Protech Doctolib


## Description
### Goal
The goal of this project is to create the frontend of an appointment scheduler. The backend linked to the appointment scheduler can be found on [this gitlab repo](https://gitlab.emse.fr/protech-doctolib/protech-doctolib).

### How to use it?
To configure the link to the backend:
- In development mode: modify the address of the backend in the .env file.
- In production mode: modify the address of the backend in the .env.production file.

By default, the backend is located at http://localhost:8080 in development mode.

> :warning: If you are using the backend alongside this frontend, make sur to set the address of the frontend in the backend application to avoid CROS issues



This project is a Vue3 application. To launch it you need to have npm.Then go on the root directory and run
```
npm install
```
Then, to launch it in development mode run
```
npm run dev
```

Then, on your web browser, go to http://localhost:5173.
You will be prompted to enter a login and a password. By default, the user `admin@gmail.com` with the password `admin` is created with admin rights. You can also use the user `user@gmail.com` with the password `user` to have the user rights.

### What is it doing
This project is the frontend of an appointment scheduler. It provides graphical 2 graphical interfaces:

1. The User interface allows the user to:
- **Create** an account
- **See** available time slots in which it can make appointment
- **Make**,**modify**,**see** or **delete** appointments.
- **Change** its password if it forgot it
- **See** and **modify** personal information including the change of password.
- **Delete** its account

2. The admin interface allow the admin to:
- Have access to all the features a user have access 
- **Create**, **modify** and **delete** time slots in which the user can make appointment
- **See** the personal information of users
- **See** all the appointements with the names of the users 
- **Export to excel** appointements between certain dates



### Use
This repo is used by students of Mines Saint-Étienne Engineering school.

## Contributing
This project is not open to contributions.

## Licence
This project is licenced under MIT license.

## Contact
You can contact us by email at the address `quentin.rey@etu.emse.fr`


