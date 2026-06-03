import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <div>
        <h1 style={{
          fontSize: '6rem',
          fontWeight: 900,
          margin: 0,
          background: 'linear-gradient(135deg, #8A2BE2, #00D4FF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          404
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#AAA', margin: '0.5rem 0' }}>
          Page not found
        </p>
        <Link
          href="#/"
          style={{
            color: '#8A2BE2',
            fontSize: '1rem',
            textDecoration: 'underline',
          }}
        >
          Go to ToolBox Pro Home
        </Link>
      </div>
    </div>
  );
}
