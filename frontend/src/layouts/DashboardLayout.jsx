import Sidebar from '../components/sidebar/Sidebar'

function DashboardLayout({
  children,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030712] via-[#071029] to-[#0b1120] text-white flex overflow-hidden">

      {/* SIDEBAR */}
      <div className="fixed left-0 top-0 z-50">

        <Sidebar />

      </div>

      {/* CONTENT */}
      <div className="ml-[290px] flex-1 min-h-screen">

        <main className="px-8 md:px-10 xl:px-14 py-8">

          <div className="max-w-[1700px] mx-auto">

            {children}

          </div>

        </main>

      </div>

    </div>
  )
}

export default DashboardLayout