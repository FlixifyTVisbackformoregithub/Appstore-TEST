import { Observable } from '@nativescript/core';
import { firebase } from '@nativescript/firebase-core';

export class HomeViewModel extends Observable {
    private _products = [];
    private _cartItems = [];
    private _cartTotal = 0;
    private _selectedTabIndex = 0;

    constructor() {
        super();
        this.loadProducts();
    }

    get products() {
        return this._products;
    }

    get cartItems() {
        return this._cartItems;
    }

    get cartTotal() {
        return this._cartTotal;
    }

    get selectedTabIndex() {
        return this._selectedTabIndex;
    }

    async loadProducts() {
        try {
            const snapshot = await firebase().firestore()
                .collection('products')
                .get();

            this._products = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            this.notifyPropertyChange('products', this._products);
        } catch (error) {
            console.error('Error loading products:', error);
            alert('Failed to load products');
        }
    }

    onAddToCart(args) {
        const product = args.object.bindingContext;
        this._cartItems.push(product);
        this._cartTotal += product.price;
        
        this.notifyPropertyChange('cartItems', this._cartItems);
        this.notifyPropertyChange('cartTotal', this._cartTotal);
    }

    async onCheckout() {
        if (this._cartItems.length === 0) {
            alert('Your cart is empty');
            return;
        }

        try {
            const user = firebase().auth().currentUser;
            await firebase().firestore()
                .collection('orders')
                .add({
                    userId: user.uid,
                    items: this._cartItems,
                    total: this._cartTotal,
                    date: new Date()
                });

            this._cartItems = [];
            this._cartTotal = 0;
            this.notifyPropertyChange('cartItems', this._cartItems);
            this.notifyPropertyChange('cartTotal', this._cartTotal);
            
            alert('Order placed successfully!');
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to place order');
        }
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