import  { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Menu, X } from 'lucide-react';
import {
    WalletModalProvider,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleWalletConnect = () => {
    setIsWalletConnected(!isWalletConnected);
  };

  const navItems = [
    { label: 'Stake', href: '/stake' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-3"
        >
          <Wallet className="w-8 h-8 text-blue-500" />
          <Link to={"/"}><span className="text-xl font-bold text-white">LiquidStake</span></Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex items-center space-x-6"
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-gray-300 hover:text-white transition duration-300 text-xl"
            >
              {item.label}
            </a>
          ))}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWalletConnect}
            className={`py-2 px-4 rounded-full transition duration-300 flex items-center space-x-2 
                bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Wallet className="w-5 h-5" />
            <WalletModalProvider>
                            <div className="flex justify-between gap-2">
                            <WalletMultiButton style={{ 
                                background: 'transparent', 
                                }} 
                            />
                            </div>
                        </WalletModalProvider>
          </motion.button>
        </motion.div>

        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-gray-800 py-4"
        >
          <div className="container mx-auto px-4 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-gray-300 hover:text-white py-2"
              >
                {item.label}
              </a>
            ))}

            <button
              onClick={handleWalletConnect}
              className={`w-full py-3 rounded-lg transition duration-300 flex items-center justify-center space-x-2 bg-blue-600 text-white hover:bg-blue-700`}
            >
              <Wallet className="w-5 h-5" />
              <span>
                {isWalletConnected 
                  ? 'Connected' 
                  : 'Connect Wallet'
                }
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default NavBar;