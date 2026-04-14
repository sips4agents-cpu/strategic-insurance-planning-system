import LayoutShell from '@/components/layout-shell';
import Card from '@/components/card';
import { createClient } from '@/lib/supabase-server';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: clients } = await supabase
    .from('clients')
    .select('id', { count: 'exact', head: false });

  const count = clients?.length || 0;

  return (
    <LayoutShell title="Dashboard" subtitle="Secure foundation for your agency portal.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20 }}>
        <Card title="Client records">
          <p style={{ fontSize: 34, margin: '8px 0' }}>{count}</p>
          <p style={{ margin: 0, color: '#536273' }}>Records saved in Supabase.</p>
        </Card>
        <Card title="System status">
          <p style={{ margin: '8px 0', fontWeight: 700 }}>Connected</p>
          <p style={{ margin: 0, color: '#536273' }}>Vercel, GitHub, and Supabase are in place.</p>
        </Card>
        <Card title="Next build">
          <p style={{ margin: '8px 0', fontWeight: 700 }}>Calculator + workflow</p>
          <p style={{ margin: 0, color: '#536273' }}>Add quoting logic in Preview before production rollout.</p>
        </Card>
      </div>
    </LayoutShell>
  );
}
