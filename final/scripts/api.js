// js/api.js
export async function fetchServices() {
  try {
    const res = await fetch('data/services.json', {cache: "no-store"});
    if (!res.ok) throw new Error(`Network error: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Fetch error', err);
    throw err;
  }
}
