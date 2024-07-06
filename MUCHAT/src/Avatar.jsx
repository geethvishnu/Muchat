



import React from 'react';

export default function Avatar({ userId, username, online }) {
  const colors = [
    'bg-teal-200', 'bg-red-200', 'bg-green-200', 'bg-purple-200',
    'bg-blue-200', 'bg-yellow-200', 'bg-orange-200', 'bg-pink-200',
    'bg-fuchsia-200', 'bg-rose-200'
  ];

  // Fallback values in case userId or username is not provided
  const userIdBase10 = userId ? parseInt(userId.substring(10), 16) : 0;
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];
  const initial = username ? username[0] : '?';

  return (
    <div className={"w-8 h-8 relative rounded-full flex items-center justify-center " + color}>
      <div className="text-center w-full opacity-70">{initial}</div>
      {online ? (
        <div className="absolute w-3 h-3 bg-green-400 bottom-0 right-0 rounded-full border border-white"></div>
      ) : (
        <div className="absolute w-3 h-3 bg-gray-400 bottom-0 right-0 rounded-full border border-white"></div>
      )}
    </div>
  );
}
