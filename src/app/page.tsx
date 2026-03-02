import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-5xl font-extrabold text-[#ff4e00] mb-8">
        Página Inicial Público
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
        <Link
          href="/123"
          className="p-6 border rounded-xl hover:border-[#ff4e00] transition-colors bg-white shadow-sm"
        >
          <h2 className="text-xl font-bold mb-2">Ver Imóvel 123</h2>
          <p className="text-gray-500 text-sm">Acesso Público</p>
        </Link>

        <Link
          href="/me"
          className="p-6 border rounded-xl hover:border-[#ff4e00] transition-colors bg-white shadow-sm"
        >
          <h2 className="text-xl font-bold mb-2">Meu Perfil</h2>
          <p className="text-gray-500 text-sm">Requer Login</p>
        </Link>

        <Link
          href="/properties"
          className="p-6 border rounded-xl hover:border-[#ff4e00] transition-colors bg-white shadow-sm"
        >
          <h2 className="text-xl font-bold mb-2">Meus Imóveis</h2>
          <p className="text-gray-500 text-sm">Requer Login</p>
        </Link>

        <Link
          href="/favorites"
          className="p-6 border rounded-xl hover:border-[#ff4e00] transition-colors bg-white shadow-sm"
        >
          <h2 className="text-xl font-bold mb-2">Favoritos</h2>
          <p className="text-gray-500 text-sm">Requer Login</p>
        </Link>
      </div>

      <div className="mt-12 flex gap-4">
        <Link
          href="/login"
          className="px-6 py-2 bg-[#ff4e00] text-white rounded-lg font-semibold hover:bg-[#e64600]"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-6 py-2 border border-[#ff4e00] text-[#ff4e00] rounded-lg font-semibold hover:bg-[#fff7f5]"
        >
          Registrar
        </Link>
      </div>
    </div>
  )
}
