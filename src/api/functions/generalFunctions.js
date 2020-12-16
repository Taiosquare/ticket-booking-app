require("dotenv").config();

module.exports.environmentCheck = (env) => {
  let address = "";

  env === "production"
    ? (address = "")
    : (address = `http://localhost:${process.env.PORT}`);

  return address;
};

module.exports.validationErrorCheck = (errors) => {
  let errs = [];

  errors.errors.map((err) => {
    errs.push(err.msg);
  });

  return errs;
}
