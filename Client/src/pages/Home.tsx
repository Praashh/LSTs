import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Layers } from 'lucide-react';

const HomePage = () => {
  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const features = [
    {
      icon: <Zap className="w-12 h-12 text-blue-500" />,
      title: "High Yield Staking",
      description: "Maximize your SOL returns with our optimized liquid staking protocols"
    },
    {
      icon: <Shield className="w-12 h-12 text-green-500" />,
      title: "Secure & Transparent",
      description: "Enterprise-grade security with full on-chain transparency"
    },
    {
      icon: <Layers className="w-12 h-12 text-purple-500" />,
      title: "Liquid Tokens",
      description: "Instantly swap and use your staked assets across DeFi platforms"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white mt-16">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 pt-20 pb-16 text-center"
      >
        <motion.h1 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
        >
          Liquid Staking Redefined
        </motion.h1>
        
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-xl text-gray-300 max-w-2xl mx-auto mb-10"
        >
          Unlock the full potential of your Solana assets with seamless, high-yield liquid staking
        </motion.p>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 flex items-center mx-auto space-x-2">
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </motion.div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, ) => (
            <motion.div
              key={feature.title}
              variants={featureVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition duration-300 transform hover:-translate-y-2"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container mx-auto px-6 py-16 text-center"
      >
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { value: "$500M+", label: "Total Value Locked" },
            { value: "3.5%", label: "Average APY" },
            { value: "24/7", label: "Instant Liquidity" }
          ].map((stat) => (
            <div 
              key={stat.label}
              className="bg-gray-800 p-6 rounded-xl"
            >
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6 py-16 text-center"
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-10">
          <h2 className="text-3xl font-bold mb-4">Start Earning Today</h2>
          <p className="text-xl text-white/80 mb-6">
            Join thousands of users maximizing their Solana assets
          </p>
          <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300">
            Connect Wallet
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;