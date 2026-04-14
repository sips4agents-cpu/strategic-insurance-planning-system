export default function ClientsTable({ clients }) {
  if (!clients?.length) {
    return <p style={{ margin: 0, color: '#536273' }}>No client records yet.</p>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #e8edf3' }}>
            <th style={{ padding: '10px 8px' }}>Name</th>
            <th style={{ padding: '10px 8px' }}>Email</th>
            <th style={{ padding: '10px 8px' }}>Phone</th>
            <th style={{ padding: '10px 8px' }}>Created</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} style={{ borderBottom: '1px solid #eef2f7' }}>
              <td style={{ padding: '10px 8px' }}>{client.first_name} {client.last_name}</td>
              <td style={{ padding: '10px 8px' }}>{client.email || '—'}</td>
              <td style={{ padding: '10px 8px' }}>{client.phone || '—'}</td>
              <td style={{ padding: '10px 8px' }}>{new Date(client.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
