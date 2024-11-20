import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import GameCard from '../components/GameCard';
import AppCard from '../components/AppCard';

export default function Store() {
  const [games, setGames] = useState([]);
  const [apps, setApps] = useState([]);
  const [activeTab, setActiveTab] = useState('games');

  useEffect(() => {
    const fetchItems = async () => {
      const gamesSnapshot = await getDocs(collection(db, 'games'));
      const appsSnapshot = await getDocs(collection(db, 'apps'));
      
      setGames(gamesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setApps(appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchItems();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('games')}
          className={\`px-4 py-2 rounded-lg \${
            activeTab === 'games'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }\`}
        >
          Games
        </button>
        <button
          onClick={() => setActiveTab('apps')}
          className={\`px-4 py-2 rounded-lg \${
            activeTab === 'apps'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }\`}
        >
          Apps
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'games'
          ? games.map(game => <GameCard key={game.id} game={game} />)
          : apps.map(app => <AppCard key={app.id} app={app} />)}
      </div>
    </div>
  );
}