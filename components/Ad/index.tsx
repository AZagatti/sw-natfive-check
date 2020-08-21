import React, { useEffect } from "react";

const Ad: React.FC = () => {
  useEffect(() => {
    ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "inline-block" }}
      data-ad-client="ca-pub-6856691048766261"
      data-ad-slot="8441076774"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default Ad;
