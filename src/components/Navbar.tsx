export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-7">

        <div className="text-lg font-bold tracking-[0.35em]">
          ANDSTRIDE
        </div>

        <nav className="hidden gap-10 text-sm uppercase tracking-[0.25em] text-zinc-400 md:flex">
          <a href="#" className="hover:text-white transition">Catalog</a>
          <a href="#" className="hover:text-white transition">Licenses</a>
          <a href="#" className="hover:text-white transition">About</a>
        </nav>

      </div>
    </header>
  );
}