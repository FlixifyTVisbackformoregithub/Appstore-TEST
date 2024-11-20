export interface StoreItem {
    id: string;
    name: string;
    description: string;
    type: 'game' | 'app';
    price: number;
    size: string;
    version: string;
    downloadUrl: string;
    imageUrl: string;
    category: string;
    rating: number;
    downloads: number;
}