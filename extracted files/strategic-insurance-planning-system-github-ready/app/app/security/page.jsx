import LayoutShell from '@/components/layout-shell';
import Card from '@/components/card';

export default function SecurityPage() {
  return (
    <LayoutShell title="Security" subtitle="Checklist for handling protected client data safely.">
      <div style={{ display: 'grid', gap: 20 }}>
        <Card title="Before using real client data">
          <ul style={{ margin: 0, paddingLeft: 18, color: '#536273' }}>
            <li>Turn on email auth in Supabase.</li>
            <li>Create the private storage bucket named client-documents.</li>
            <li>Use MFA for your admin account.</li>
            <li>Keep all quoting and recommendation logic in Preview until tested.</li>
          </ul>
        </Card>
        <Card title="Do not store in this starter yet">
          <ul style={{ margin: 0, paddingLeft: 18, color: '#536273' }}>
            <li>Social Security numbers</li>
            <li>Medicare ID numbers</li>
            <li>Full underwriting details</li>
          </ul>
        </Card>
      </div>
    </LayoutShell>
  );
}
