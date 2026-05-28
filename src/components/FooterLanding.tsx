import Link from "next/link"

export default function Footer() {
  return (
    <footer className="px-6 py-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
        <span>© 2026 PhotoBarber</span>

        <div className="flex gap-6">
          <Link
            href="/termos"
            className="hover:text-white transition"
          >
            Termos
          </Link>

          <Link
            href="/privacidade"
            className="hover:text-white transition"
          >
            Privacidade
          </Link>

          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=tavanoma@gmail.com"
          className="hover:text-white transition">
            Contato
          </a>
        </div>
      </div>
    </footer>
  )
}