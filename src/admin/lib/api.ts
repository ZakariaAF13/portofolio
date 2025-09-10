import { supabase } from '../context/AuthContext';

interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const { data, error } = await supabase
      .from(endpoint)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data as unknown as T, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return { data: null, error: error as Error };
  }
}

export async function apiPost<T>(
  endpoint: string,
  payload: Record<string, any>
): Promise<ApiResponse<T>> {
  try {
    const { data, error } = await supabase
      .from(endpoint)
      .insert([payload])
      .select();

    if (error) throw error;
    return { data: data?.[0] as unknown as T, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return { data: null, error: error as Error };
  }
}

export async function apiUpdate<T>(
  endpoint: string,
  id: string | number,
  payload: Record<string, any>
): Promise<ApiResponse<T>> {
  try {
    const { data, error } = await supabase
      .from(endpoint)
      .update(payload)
      .eq('id', id)
      .select();

    if (error) throw error;
    return { data: data?.[0] as unknown as T, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return { data: null, error: error as Error };
  }
}

export async function apiDelete(
  endpoint: string,
  id: string | number
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from(endpoint)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('API Error:', error);
    return { error: error as Error };
  }
}

export async function uploadFile(
  bucket: string,
  filePath: string,
  file: File
): Promise<{ path: string; error: Error | null }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { path: publicUrl, error: null };
  } catch (error) {
    console.error('Upload Error:', error);
    return { path: '', error: error as Error };
  }
}
