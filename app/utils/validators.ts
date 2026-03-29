export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // Mínimo 8 caracteres, al menos una letra y un número
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return regex.test(password);
};