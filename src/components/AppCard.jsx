import { useState } from 'react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';

export default function AppCard({ app }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Update download count
      await updateDoc(doc(db, 'apps', app.id), {
        downloads: increment(1)
      });

      // Trigger download
      const link = document.createElement('a');
      link.href = app.downloadUrl;
      link.download = app.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <img 
        src={app.imageUrl} 
        alt={app.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{app.name}</h3>
        <p className="text-gray-600 mb-4">{app.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-green-600 font-bold">${app.price}</span>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {downloading ? 'Downloading...' : 'Download'}
          </button>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {app.downloads} downloads • {app.size}
        </div>
      </div>
    </div>
  );
}