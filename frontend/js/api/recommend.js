import {api} from "./client.js";

async function recommend({ query, emotions }) {
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  emotions.forEach((e) => params.append('emotions', e));

  const res = await api(`/public/v1/search/books?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) throw new Error('Search API 호출 실패');

  const data = await res.json();

  return Array.isArray(data) ? data : [data];
}

export {
  recommend
}