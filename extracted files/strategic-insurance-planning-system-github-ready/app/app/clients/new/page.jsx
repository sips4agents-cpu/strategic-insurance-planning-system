import LayoutShell from '@/components/layout-shell';
import Card from '@/components/card';
import ClientForm from '@/components/client-form';

export default function NewClientPage() {
  return (
    <LayoutShell title="New intake" subtitle="Store only basic fields until your full workflow is wired in.">
      <Card title="Client intake form">
        <ClientForm />
      </Card>
    </LayoutShell>
  );
}
