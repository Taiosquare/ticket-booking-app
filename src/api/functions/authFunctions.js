require("dotenv").config();

const jwt = require("jsonwebtoken"),
    { Admin } = require("../models/admin"),
    { Host } = require("../models/host"),
    { User } = require("../models/user"); 

const refreshToken = async (token, type) => {
    let tok = '';
    let decodedToken;
  
    try {
        decodedToken = jwt.verify(token, process.env.REFRESH_SECRET);

        if (type == "admin") {
            tok = await Admin.generateAuthToken(decodedToken._id);
        } else if (type == "host") {
            tok = await Host.generateAuthToken(decodedToken._id);
        } else if (type == "user") {
            tok = await User.generateAuthToken(decodedToken._id);
        }
    } catch (err) {
        if (err.message == "jwt expired") {
            tok = "expired";
        } else {
            tok = "error";
        }
    }

    return tok;
};

module.exports.decodeToken = async (token, secret, refresh, type) => {
    let decodedToken = {};
    decodedToken.type = type;
    
    try {
        decodedToken.token = jwt.verify(token, secret);

        const now = Date.now().valueOf() / 1000;

        if (typeof decodedToken.token.exp !== "undefined" && decodedToken.token.exp > now) {
            decodedToken.state = "active";
            decodedToken.newToken = token;
        }
    } catch (err) {
        if (err.message == "jwt expired") {
            let newToken = "";
            
            if (type == "admin") {
                newToken = await refreshToken(refresh, type);
            } else if (type == "host") {
                newToken = await refreshToken(refresh, type);
            } else if (type == "user") {
                newToken = await refreshToken(refresh, type);
            }

            if (newToken == "expired") {
                decodedToken.state = "expired";
            } else if (newToken == "error") {
                decodedToken.error = "Error Refreshing Token";
            } else {
                decodedToken.state = "active";
                decodedToken.token = jwt.verify(newToken, secret);
                decodedToken.newToken = newToken;
            }
        } else {
            decodedToken.error = "Error Decoding Token";
        }
    }
    
    return decodedToken;
}

module.exports.generateAuthToken = function (id) {
  let token = jwt
    .sign(
      {
        _id: id,
      },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "5m",
      }
    )
    .toString();

  return token;
};

module.generateRefreshToken = function (id) {
  let refresh = jwt
    .sign(
      {
        _id: id,
      },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    )
    .toString();
  
  return refresh;
};

module.destroyToken = function (token) {
    
}