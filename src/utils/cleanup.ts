import { APIRequestContext } from '@playwright/test';

export async function clearCart(request: APIRequestContext) {
    const res = await request.get('/api/cart');
    if (!res.ok()) return; // not authenticated on this request context — nothing to clean up
    const { items } = await res.json();
    for (const item of items) {
        await request.delete(`/api/cart/${item.product.id}`);
    }
}

export async function clearFavorites(request: APIRequestContext) {
    const res = await request.get('/api/favorites');
    if (!res.ok()) return; // not authenticated on this request context — nothing to clean up
    const { productIds } = await res.json();
    for (const productId of productIds) {
        await request.post('/api/favorites', { data: { productId } }); // toggles it off
    }
}
