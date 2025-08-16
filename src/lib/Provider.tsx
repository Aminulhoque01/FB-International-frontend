// "use client";
// import { store } from "@/redux/store";
// import React from "react";
// import { Provider } from "react-redux";

// const Providers = ({ children }: { children: React.ReactNode }) => {
//   return <Provider store={store}>{children}</Provider>;
// };

// export default Providers;



'use client';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}