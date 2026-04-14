import LayoutShell from '@/components/layout-shell';
import Card from '@/components/card';
import ClientsTable from '@/components/clients-table';
import { createClient } from '@/lib/supabase-server';

export default async function ClientsPage() {
  const supabase = createClient();
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <LayoutShell title="Clients" subtitle="Basic client records protected by row-level security." actions={<a href="/app/clients/new" style={{ padding: '12px 18px', borderRadius: 12, background: '#12233d', color: 'white', textDecoration: 'none' }}>New intake</a>}>
      <Card>
        <ClientsTable clients={clients || []} />
      </Card>
    </LayoutShell>
  );
}
