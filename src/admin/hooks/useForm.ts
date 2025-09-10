import { useState, useCallback } from 'react';
import { z, ZodTypeAny } from 'zod';

type FormErrors<T> = Partial<Record<keyof T, string>>;

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: z.ZodObject<{ [K in keyof T]?: ZodTypeAny }>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(
    Object.keys(initialValues).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as Record<keyof T, boolean>
    )
  );

  const validateField = useCallback(
    (name: keyof T, value: any) => {
      if (!validationSchema) return '';

      try {
        const fieldSchema = validationSchema.shape[name as string];
        if (!fieldSchema) return '';

        fieldSchema.parse(value);
        return '';
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.errors[0]?.message || 'Invalid field';
        }
        return 'Validation error';
      }
    },
    [validationSchema]
  );

  const validateForm = useCallback((): boolean => {
    if (!validationSchema) return true;

    try {
      validationSchema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.errors.reduce<FormErrors<T>>((acc, curr) => {
          const key = curr.path[0] as keyof T;
          acc[key] = curr.message;
          return acc;
        }, {});
        setErrors(newErrors);
      }
      return false;
    }
  }, [values, validationSchema]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
      
      const newValue = type === 'checkbox' ? checked : value;
      
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));

      if (validationSchema) {
        setErrors((prev) => ({
          ...prev,
          [name]: validateField(name, newValue),
        }));
      }
    },
    [validateField, validationSchema]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      if (validationSchema) {
        setErrors((prev) => ({
          ...prev,
          [name]: validateField(name as keyof T, values[name as keyof T]),
        }));
      }
    },
    [validateField, values, validationSchema]
  );

  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationSchema) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [validationSchema]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched(
      Object.keys(initialValues).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {} as Record<keyof T, boolean>
      )
    );
  }, [initialValues]);

  const getFieldProps = (name: keyof T) => ({
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: touched[name] ? errors[name] : undefined,
  });

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setValues,
    validate: validateForm,
    resetForm,
    getFieldProps,
    isValid: Object.values(errors).every((error) => !error),
  };
}

export default useForm;
