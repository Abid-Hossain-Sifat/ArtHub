export const artworkCollection = async (queryParams = {}) => {
    const { search, category, status, sort } = queryParams;
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    if (sort) params.append('sort', sort);

    const queryString = params.toString();
    const url = queryString ? `${process.env.NEXT_PUBLIC_API_URL}?${queryString}` : (process.env.NEXT_PUBLIC_API_URL);
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

export const artworkFilters = async () => {
    const backendUrl = process.env.NEXT_PUBLIC_FILTER_API_URL ;
    const res = await fetch(`${backendUrl}`);
    const data = await res.json();
    return data;
}