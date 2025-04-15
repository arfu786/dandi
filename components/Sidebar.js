import Link from 'next/link'

const Sidebar = ({ isCollapsed, onToggle }) => {
  return (
    <div 
      className={`
        h-screen bg-white border-r border-gray-200 fixed left-0 top-0
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-4 top-6 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:bg-gray-50 z-50 cursor-pointer"
      >
        <svg 
          className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Logo */}
      <div className={`p-6 ${isCollapsed ? 'px-4' : ''}`}>
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 flex-shrink-0">
            <div className="absolute w-4 h-4 transform rotate-45 border-2 border-blue-500"></div>
            <div className="absolute w-3 h-3 right-0 bottom-0 transform rotate-45 border-2 border-yellow-500"></div>
            <div className="absolute w-2 h-2 left-1 bottom-1 transform rotate-45 border-2 border-red-500"></div>
          </div>
          <span className={`text-2xl font-semibold whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
            dandi
          </span>
        </div>
      </div>

      {/* User Profile Section */}
      <div className={`mx-4 p-3 bg-blue-50 rounded-lg flex items-center gap-3 ${isCollapsed ? 'mx-2' : ''}`}>
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-medium text-gray-600">A</span>
        </div>
        <div className={`flex-grow whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
          <span className="text-sm text-blue-600">Personal</span>
        </div>
        <button className={`text-gray-400 transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="mt-6">
        {[
          { href: '/dashboards', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', text: 'Overview' },
          { href: '/playground', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', text: 'API Playground' },
          { href: '/use-cases', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', text: 'Use Cases' }
        ].map((item) => (
          <Link 
            key={item.href}
            href={item.href} 
            className={`flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 ${isCollapsed ? 'px-4' : ''}`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
              {item.text}
            </span>
          </Link>
        ))}

        <div className={`px-6 py-3 ${isCollapsed ? 'px-4' : ''}`}>
          <div className={`text-sm font-medium text-gray-400 whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
            My Account
          </div>
        </div>

        <Link href="/docs" className={`flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 ${isCollapsed ? 'px-4' : ''}`}>
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
            Documentation
          </span>
          <svg className={`w-4 h-4 ml-auto flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
      </nav>

      {/* User Profile Footer */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 ${isCollapsed ? 'p-2' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-gray-600">A</span>
          </div>
          <div className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
            <div className="text-sm font-medium">Arfad K</div>
          </div>
          <button className={`ml-auto text-gray-400 transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar 