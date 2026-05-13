export function FooterPro() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Termékek',
      links: ['Wireless', 'Wired', 'Studio']
    },
    {
      title: 'Támogatás',
      links: ['GYIK', 'Szállítás', 'Visszaküldés']
    },
    {
      title: 'Cég',
      links: ['Rólunk', 'Kapcsolat', 'Karrierek']
    }
  ];

  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Grid */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold tracking-tight mb-4">AudioA</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Prémium hangélmény mindenkinek. Stúdiós minőség, kényelmes fejhallgatók.
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
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

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          {/* Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} AudioA. Minden jog fenntartva.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Adatvédelmi szabályzat
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Feltételek
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
