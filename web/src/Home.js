import React, { useState, useEffect, useCallback } from 'react';
import { Particles } from "@tsparticles/react";
import { loadAll } from "@tsparticles/all";
import './Home.css';

const images = [
  '/banner1.jpg',
  '/banner2.jpg',
  '/banner3.jpg',
];

function Home() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % images.length), 4000);
    return () => clearInterval(timer);
  }, []);
  const prev = () => setIdx(idx === 0 ? images.length - 1 : idx - 1);
  const next = () => setIdx((idx + 1) % images.length);
  const particlesInit = useCallback(async (engine) => {
    await loadAll(engine);
  }, []);
  return (
    <div className="home-bg">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          interactivity: {
            events: { onHover: { enable: true, mode: "repulse" }, resize: true },
            modes: { repulse: { distance: 100, duration: 0.4 } }
          },
          particles: {
            color: { value: "#6366f1" },
            links: { enable: true, color: "#818cf8", distance: 120, opacity: 0.4, width: 1 },
            move: { enable: true, speed: 1.2, outModes: { default: "bounce" } },
            number: { value: 40, density: { enable: true, area: 800 } },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 2, max: 4 } }
          },
          detectRetina: true
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0
        }}
      />
      <div className="wave-bg">
        <svg className="wave-anim" viewBox="0 0 2880 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#a5b4fc" fillOpacity="0.35" d="M0,60 C480,120 960,0 1440,60 C1920,120 2400,0 2880,60 L2880,120 L0,120 Z"/>
        </svg>
      </div>
      <div className="home home-card">
        <h1 className="platform-title">nonsence 互联网广告平台官网</h1>
        <img src="/image.png" alt="华中科技大学软件学院院徽" style={{width: 120, height: 'auto', margin: '16px auto', display: 'block'}} />
        <div className="carousel">
          <button className="carousel-btn left" onClick={prev}>&lt;</button>
          <img src={images[idx]} alt={`banner${idx+1}`} className="carousel-img" />
          <button className="carousel-btn right" onClick={next}>&gt;</button>
        </div>
        <div className="carousel-dots">
          {images.map((_, i) => (
            <span key={i} className={i === idx ? 'dot active' : 'dot'} onClick={() => setIdx(i)}></span>
          ))}
        </div>
        <p className="welcome">欢迎来到 nonsence，开启高效广告投放新体验！</p>
        {/* 平台简介卡片 */}
        <div className="home-section card">
          <h2>平台简介</h2>
          <p>nonsence 是一个专为广告主和平台管理员打造的高效互联网广告投放与管理平台，集广告购买、数据可视化、社区交流于一体，助力广告主精准投放、提升转化。</p>
        </div>
        {/* 核心功能速览 */}
        <div className="home-section features">
          <div className="feature-card">
            <span role="img" aria-label="ad">📢</span>
            <h3>广告主中心</h3>
            <p>广告购买、管理、充值、数据分析、素材管理一站式完成。</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="admin">🛡️</span>
            <h3>管理员中心</h3>
            <p>广告/发票审核、用户管理、平台数据可视化，保障平台安全高效。</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="chart">📊</span>
            <h3>数据可视化</h3>
            <p>多维度广告数据、充值、发票等统计分析，图表一目了然。</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="community">💬</span>
            <h3>社区讨论</h3>
            <p>广告主交流、经验分享、问题互助，打造活跃社区氛围。</p>
          </div>
        </div>
        {/* 快速入口和联系我们 */}
        <div className="home-section quick-links">
          <a href="/register" className="quick-btn">立即注册</a>
          <a href="/login" className="quick-btn">登录</a>
          <a href="/contact" className="quick-btn">联系我们</a>
        </div>
        {/* 技术栈/合作伙伴横条 */}
        <div className="home-section tech-bar">
          <span>技术支持：</span>
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" style={{width:32,marginRight:8}} />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JS" style={{width:32,marginRight:8}} />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML5" style={{width:32,marginRight:8}} />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS3" style={{width:32,marginRight:8}} />
        </div>
      </div>
    </div>
  );
}

export default Home; 