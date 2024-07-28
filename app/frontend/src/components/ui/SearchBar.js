// SearchBar.js
import React from 'react';

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative">
      <input
        type="text"
        className="w-full p-2 border rounded-md"
        placeholder="Search exams..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
