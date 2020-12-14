module.exports.validationErrorCheck = (errors) => {
  let errs = [];

  errors.errors.map((err) => {
    errs.push(err.msg);
  });

  return errs;
}