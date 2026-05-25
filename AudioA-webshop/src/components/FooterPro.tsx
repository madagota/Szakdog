export function FooterPro() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Termékek",
      links: ["Wireless", "Wired", "Studio"],
    },
    {
      title: "Támogatás",
      links: ["GYIK", "Szállítás", "Visszaküldés"],
    },
    {
      title: "Cég",
      links: ["Rólunk", "Kapcsolat", "Karrierek"],
    },
  ];

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-5 md:px-6 py-10 md:py-16">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-12">

          <div className="pb-8 border-b border-gray-800 md:pb-0 md:border-b-0">
            <h3 className="text-2xl font-bold tracking-tight mb-3">AudioA</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Prémium hangélmény mindenkinek. Stúdiós minőség, kényelmes fejhallgatók.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 md:col-span-3 gap-8">
            {footerLinks.map((column) => (
              <div key={column.title}>
                <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a  
                        href="#"
                        className="text-gray-400 hover:text-white text-sm transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        <div className="border-t border-gray-800 pt-6 md:pt-8">
          <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
            <p className="text-gray-400 text-xs md:text-sm">
              © {currentYear} AudioA. Minden jog fenntartva.
            </p>
            <div className="flex gap-5 md:gap-6">
              <a href="#" className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors">
                Adatvédelmi szabályzat
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors">
                Feltételek
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}