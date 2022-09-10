const email = [
  {
    pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    message: "This email address is invalid."
  }
];

const password = [
    {
        pattern: /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        message: "This password is too weak."
    }
]

const validators = {
  email,
  password
};

export default validators;
