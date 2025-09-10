import { useState, useCallback } from 'react';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

interface ApiRequestOptions<T> {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

export function useApi<T = any>(endpoint: string) {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const request = useCallback(
    async (options: ApiRequestOptions<T> = {}) => {
      const {
        method = 'GET',
        body,
        headers = {},
        onSuccess,
        onError,
        onComplete,
      } = options;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json().catch(() => ({}));
        
        setState({ data, error: null, loading: false });
        onSuccess?.(data);
        return { data, error: null };
      } catch (error) {
        const err = error instanceof Error ? error : new Error('An unknown error occurred');
        setState({ data: null, error: err, loading: false });
        onError?.(err);
        return { data: null, error: err };
      } finally {
        onComplete?.();
      }
    },
    [endpoint]
  );

  const get = useCallback(
    (options?: Omit<ApiRequestOptions<T>, 'method'>) =>
      request({ ...options, method: 'GET' }),
    [request]
  );

  const post = useCallback(
    (body: any, options?: Omit<ApiRequestOptions<T>, 'method' | 'body'>) =>
      request({ ...options, method: 'POST', body }),
    [request]
  );

  const put = useCallback(
    (body: any, options?: Omit<ApiRequestOptions<T>, 'method' | 'body'>) =>
      request({ ...options, method: 'PUT', body }),
    [request]
  );

  const patch = useCallback(
    (body: any, options?: Omit<ApiRequestOptions<T>, 'method' | 'body'>) =>
      request({ ...options, method: 'PATCH', body }),
    [request]
  );

  const remove = useCallback(
    (options?: Omit<ApiRequestOptions<T>, 'method'>) =>
      request({ ...options, method: 'DELETE' }),
    [request]
  );

  return {
    ...state,
    request,
    get,
    post,
    put,
    patch,
    delete: remove,
    reset: () => setState({ data: null, error: null, loading: false }),
  };
}

// Hook for handling form submissions with loading and error states
export function useFormSubmit<T = any>(
  submitFn: (values: T) => Promise<any>,
  options: {
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = useCallback(
    async (values: T) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const result = await submitFn(values);
        options.onSuccess?.(result);
        return { data: result, error: null };
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred');
        setError(error);
        options.onError?.(error);
        return { data: null, error };
      } finally {
        setIsSubmitting(false);
      }
    },
    [submitFn, options]
  );

  return { handleSubmit, isSubmitting, error, reset: () => setError(null) };
}
