const validate = (type) => {
  var list = [
    {
      type: "auth/popup-closed-by-user",
      msg: "The popup has been closed by the user before finalizing the operation.",
    },
    {
      type: "auth/user-not-found",
      msg: "The user not registered.",
    },
    {
      type: "auth/wrong-password",
      msg: "The password is invalid or the user does not have a password.",
    },
    {
      type: "auth/user-disabled",
      msg: "The account has been disabled.",
    },
    {
      type: "auth/email-already-in-use",
      msg: "The account already in use.",
    },
    {
      type: "auth/weak-password",
      msg: "Password is not strong enough.",
    },
    {
      type: "auth/invalid-email",
      msg: "The email address is not valid.",
    },
  ];
  var find = list.find((d) => d.type === type);
  if (find) {
    return find.msg;
  } else {
    return "Error Autentication.";
  }
};

export default validate;
