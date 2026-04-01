import { useState } from 'react';

export const useForm = <T>(initialState: T) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const onChange = (field: keyof T, value: string) => {
    setForm({ ...form, [field]: value });
    // Limpiar error del campo cuando el usuario escribe
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const setError = (field: keyof T, message: string) => {
    setErrors({ ...errors, [field]: message });
  };

  return { form, errors, onChange, setError };
};