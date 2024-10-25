interface TileProps {
    name: string;
    description: string;
  }
  
  const ChatTile: React.FC<TileProps> = ({ name, description }) => {
    return (
      <div className="bg-blue-950 text-white rounded-lg p-4 shadow-md">
        <h3 className="text-lg font-semibold mb-2 bg-slate-900 rounded-lg p-2">{name}</h3>
        <p className="text-sm bg-slate-900 rounded-lg p-2 truncate">{description}</p>
      </div>
    );
  }
  
  export default ChatTile;