"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the secure sign-in link.');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
      <label style={{ display: 'grid', gap: 8 }}>
        <span>Email address</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@agency.com"
          required
          style={{ padding: 12, borderRadius: 12, border: '1px solid #cbd5e1' }}
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        style={{ padding: 12, border: 0, borderRadius: 12, background: '#12233d', color: 'white', fontWeight: 600 }}
      >
        {loading ? 'Sending secure link...' : 'Email me a secure sign-in link'}
      </button>
      {message ? <p style={{ margin: 0, color: '#536273' }}>{message}</p> : null}
    </form>
  );
}
