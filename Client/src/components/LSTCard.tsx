import  { useState } from 'react';
import { motion } from 'framer-motion';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getWalletBalance } from '../lib/GetBalance';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';


const LSTStakingCard = () => {
  const [stakeAmount, setStakeAmount] = useState('');
  const {connection} =  useConnection()
  const [isStaking, setIsStaking] = useState(false);
  const {publicKey, sendTransaction} = useWallet();


  const handleStakeSubmit = async(e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsStaking(true);
    const balance  = await getWalletBalance(publicKey);

    if(balance <= 0){
      alert("Insufficient Balance");
    }else{
      alert(balance);
    }
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey!,
        toPubkey: new PublicKey("9kQGWWmror3KP7nhe6hiYpWMjJn5GcAHDoRbPdXvKn6u"),
        lamports: parseFloat(stakeAmount) * 1e9,
      })
    );
    transaction.feePayer = publicKey!;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    const signature = await sendTransaction(transaction, connection);
    console.log("signature", signature);
    console.log("signature", signature);
        
    const confirmation = await connection.getSignatureStatuses([signature],{searchTransactionHistory:true});

    console.log("confirmation", confirmation);
    setIsStaking(false);

  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-xl shadow-lg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Solana Liquid Staking</h2>
        <p className="text-gray-400">Stake your SOL with flexible liquidity</p>
      </motion.div>

      <form onSubmit={handleStakeSubmit} className="space-y-4">
        <div>
          <label htmlFor="stakeInput" className="block text-gray-300 mb-2">
            Stake Amount (SOL)
          </label>
          <input
            id="stakeInput"
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter SOL amount"
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isStaking}
          className={`w-full p-3 rounded-lg text-white font-semibold transition-colors duration-300 ${
            isStaking 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isStaking ? 'Staking...' : 'Stake SOL'}
        </motion.button>
      </form>

      {isStaking && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-4 p-4 bg-gray-700 rounded-lg text-center"
        >
          <p className="text-gray-300">
            Staking in progress... 
            <br />
            You'll receive liquid staking tokens (LST) soon
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default LSTStakingCard;