
import React from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/solid';

const Header: React.FC = () => {
  return (
    <header className="bg-[#2C2530] text-white p-4 shadow-md sticky top-0 z-10 border-b border-[#4A3F55]">
      <div className="container mx-auto flex items-center">
        <AcademicCapIcon className="h-10 w-10 mr-3 text-[#E0409A]" />
        <div>
          <h1 className="text-2xl font-bold text-[#E0409A]">Guru</h1>
          <p className="text-sm text-gray-400">Your Academic Assistant for Focused Learning</p>
        </div>
      </div>
    </header>
  );
};

export default Header;