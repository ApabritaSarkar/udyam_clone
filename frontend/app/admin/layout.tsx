export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="admin-layout">
        <nav className="bg-slate-800 text-white p-4">
          <div className="container mx-auto">
            <a href="/" className="text-slate-200 hover:text-white transition-colors">
              ← Back to Form
            </a>
          </div>
        </nav>
        {children}
      </div>
    );
  }