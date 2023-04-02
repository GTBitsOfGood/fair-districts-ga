const validateReq = (value) => {
    let error;
    if (!value) {
        error = "Required field";
    }
    return error;
};

const validateEmail = (value) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let error;
    if (!value) {
        error = "Required field";
    } else if (!re.test(value)) {
        error = "Not a valid email";
    }
    return error;
};

const validateZipCode = (value) => {
    const re = /^\d{5}$/;
    if (!re.test(value)) {
        return "Not a valid zip code";
    }
};

const validatePhone = (value) => {
    const re = /^\d{10}$/;
    let error;
    if (!value) {
      return error; // not required
    } else if (!re.test(value)) {
      error = "Not a valid phone number";
    }
    return error;
};

const validateURL = (value) => {
    const re = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    let error;
    if (!value) {
      return error; // not required
    } else if (!re.test(value)) {
      error = "Not a valid URL";
    }
    return error;
};

export { validateReq, validateEmail, validateZipCode, validatePhone, validateURL };
