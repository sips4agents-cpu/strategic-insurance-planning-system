"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

const fieldStyle = { padding: 12, borderRadius: 12, border: '1px solid #cbd5e1' };

export default function ClientForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const payload = {
      user_id: user?.id,
      first_name: form.get('first_name'),
      last_name: form.get('last_name'),
      email: form.get('email'),
      phone: form.get('phone'),
      notes: form.get('notes'),
    };

    const { error } = await supabase.from('clients').insert(payload);
    if (error) {
      setMessage(error.message);
    } else {
      e.currentTarget.reset();
      setMessage('Client intake saved.');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <input name="first_name" placeholder="First name" required style={fieldStyle} />
        <input name="last_name" placeholder="Last name" required style={fieldStyle} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <input name="email" type="email" placeholder="Email" style={fieldStyle} />
        <input name="phone" placeholder="Phone" style={fieldStyle} />
      </div>
      <textarea name="notes" placeholder="Basic intake notes" rows="5" style={fieldStyle} />
      <button type="submit" disabled={loading} style={{ padding: 12, border: 0, borderRadius: 12, background: '#12233d', color: 'white', fontWeight: 600 }}>
        {loading ? 'Saving...' : 'Save intake'}
      </button>
      {message ? <p style={{ margin: 0, color: '#536273' }}>{message}</p> : null}
    </form>
  );
}
