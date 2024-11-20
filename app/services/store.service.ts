import { firebase } from '@nativescript/firebase-core';
import { StoreItem } from '../models/store-item';
import { Downloader } from '@nativescript/downloader';

export class StoreService {
    private static instance: StoreService;
    private downloader: Downloader;

    private constructor() {
        this.downloader = new Downloader();
    }

    public static getInstance(): StoreService {
        if (!StoreService.instance) {
            StoreService.instance = new StoreService();
        }
        return StoreService.instance;
    }

    async getItems(type: 'game' | 'app'): Promise<StoreItem[]> {
        try {
            const snapshot = await firebase().firestore()
                .collection('store-items')
                .where('type', '==', type)
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as StoreItem));
        } catch (error) {
            console.error(`Error fetching ${type}s:`, error);
            throw error;
        }
    }

    async downloadItem(item: StoreItem): Promise<void> {
        try {
            const download = await this.downloader.createDownload({
                url: item.downloadUrl,
                fileName: `${item.name.toLowerCase().replace(/\s+/g, '-')}-${item.version}.apk`
            });

            await new Promise((resolve, reject) => {
                download.on('progress', (progress) => {
                    console.log(`Download progress: ${progress.value}%`);
                });

                download.on('completed', (file) => {
                    console.log('Download completed:', file.path);
                    resolve(file);
                });

                download.on('error', (error) => {
                    console.error('Download error:', error);
                    reject(error);
                });

                download.start();
            });

            // Update download count in Firestore
            await firebase().firestore()
                .collection('store-items')
                .doc(item.id)
                .update({
                    downloads: firebase.firestore.FieldValue.increment(1)
                });
        } catch (error) {
            console.error('Download error:', error);
            throw error;
        }
    }
}