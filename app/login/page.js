'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Contraseña incorrecta');
      }
    } catch (e) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <form onSubmit={handleSubmit} className="login-card">
        <p className="ticker-eyebrow">Patrimonio · acceso privado</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          autoFocus
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
        {error && <p className="note" style={{ color: 'var(--clay)' }}>{error}</p>}
      </form>
    </div>
  );
}
