//jshint esversion:6
require('dotenv').config()

const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const jwt = require('jsonwebtoken')
const bcrypt= require("bcrypt")
const saltRounds=10;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB")

// Schema For Student Record
const userSchema = {
  name: String,
  email: String,
  password: String,
  phoneno: Number,
  favorite_list: [Number]
};

// schema For Teacher Records
const teacherSchema = {
  uniqueid: Number,
  name: String,
  favorite: Number,
  subject: String
};

const User = new mongoose.model("User", userSchema);
const Teacher = new mongoose.model("Teacher", teacherSchema);

const teacher1 = new Teacher({
  uniqueid: 01,
  name: 'Vandana Garg',
  favorite: 0,
  subject: 'Operating System'
});
const teacher2 = new Teacher({
  uniqueid: 02,
  name: 'Kailash Soni',
  favorite: 0,
  subject: 'DBMS'
});
const teacher3 = new Teacher({
  uniqueid: 03,
  name: 'RM Sharma',
  favorite: 0,
  subject: 'Data Communication'
});

Teacher.find({}, function(err, foundItems) {
  if (foundItems.length === 0) {
    teacher1.save();
    teacher2.save();
    teacher3.save();
  }
});


var username = ""

app.get("/", function(req, res) {
  res.render("home");
});
app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/register", function(req, res) {
  res.render("register");
});

// get request for adding a teacher
app.get("/addteacher", function(req, res) {
  if (username === "") {
    res.render("login");
  }
  User.findOne({
    email: username
  }, function(err, finduser) {
    if (err) {
      console.log(err);
    } else {
      Teacher.find(function(err, foundTeacher) {
        if (err) {
          console.log(err);
        } else {
          res.render("addteacher", {
            user_names: finduser,
            teacher: foundTeacher
          })
        }
      })

    }
  })
});

// get request for removing a teacher
app.get("/removeteacher", function(req, res) {
  if (username === "") {
    res.render("login");
  }
  User.findOne({
    email: username
  }, function(err, finduser) {
    if (err) {
      console.log(err);
    } else {
      Teacher.find(function(err, foundTeacher) {
        if (err) {
          console.log(err);
        } else {
          res.render("removeteacher", {
            user_names: finduser,
            teacher: foundTeacher
          })
        }
      })

    }
  })
});

app.post("/register", function(req, res) {
  //implemented bcrypt for encrypting user password
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      name: req.body.name,
      email: req.body.username,
      password: hash,
      phoneno: req.body.phoneno
    })
    newUser.save(function(err) {
      if (err) {
        console.log(err)
      } else {
        res.render("login");
      }
    })
  });
});

app.get("/secrets", function(req, res) {
  User.findOne({
    email: username
  }, function(err, finduser) {
    if (err) {
      console.log(err);
    } else {
      if (finduser) {
        Teacher.find(function(err, foundTeacher) {
          if (err) {
            console.log(err);
          } else {

            Teacher.countDocuments({}, function(err, count) {
              var idd = "";
// Implementation of aggregate function for finding most favorite teacher
              Teacher.aggregate(
                  [{
                    "$group": {
                      _id: {
                        "$max": '$favorite'
                      }
                    }
                  }])
                .then((orders) => {
                  orders.forEach((order) => {
                    idd = order;

                  })
                })

              setTimeout(function() {
                console.log(idd);
                res.render("secrets", {
                  user_names: finduser,
                  teacher: foundTeacher,
                  count: count,
                  max_fav: idd
                })
              }, 1000);
            })
          }
        })
      } else {
        res.render("login");
      }
    }
  })
})



app.post("/login", async (req, res) => {
  try {
    username = req.body.username;
    const password = req.body.password;
    User.findOne({
      email: username
    }, function(err, finduser) {
      if (err) {
        console.log(err);
      } else {
        if (finduser) {
            bcrypt.compare(password,finduser.password, function(err, result) {
if(result===true){
  const user = {
    name: username
  };
  // Implementation of JWT Authentication
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

  res.redirect("/secrets")
}
else{
  res.render("login");

}

          });
        } else {
          res.render("login");
        }
      }
    })
  } catch (err) {
    console.log(err);
  }
});

// Tried mocha and chai testing
function testing() {
  module.exports = {
    maxi: function() {
      return 3;
    }
  }
}

app.post("/addteacher", function(req, res) {
  const id_name = req.body.name * 1;
  User.updateOne({
      email: username
    }, {
      $push: {
        favorite_list: [id_name]
      }
    },
    function(err, result) {
      if (err) {
        console.log(err);
      }
    }
  )
  Teacher.updateOne({
      uniqueid: id_name
    }, {
      $inc: {
        favorite: 1
      }
    },
    function(err, result) {
      if (err) {
        console.log(err);
      }
    }
  )

  setTimeout(function() {
    User.findOne({
      email: username
    }, function(err, finduser) {
      if (err) {
        console.log(err);
      } else {
        if (finduser) {

          Teacher.find(function(err, foundTeacher) {
            if (err) {
              console.log(err);
            } else {
              Teacher.countDocuments({}, function(err, count) {
                var idd = "";
                // aggregation function for calculating the most favorite teacher
                Teacher.aggregate(
                    [{
                      "$group": {
                        _id: {
                          "$max": '$favorite'
                        }
                      }
                    }])
                  .then((orders) => {
                    orders.forEach((order) => {
                      idd = order;
                    })
                  })
                setTimeout(function() {
                  console.log(idd);
                  res.render("secrets", {
                    user_names: finduser,
                    teacher: foundTeacher,
                    count: count,
                    max_fav: idd
                  })
                }, 1000);
              })
            }
          })


        } else {
          res.render("login");

        }
      }
    })

  }, 100);
})


app.post("/removeteacher", function(req, res) {
  const id_name = req.body.name * 1;
  User.updateOne({
      email: username
    }, {
      $pull: {
        favorite_list: id_name
      }
    },
    function(err, result) {
      if (err) {
        console.log(err);
      }
    })
  var p = -1 * 1;
  Teacher.updateOne({
      uniqueid: id_name
    }, {
      $inc: {
        favorite: p
      }
    },
    function(err, result) {
      if (err) {
        console.log(err);
      }
    }
  )

  setTimeout(function() {
    User.findOne({
      email: username
    }, function(err, finduser) {
      if (err) {
        console.log(err);
      } else {
        if (finduser) {

          Teacher.find(function(err, foundTeacher) {
            if (err) {
              console.log(err);
            } else {

              Teacher.countDocuments({}, function(err, count) {
                var idd = "";
                Teacher.aggregate(
                    [{
                      "$group": {
                        _id: {
                          "$max": '$favorite'
                        }
                      }
                    }])
                  .then((orders) => {
                    orders.forEach((order) => {
                      idd = order;
                    })
                  })
                testing()
                setTimeout(function() {
                  // console.log(idd);
                  res.render("secrets", {
                    user_names: finduser,
                    teacher: foundTeacher,
                    count: count,
                    max_fav: idd
                  })
                }, 1000);
              })
            }
          })
        } else {
          res.render("login");
        }
      }
    })
  }, 100);
})

// middleware function for jwt authorization
function authenticateToken(req, res, next) {
  const authHeader = req.header['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
