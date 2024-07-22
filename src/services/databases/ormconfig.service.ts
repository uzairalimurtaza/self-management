// import 'dotenv/config';
// import { DataSource } from 'typeorm';
// // import { User } from './entity/User';  // Adjust the path as necessary

// export const AppDataSource = new DataSource({
//   type: "mysql",
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT || '3306'),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   synchronize: true,  // Note: set to false in production
//   logging: false,
// //   entities: [
// //     User  // You can directly use entity classes
// //   ],
//   migrations: [
//     "src/migration/**/*.ts"
//   ],
//   subscribers: [
//     "src/subscriber/**/*.ts"
//   ]
// });

import { DataSource } from "typeorm"

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test",
})

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })