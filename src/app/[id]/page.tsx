export default function PropertyDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-[#ff4e00]">Detalhes do Imóvel</h1>
      <p className="mt-4 text-lg text-gray-600 font-mono">ID: {params.id}</p>
      <p className="mt-2 text-gray-600">Hello World - Página Pública</p>
    </div>
  )
}
