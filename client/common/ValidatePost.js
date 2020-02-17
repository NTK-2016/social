export const required = (value, errorMsg) => {
  if (!value.toString().trim().length) {
    // We can return string or jsx as the 'error' prop for the validated Component
    //return 'require';
    console.log(errorMsg);
    return errorMsg;
  } else {
    return false;
  }
};

export const requiredValue = (value, errorMsg) => {
  if (value <= 0) {
    //console.log(errorMsg);
    return errorMsg;
  } else {
    return false;
  }
};

export const requiredwith = (value1, value2, errorMsg) => {
  if (value1 == 2 && !value2.toString().trim().length) {
    // We can return string or jsx as the 'error' prop for the validated Component
    //return 'require';
    // console.log(errorMsg)
    return errorMsg;
  } else {
    return false;
  }
};
export const requiredwithblank = (value1, value2, errorMsg) => {
  if (!value1.toString().trim().length && !value2.toString().trim().length) {
    // We can return string or jsx as the 'error' prop for the validated Component
    //return 'require';
    console.log(errorMsg);
    return errorMsg;
  } else {
    return false;
  }
};

export const validateurl = (value, errorMsg) => {
  if (value.match(/\.(jpeg|jpg|gif|png)$/) == null && value != "") {
    // We can return string or jsx as the 'error' prop for the validated Component
    //return 'require';
    console.log(errorMsg);
    return errorMsg;
  } else {
    return false;
  }
};

export const validateaudiourl = (value, errorMsg) => {
  if (value.match(/\.(mp3)$/) == null && value != "") {
    // We can return string or jsx as the 'error' prop for the validated Component
    //return 'require';
    console.log(errorMsg);
    return errorMsg;
  } else {
    return false;
  }
};

export const validatevideourl = (value, errorMsg) => {
  if (value.match(/\.(mp4)$/) == null && value != "") {
    // We can return string or jsx as the 'error' prop for the validated Component
    //return 'require';
    console.log(errorMsg);
    return errorMsg;
  } else {
    return false;
  }
};

export const validatelink = (value, errorMsg) => {
  if (
    value.match(
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
    ) == null &&
    value != ""
  ) {
    // We can return string or jsx as the 'error' prop for the validated Component
    //return 'require';
    console.log(errorMsg);
    return errorMsg;
  } else {
    return false;
  }
};
export const vaildateEmail = (value, errorMsg) => {
  const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

  if (reg.test(value) == false) {
    return errorMsg;
  } else {
    return false;
  }
};
export const validateNumber = (value, errorMsg) => {
  const regx = /^[0-9]+$/;
  if (regx.test(value) == false) {
    return errorMsg;
  } else {
    return false;
  }
};

export const countError = array => {
  let count = 0;
  array.forEach(element => {
    if (element != false) {
      count++;
    }
  });
  return count;
};

export const strongPassword = (value, errorMsg) => {
  // const regx = /^[0-9]+$/;
  const regx = /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;
  if (regx.test(value) == false) {
    return errorMsg;
  } else {
    return false;
  }
};

export const strongUsername = (value, errorMsg) => {
  const regx = /[^a-zA-Z0-9._]/;
  //console.log(regx.test(value));
  if (regx.test(value) == true) {
    return errorMsg;
  } else {
    return false;
  }
};
