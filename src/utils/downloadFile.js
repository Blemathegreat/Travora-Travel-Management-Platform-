import { API_BASE } from './apiClient';

// Downloads a protected file: sends the login cookie, then saves the result under `fileName`
export async function downloadFile(path, fileName) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include' });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Could not download the file.');
  }

  const blob = await res.blob();                    // the file's bytes
  const url = URL.createObjectURL(blob);            // a temporary local address for them
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();                                     // "click" a hidden download link
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000); // free the memory afterwards
}