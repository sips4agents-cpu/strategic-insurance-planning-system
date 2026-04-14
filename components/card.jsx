export default function Card({ title, children }) {
  return (
    <section style={{ background: 'white', borderRadius: 18, padding: 20, boxShadow: '0 8px 30px rgba(16,32,51,.08)', border: '1px solid #e8edf3' }}>
      {title ? <h2 style={{ marginTop: 0, fontSize: 18 }}>{title}</h2> : null}
      {children}
    </section>
  );
}
