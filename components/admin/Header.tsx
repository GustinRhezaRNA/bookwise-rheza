import { Session } from 'next-auth';
import React from 'react';

const Header = ({ session }: { session: Session }) => {
  return (
    <header className="admin-header">
      <div className="">
      <h2 className="text-2xl text-dark-400 font-semibold">{session?.user?.name}</h2>
      <p className="text-base text-slate-500">Monitor all of your users</p>
      </div>

      {/* <p>Search</p> */}
    </header>
  );
};

export default Header;
