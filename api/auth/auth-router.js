const router = require("express").Router();
const Users = require("./auth-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets");

router.post("/register", checkBody, async (req, res) => {
  const { username, password } = req.user;

  const hash = bcrypt.hashSync(password, 10);

  try {
    const registeredUser = await Users.addUser({ username, password: hash });
    res.status(201).send(registeredUser);
  } catch (err) {
    res.status(500).json({ message: "username taken" });
  }

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post("/login", checkBody, async (req, res) => {
  const { username, password } = req.user;

  try {
    const savedUser = await Users.findUserByUsername(username);

    if (savedUser) {
      if (bcrypt.compareSync(password, savedUser.password)) {
        const token = generateToken(savedUser.username);
        res
          .status(200)
          .json({ message: `welcome, ${savedUser.username}`, token });
      } else {
        res.status(403).json({ message: "invalid credentials" });
      }
    } else {
      res.status(403).json({ message: "invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: "invalid credentials" });
  }

  //res.end("implement login, please!");
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

function checkBody(req, res, next) {
  const user = req.body;
  if (!user || !user.username || !user.password) {
    res.status(401).json({ message: "username and password required" });
  } else {
    req.user = user;
    next();
  }
}

function generateToken(username) {
  const payload = {
    username,
  };
  const options = {
    expiresIn: "1h",
  };
  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
