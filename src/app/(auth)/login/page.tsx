'use client';

import { useEffect, useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import GoogleIcon from '@mui/icons-material/Google';

export default function Login() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const session = await getSession();
            if (session) {
                router.push('/dashboard');
            }
        };

        checkSession();

        // Check for error params
        const errorParam = searchParams.get('error');
        if (errorParam) {
            switch (errorParam) {
                case 'OAuthSignin':
                case 'OAuthCallback':
                    setError('Error occurred during OAuth sign-in. Please try again.');
                    break;
                case 'OAuthCreateAccount':
                    setError('Could not create account. Please try again.');
                    break;
                case 'EmailCreateAccount':
                    setError('Could not create account with that email. Please try again.');
                    break;
                case 'Callback':
                    setError('Error in callback. Please try again.');
                    break;
                default:
                    setError('An error occurred during login. Please try again.');
            }
        }
    }, [router, searchParams]);

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            setError('');

            const result = await signIn('google', {
                callbackUrl: '/dashboard',
                redirect: false,
            });

            if (result?.error) {
                setError('Failed to sign in with Google. Please try again.');
            } else if (result?.url) {
                router.push(result.url);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                        <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-800">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700 mr-3"></div>
                                Signing in...
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <GoogleIcon className="w-5 h-5 mr-3" />
                                Continue with Google
                            </div>
                        )}
                    </button>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Secure authentication powered by Google OAuth 2.0
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}