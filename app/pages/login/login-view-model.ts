import { Observable } from '@nativescript/core';
import { firebase } from '@nativescript/firebase-core';
import { GoogleAuthProvider } from '@nativescript/firebase-auth';

export class LoginViewModel extends Observable {
    private _isLoading = false;

    constructor() {
        super();
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

    async onGoogleSignIn() {
        try {
            this.isLoading = true;
            const auth = firebase().auth();
            const provider = new GoogleAuthProvider();
            const result = await auth.signInWithProvider(provider);
            
            if (result.user) {
                // Navigate to home page
                const frame = require('@nativescript/core').Frame;
                frame.topmost().navigate({
                    moduleName: 'pages/home/home-page',
                    clearHistory: true
                });
            }
        } catch (error) {
            console.error('Google Sign In Error:', error);
            alert('Failed to sign in with Google');
        } finally {
            this.isLoading = false;
        }
    }
}