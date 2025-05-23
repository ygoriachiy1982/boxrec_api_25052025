import { SearchForm } from "@/components/search-form"
import { AuthForm } from "@/components/auth-form"
import { FeaturedBoxers } from "@/components/featured-boxers"
import { DivisionRankings } from "@/components/division-rankings"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">BoxRec Explorer</h1>
              <p className="text-slate-600 mt-1">Professional Boxing Database & Analytics</p>
            </div>
            <div className="text-sm text-slate-500">Powered by BoxRec API</div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Search & Auth */}
          <div className="lg:col-span-1 space-y-6">
            <AuthForm />
            <SearchForm />
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-8">
            <FeaturedBoxers />
            <DivisionRankings />
          </div>
        </div>
      </main>

      <footer className="bg-slate-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-300">BoxRec Explorer - Professional Boxing Database</p>
          <p className="text-slate-400 text-sm mt-2">Data provided by BoxRec.com through our API proxy</p>
        </div>
      </footer>
    </div>
  )
}
