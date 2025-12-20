import DefaultCostsSettings from '@/components/sales/DefaultCostsSettings';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 xl:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl xl:text-4xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure default costs and preferences</p>
        </div>

        {/* Settings Content */}
        <div className="max-w-4xl">
          <DefaultCostsSettings />
        </div>
      </div>
    </div>
  );
}
