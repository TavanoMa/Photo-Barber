export default function Footer() {
  return (
    <footer className="px-6 py-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
        <span>© 2026 PhotoBarber</span>

        <div className="flex gap-6">
          <span className="hover:text-white cursor-pointer">Termos</span>
          <span className="hover:text-white cursor-pointer">Privacidade</span>
          <span className="hover:text-white cursor-pointer">Contato</span>
        </div>
      </div>
    </footer>
  )
}