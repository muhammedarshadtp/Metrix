const validateName = (name) => {
    // Name should be at least 6 characters long and can contain letters and spaces
    if (name.trim() === '') {
      return false; // Return false for empty strings
  }
    const nameRegex = /^[a-zA-Z\s]{4,}$/;
    // name=name.trim()
    return nameRegex.test(name);
  };
  
  const validateEmail = (email) => {
    // Basic email validation using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePassword = (password) => {
    // Password should be at least 6 characters long, containing at least one uppercase letter, one lowercase letter, and one digit
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
    
  };
  
  
  module.exports = { validateName, validateEmail, validatePassword, };