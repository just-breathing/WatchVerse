"use client";

import React from 'react';

const RedirectDiv: React.FC<{ children: React.ReactNode ,url:string}> = ({ children,url }) => {

    const handleClick = () => {
        window.location.href = url;
    };
  return (
    <div className="w-[350px] h-[200px] border-white border-2" onClick={() => handleClick()}>
      {children}
    </div>
  );
};

export default RedirectDiv;