# TypeScript E-Commerce Website

![gift's-shop](/frontend/public/images/gift.jpg)

## [2024]

Welcome to my E-commerce website app providing a means for users to buy goods and goods to be delivered to them. It uses next js, node with typescript, mongo-Db for a database, paypal and stripe.

## Push

git add . && git commit -m "m" && git push aws
12



## Demo Website

- 👉 Render : [My website](https://final-personal-project-frontend.vercel.app)


## Run Locally

### 1. Clone repo

```shell
     git clone https://github.com/Giftmasil/final-personal-project.git
     cd final-personal-project
```

### 2. Create .env File

- duplicate .env.example in backend folder and rename it to .env

### 3. Setup MongoDB

- Local MongoDB
  - Install it from [here](https://www.mongodb.com/try/download/community)
  - In .env file update MONGODB_URI=mongodb://localhost/amazona
- OR Atlas Cloud MongoDB
  - Create database at [https://cloud.mongodb.com](https://cloud.mongodb.com)
  - In .env file update MONGODB_URI=mongodb+srv://your-db-connection

### 4. Run Backend

```shell
 cd backend
 npm install
 npm run build
 npm start
```

## 4.1 Run Backend in Dev Mode

```shell
 cd backend
 npm install
 npm run dev
```

### 5. Run Frontend

```shell
# open new terminal
$ cd frontend
$ npm install
$ npm run build
$ npm start
```

## 5.1 Run Frontend in Dev Mode

```shell
# open new terminal
$ cd frontend
$ npm install
$ npm run dev
```


### 7. Admin Login

- Enter admin email and password and click signin
- email: gift@gmail.com
- password: muuo
  
## 8. Running tests

- Run tests in the frontend. Make sure you are in the root directory

```shell
 npx playwright test
```

- Run test in the backend.

```shell
 cd backend
 npm test
```

## 9. Deploying

- Deploy to Vercel for frontend
- Deploy to Render for backend


## 10. Potential bugs to encounter

- In light mode, you will not be able to see the dropdown menu arror in the admin and user part of the topbar. 
- the map section may not work well. 
- Stripe payment method might not work saying it does not allow it on insecure sites.

## Support

- Contact Builder: [Gift](mailto:masilagift@gmail.com)
