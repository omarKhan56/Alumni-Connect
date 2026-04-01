import { useState, useEffect, useRef } from "react";

export default function DigitalSerenity() {
  const [mouseGradientStyle, setMouseGradientStyle] = useState({
    left: "0px",
    top: "0px",
    opacity: 0,
  });

  const [ripples, setRipples] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const floatingElementsRef = useRef([]);

  useEffect(() => {
    const words = document.querySelectorAll(".word-animate");

    words.forEach((word) => {
      const delay = parseInt(word.getAttribute("data-delay")) || 0;
      setTimeout(() => {
        word.style.animation = "word-appear 0.8s ease-out forwards";
      }, delay);
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseGradientStyle({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`,
        opacity: 1,
      });
    };

    const handleLeave = () => {
      setMouseGradientStyle((prev) => ({ ...prev, opacity: 0 }));
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      const ripple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples((prev) => [...prev, ripple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 1000);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(".floating-element-animate");
    floatingElementsRef.current = Array.from(elements);

    const handleScroll = () => {
      if (!scrolled) {
        setScrolled(true);

        floatingElementsRef.current.forEach((el, i) => {
          setTimeout(() => {
            el.style.animationPlayState = "running";
            el.style.opacity = "";
          }, i * 100);
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-slate-100 overflow-hidden relative">

      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#94a3b8_1px,transparent_1px),linear-gradient(to_bottom,#94a3b8_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* FLOATING DOTS */}
      <div className="floating-element-animate absolute top-[25%] left-[15%]" />
      <div className="floating-element-animate absolute top-[60%] left-[85%]" />

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen px-6 text-center">

        <h1 className="text-4xl md:text-6xl font-light leading-tight">
          <span className="word-animate" data-delay="200">Connect.</span>{" "}
          <span className="word-animate" data-delay="400">Grow.</span>{" "}
          <span className="word-animate" data-delay="600">Belong.</span>
        </h1>

        <p className="mt-6 text-slate-400 max-w-xl">
          Your alumni network, reimagined — mentorship, jobs, and lifelong connections in one place.
        </p>

        {/* CTA */}
        <div className="mt-10 flex gap-4">
          <a href="/register" className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200">
            Get Started
          </a>
          <a href="/login" className="px-6 py-3 border border-white/30 rounded-xl hover:bg-white/10">
            Sign In
          </a>
        </div>
      </div>

      {/* MOUSE GLOW */}
      <div
        className="fixed w-80 h-80 rounded-full blur-3xl pointer-events-none bg-white/10"
        style={{
          left: mouseGradientStyle.left,
          top: mouseGradientStyle.top,
          opacity: mouseGradientStyle.opacity,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* RIPPLE */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="fixed w-2 h-2 bg-white/50 rounded-full animate-ping"
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </div>
  );
}