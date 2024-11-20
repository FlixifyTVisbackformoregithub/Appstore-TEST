import { Observable } from '@nativescript/core';
import { StoreService } from '../../services/store.service';
import { StoreItem } from '../../models/store-item';
import { firebase } from '@nativescript/firebase-core';

export class StoreViewModel extends Observable {
    private storeService: StoreService;
    private _games: StoreItem[] = [];
    private _apps: StoreItem[] = [];
    private _selectedTabIndex = 0;
    private _isLoading = false;

    constructor() {
        super();
        this.storeService = StoreService.getInstance();
        this.loadItems();
    }

    get games(): StoreItem[] {
        return this._games;
    }

    get apps(): StoreItem[] {
        return this._apps;
    }

    get selectedTabIndex(): number {
        return this._selectedTabIndex;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    set isLoading(value: boolean) {
        if (this._isLoading !== value) {
            this._isLoading = value;
            this.notifyPropertyChange('isLoading', value);
        }
    }

    async loadItems() {
        try {
            this.isLoading = true;
            const [games, apps] = await Promise.all([
                this.storeService.getItems('game'),
                this.storeService.getItems('app')
            ]);

            this._games = games;
            this._apps = apps;
            
            this.notifyPropertyChange('games', games);
            this.notifyPropertyChange('apps', apps);
        } catch (error) {
            console.error('Error loading items:', error);
            alert('Failed to load store items');
        } finally {
            this.isLoading = false;
        }
    }

    async onDownload(args) {
        try {
            const item = args.object.bindingContext;
            this.isLoading = true;
            await this.storeService.downloadItem(item);
            alert(`${item.name} downloaded successfully!`);
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download item');
        } finally {
            this.isLoading = false;
        }
    }

    onItemTap(args) {
        const item = args.view.bindingContext;
        // Navigate to detail page
        const frame = require('@nativescript/core').Frame;
        frame.topmost().navigate({
            moduleName: 'pages/detail/detail-page',
            context: item
        });
    }

    async onLogout() {
        try {
            await firebase().auth().signOut();
            const frame = require('@nativescript/core').Frame;
            frame.topmost().navigate({
                moduleName: 'pages/login/login-page',
                clearHistory: true
            });
        } catch (error) {
            console.error('Logout error:', error);
            alert('Failed to logout');
        }
    }
}