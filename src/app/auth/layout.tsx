"use client";

import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.title = "Auth - Valid CheckIn";
  }, []);

  return <div>{children}</div>;
}
