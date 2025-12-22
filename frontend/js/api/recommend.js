import { publicApi } from "./client.js";
import { toRecommendationResponse } from "./dto.js";

async function recommend(query, emotions) {
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  emotions.forEach((e) => params.append('emotions', e));

  const res = await publicApi(`/public/v1/search/books?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) throw new Error('Search API 호출 실패');

  const data = await res.json();
  return data.map((item) => toRecommendationResponse(item));
}

export { recommend }