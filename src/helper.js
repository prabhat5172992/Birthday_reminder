function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}


const validateFields = (name, email, password, field) => {
  const emailRegEX = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  const errors = {};

  if(!emailRegEX.test(email)) {
    errors.email = "Email is not in correct format.";
  } else {
    delete(errors.email);
  }
    
  if(password) {
    const pwd = password.toString().trim().length;
    if(pwd < 5 || pwd > 15) {
      errors.password = "Please enter between 5 to 15 chars.";
    } else {
      delete(errors.password);
    }
  } else {
    errors.password = "Please enter password";
  }

  if(field === 'signup' && !name.trim()) {
    errors.name = "Please enter name";
  } else {
    delete(errors.name)
  }
  return errors;
}

const currentBirthday = (data) => {
  const month = new Date().toLocaleDateString("en-GB").split("/")[1];
  return data.filter((item) => item.dob && item.dob.split("-")[1] === month);
};

const removePassedDate = (data) => {
  return currentBirthday(data).filter(
    (item) => item.dob.split("-")[0] >= new Date().getDate()
  );
};

export { getBase64, validateFields, currentBirthday, removePassedDate };
