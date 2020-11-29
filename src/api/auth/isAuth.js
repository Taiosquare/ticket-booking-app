require("dotenv").config();

const { Admin } = require("../models/admin"),
  { Host } = require("../models/host"),
  { User } = require("../models/user"),
  AuthFunctions = require("../functions/authFunctions");

const admin = async (req, res, next) => {
    const authHeader = req.get("Authorization");

    try {
        if (!authHeader) {
            res.status(400).json({ error: "No Authentication Header" });
        } else {
            const token = authHeader.split(" ")[1];
            let decodedToken;
            let refresh = req.headers['refresh-token'];

            decodedToken = await AuthFunctions.decodeToken(token, process.env.ACCESS_SECRET, refresh, 'admin');

            if (decodedToken.error) {
                res.status(400).json({ error: decodedToken.error });
            } else if (decodedToken.state == "expired") {
                res.status(200).json({ message: "Token Expired, Login" });
            } else if (decodedToken.state == "active") {
                try {
                    const admin = await Admin.findById(decodedToken.token._id);

                    if (admin.loggedIn != "true") {
                        res.status(400).json({ error: "Unauthenticated Admin, Login" });
                    } else {
                        req.admin = admin;
                        req.token = decodedToken.newToken;
                        next();
                    }
                } catch (error) {
                    res.status(400).json({ error: "Admin not Found" });
                }
            }
        }
    } catch (error) {
        res.status(400).json({ error: "Error Authenticating Admin" });
    }
};

const host = async (req, res, next) => {
    const authHeader = req.get("Authorization");

    try {
        if (!authHeader) {
            res.status(400).json({ error: "No Authentication Header" });
        } else {
            const token = authHeader.split(" ")[1];
            let decodedToken;
            let refresh = req.headers['refresh-token'];

            decodedToken = await AuthFunctions.decodeToken(token, process.env.ACCESS_SECRET, refresh, 'host');

            if (decodedToken.error) {
                res.status(400).json({ error: decodedToken.error });
            } else if (decodedToken.state == "expired") {
                res.status(200).json({ message: "Token Expired, Login" });
            } else if (decodedToken.state == "active") {
                try {
                    const host = await Host.findById(decodedToken.token._id);

                    if (host.loggedIn != "true") {
                        res.status(400).json({ error: "Unauthenticated Host, Login" });
                    } else {
                        req.host = host;
                        req.token = decodedToken.newToken;
                        next();
                    }
                } catch (error) {
                    res.status(400).json({ error: "Host not Found" });
                }
            }
        }
    } catch (error) {
        res.status(400).json({ error: "Error Authenticating Host" });
    }
};

const user = async (req, res, next) => {
    const authHeader = req.get("Authorization");

    try {
        if (!authHeader) {
            res.status(400).json({ error: "No Authentication Header" });
        } else {
            const token = authHeader.split(" ")[1];
            let decodedToken;
            let refresh = req.headers['refresh-token'];

            decodedToken = await AuthFunctions.decodeToken(token, process.env.ACCESS_SECRET, refresh, 'user');

            if (decodedToken.error) {
                res.status(400).json({ error: decodedToken.error });
            } else if (decodedToken.state == "expired") {
                res.status(200).json({ message: "Token Expired, Login" });
            } else if (decodedToken.state == "active") {
                try {
                    const user = await User.findById(decodedToken.token._id);

                    if (user.loggedIn != "true") {
                        res.status(400).json({ error: "Unauthenticated User, Login" });
                    } else {
                        req.user = user;
                        req.token = decodedToken.newToken;
                        next();
                    }
                } catch (error) {
                    res.status(400).json({ error: "User not Found" });
                }
            }
        }
    } catch (error) {
        res.status(400).json({ error: "Error Authenticating User" });
    }
};

module.exports.admin = admin;
module.exports.host = host;
module.exports.user = user;
