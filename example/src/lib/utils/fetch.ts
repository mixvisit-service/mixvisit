export async function fetchJSON<T>(request: string): Promise<T | null> {
  try {
    const response = await fetch(request);
    const contentType = response.headers.get('content-type');
    if (!(contentType && contentType.includes('application/json'))) {
      throw new TypeError("Oops, we haven't got JSON!");
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);

    return null;
  }
}
