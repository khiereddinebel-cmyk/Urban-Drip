'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../shared/context/AuthContext';

interface LoginSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginSidebar({ isOpen, onClose }: LoginSidebarProps) {
    const { login, logout, isAuthenticated, user } = useAuth();
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const endpoint = isRegisterMode ? 'register/' : 'login/';
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            // Success
            login(data.user.email, data.token, data.user);
            alert(isRegisterMode ? 'Account created successfully!' : 'Logged in successfully!');
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 1000,
                        transition: 'opacity 0.2s'
                    }}
                />
            )}

            {/* Sidebar Container */}
            <div style={{
                position: 'fixed',
                top: 0, right: 0, bottom: 0,
                width: '100%', maxWidth: '450px',
                backgroundColor: '#111',
                color: 'white',
                zIndex: 1001,
                transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
                overflowY: 'auto',
                fontFamily: 'var(--font-sans)',
            }}>
                {/* Header */}
                <div style={{ padding: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' }}>
                    <h2 style={{ fontSize: '24px', fontFamily: 'var(--font-serif)', margin: 0 }}>
                        {isAuthenticated ? 'My Account' : (isRegisterMode ? 'Create Account' : 'Sign In')}
                    </h2>
                    <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        Close
                    </button>
                </div>

                {/* Form Content */}
                {!isAuthenticated ? (
                    <form onSubmit={handleAuth} style={{ padding: '40px' }}>
                    {error && (
                        <div style={{ padding: '15px', backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', borderRadius: '4px', marginBottom: '20px', fontSize: '14px', border: '1px solid #e74c3c' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: 'white' }}>
                            Email Address <span style={{ color: '#e74c3c' }}>*</span>
                        </label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ 
                                width: '100%', 
                                backgroundColor: '#1a1a1a', 
                                border: '1px solid #333', 
                                padding: '15px', 
                                color: 'white',
                                borderRadius: '4px',
                                outline: 'none'
                            }} 
                        />
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: 'white' }}>
                            Password <span style={{ color: '#e74c3c' }}>*</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input 
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ 
                                    width: '100%', 
                                    backgroundColor: '#1a1a1a', 
                                    border: '1px solid #333', 
                                    padding: '15px', 
                                    color: 'white',
                                    borderRadius: '4px',
                                    outline: 'none'
                                }} 
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        style={{ 
                            width: '100%', 
                            backgroundColor: isLoading ? '#666' : '#438E44', 
                            color: 'white', 
                            padding: '18px', 
                            border: 'none', 
                            fontWeight: 'bold', 
                            letterSpacing: '2px',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            marginBottom: '20px',
                            transition: 'background-color 0.2s',
                            textTransform: 'uppercase'
                        }}
                    >
                        {isLoading ? 'Processing...' : (isRegisterMode ? 'Create Account' : 'Log In')}
                    </button>

                    {!isRegisterMode && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input type="checkbox" style={{ accentColor: '#438E44' }} /> Remember me
                            </label>
                            <Link href="#" style={{ color: '#438E44', textDecoration: 'none' }}>Lost your password?</Link>
                        </div>
                    )}

                    <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #222', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                         <div style={{ 
                             width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #333', 
                             display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
                             padding: '15px'
                         }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
                            {isRegisterMode ? 'Already have an account?' : 'No account yet?'}
                        </h3>
                        <button 
                            type="button"
                            onClick={() => {
                                setIsRegisterMode(!isRegisterMode);
                                setError('');
                            }}
                            style={{ 
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '13px', 
                                fontWeight: 'bold', 
                                textTransform: 'uppercase', 
                                letterSpacing: '2px',
                                borderBottom: '2px solid white',
                                paddingBottom: '4px',
                                color: 'white',
                                textDecoration: 'none'
                            }}
                        >
                            {isRegisterMode ? 'Log In' : 'Create an account'}
                        </button>
                    </div>
                </form>
                ) : (
                    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '4px', border: '1px solid #333' }}>
                            <p style={{ fontSize: '14px', color: '#999', margin: '0 0 8px 0' }}>Logged in as:</p>
                            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{user?.email || 'User'}</p>
                        </div>
                        
                        <button 
                            onClick={() => {
                                logout();
                                onClose();
                            }}
                            style={{ 
                                width: '100%', 
                                backgroundColor: 'transparent', 
                                border: '1px solid #e74c3c', 
                                color: '#e74c3c', 
                                padding: '15px', 
                                fontWeight: 'bold', 
                                letterSpacing: '2px',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                transition: 'all 0.2s',
                                textTransform: 'uppercase',
                                marginTop: '20px'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#e74c3c'; e.currentTarget.style.color = '#fff'; }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#e74c3c'; }}
                        >
                            Log Out
                        </button>
                    </div>
                )}
            </div>
        </>

    );
}
