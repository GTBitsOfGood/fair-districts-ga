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

export { validateReq, validateEmail, validateZipCode };
