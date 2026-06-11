"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("splashShown");

    if (!alreadyShown) {
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem("splashShown", "Y");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0d0d0f]">
      <video
        autoPlay
        muted
        playsInline
        className="w-[320px]"
      >
        <source
          src="/videos/brand/logo-intro.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
}