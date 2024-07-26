const { faker, tr } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta_app",
  password: "Mike@123456",
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

let q = "INSERT INTO user (id, username, email, password) VALUES ?";
// let users = [
//   ["123b", "123_usernameb", "abc@gmail.comb", "abcb"],
//   ["123c", "123_usernamec", "abc@gmail.comc", "abcc"],
// ];

let data = [];

// for (let i = 1; i <= 100; i++) {
//   data.push(getRandomUser()); // 100 fake user data
// }

// try {
//   connection.query(q, [data], (err, result) => {
//     if (err) {
//       throw err;
//     }

//     console.log(result);
//   });
// } catch (err) {
//   console.log(err);
// }

// connection.end();

// HOME ROUTE
app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user`;

  try {
    connection.query(q, (err, result) => {
      if (err) {
        throw err;
      }
      let count = result[0]["count(*)"];
      res.render("home", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("Some Error In Database");
  }
});

// SHOW USER ROUTE

app.get("/user", (req, res) => {
  let q = `SELECT * FROM user`;
  try {
    connection.query(q, (err, users) => {
      if (err) {
        throw err;
      }

      res.render("showusers", { users });
    });
  } catch (err) {
    console.log(err);
    res.send("Some Error In Database");
  }
});

// edit route
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) {
        throw err;
      }
      let user = result[0];
      res.render("edit", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("Some Error In Database");
  }
});

//  UPDATE Route

app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: fromPass, username: newUsername } = req.body;

  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) {
        throw err;
      }
      let user = result[0];
      if (fromPass != user.password) {
        res.send("Wrong Password");
      } else {
        let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) {
            throw err;
          }
          res.redirect("/user");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Some Error In Database");
  }
});

app.listen(port, () => {
  console.log(`Server Running Of Port ${port}`);
});
