export const validateEmailString = (email: string) => {
  const emailRegex = new RegExp(/^\S+(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  if (email?.length !== 0 && !emailRegex.test(email)) {
    return true;
  } else {
    return false;
  }
};

