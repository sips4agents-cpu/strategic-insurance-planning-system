import LayoutShell from '@/components/layout-shell';
import Card from '@/components/card';

export default function VaultPage() {
  return (
    <LayoutShell title="Document vault" subtitle="Private bucket pattern for client documents.">
      <Card title="Bucket structure">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: '#536273' }}>{`client-documents/
  client-id-123/
    applications/
    policies/
    notes/`}</pre>
      </Card>
    </LayoutShell>
  );
}
