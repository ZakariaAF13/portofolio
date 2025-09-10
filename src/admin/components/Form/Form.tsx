import React, { ReactNode } from 'react';
import { FormProvider, useForm as useReactHookForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type FormProps<T extends z.ZodType> = {
  schema: T;
  onSubmit: (data: z.infer<T>) => Promise<void> | void;
  children: ReactNode;
  className?: string;
  defaultValues?: Partial<z.infer<T>>;
  resetOnSubmit?: boolean;
};

export function Form<T extends z.ZodType>({
  schema,
  onSubmit,
  children,
  className = '',
  defaultValues,
  resetOnSubmit = false,
}: FormProps<T>) {
  const methods = useReactHookForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  });

  const handleSubmit = async (data: z.infer<T>) => {
    try {
      await onSubmit(data);
      if (resetOnSubmit) {
        methods.reset();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmit as any)}
        className={`space-y-6 ${className}`}
      >
        {children}
      </form>
    </FormProvider>
  );
}

type FormFieldProps = {
  name: string;
  label: string;
  description?: string;
  children: React.ReactElement;
  className?: string;
};

export function FormField({
  name,
  label,
  description,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      <div className="mt-1">
        {React.cloneElement(children, {
          id: name,
          name,
          'aria-describedby': description ? `${name}-description` : undefined,
        })}
      </div>
    </div>
  );
}

type FormErrorProps = {
  name: string;
  className?: string;
};

export function FormError({ name, className = '' }: FormErrorProps) {
  const { formState: { errors } } = useReactHookForm();
  const error = errors[name];

  if (!error) return null;

  return (
    <p className={`mt-1 text-sm text-red-600 ${className}`}>
      {error.message as string}
    </p>
  );
}

type FormActionsProps = {
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
};

export function FormActions({
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  onCancel,
  isSubmitting = false,
  className = '',
}: FormActionsProps) {
  return (
    <div className={`flex justify-end space-x-3 pt-2 ${className}`}>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={isSubmitting}
        >
          {cancelLabel}
        </button>
      )}
      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </div>
  );
}

export { useForm } from 'react-hook-form';
