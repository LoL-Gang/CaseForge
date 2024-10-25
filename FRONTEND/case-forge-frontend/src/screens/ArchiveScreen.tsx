import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 10;

interface ChatTileProps {
  name: string;
  description: string;
}

const ChatTile: React.FC<ChatTileProps> = ({ name, description }) => {
  return (
    <div className="bg-blue-800 rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-900 p-4">
        <h3 className="text-white text-lg font-semibold mb-2">{name}</h3>
        <p className="text-white text-sm line-clamp-2">{description}</p>
      </div>
    </div>
  );
}

interface ArchiveScreenProps {
  items: ChatTileProps[];
}

const ArchiveScreen: React.FC<ArchiveScreenProps> = ({ items }) => {
  const [displayedItems, setDisplayedItems] = useState<ChatTileProps[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);

  const loadMoreItems = () => {
    setLoading(true);
    const nextItems = items.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
    setDisplayedItems(prev => [...prev, ...nextItems]);
    setPage(prev => prev + 1);
    setLoading(false);
  };

  useEffect(() => {
    loadMoreItems();
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleObserver = (entities: IntersectionObserverEntry[]) => {
    const target = entities[0];
    if (target.isIntersecting && !loading) {
      loadMoreItems();
    }
  };

  return (
    <div className="min-h-screen bg-slate-700 p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Chat Archive</h1>
      <div className="max-w-2xl mx-auto grid gap-4 grid-cols-1 sm:grid-cols-2">
        {displayedItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ChatTile name={item.name} description={item.description} />
          </motion.div>
        ))}
      </div>
      {loading && <p className="text-center mt-4">Loading more items...</p>}
      <div ref={loader} style={{ height: "20px" }} />
    </div>
  );
};

export default ArchiveScreen;