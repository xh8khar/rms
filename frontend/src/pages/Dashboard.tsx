import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-6 py-3 flex items-center justify-between">
        <h1 className="text-xl font-serif text-stone-800">Himalayan Kitchen</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-stone-500">{user?.name} ({user?.role})</span>
          <button onClick={logout} className="text-sm text-stone-500 hover:text-stone-800">Sign out</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-serif text-stone-800 mb-6">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Today\'s Revenue', value: '¥0' },
            { label: 'Active Orders', value: '0' },
            { label: 'Tables Occupied', value: '0/12' },
            { label: 'Low Stock Items', value: '0' },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-lg border border-stone-200 p-4">
              <div className="text-sm text-stone-500">{card.label}</div>
              <div className="text-2xl font-serif text-stone-800 mt-1">{card.value}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
