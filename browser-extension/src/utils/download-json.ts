export function downloadJson(obj: object, fileName: string, options?: { pretty?: boolean }) {
  const jsonString = options?.pretty ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  link.download = fileName;
  link.href = URL.createObjectURL(blob);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
