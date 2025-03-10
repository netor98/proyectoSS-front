export default function Header() {
  return (
    <header className="bg-slate-600 p-3">

      <nav className=" flex justify-between items-center container mx-auto">
        <p className="text-3xl">Span</p>
        <div className="text-white">

          <a href="#" className="p-4">Home</a>
          <a href="#" className="p-4">About</a>
          <a href="#" className="p-4">Services</a>
          <a href="#" className="p-4">Contact</a>
        </div>
      </nav>
    </header>
  )
}
