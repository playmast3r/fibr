const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};

const title = (value, helpers) => {
  if (value.length < 5) {
    return helpers.message('title must be at least 5 characters');
  }
  // check if alphabets, numbers and spaces only
  if (!value.match(/^[a-zA-Z0-9 ]+$/)) {
    return helpers.message('title must contain only alphabets, numbers and spaces');
  }
  return value;
};

module.exports = {
  objectId,
  password,
  title,
};
