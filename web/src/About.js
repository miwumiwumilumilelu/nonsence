import React from 'react';
import './Home.css';

function About() {
  return (
    <div className="home-bg">
      {/* 使用与首页相同的背景波浪效果 */}
      <div className="wave-bg">
        <svg className="wave-anim" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,64L48,58.7C96,53,192,43,288,58.7C384,75,480,117,576,122.7C672,128,768,96,864,90.7C960,85,1056,107,1152,117.3C1248,128,1344,128,1392,128L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" fill="url(#gradient1)"/>
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor: '#6366f1', stopOpacity: 0.1}}/>
              <stop offset="50%" style={{stopColor: '#8b5cf6', stopOpacity: 0.08}}/>
              <stop offset="100%" style={{stopColor: '#06b6d4', stopOpacity: 0.06}}/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="home-card">
        <div className="about-page">
          <h1 style={{color: '#3730a3', fontSize: '2.4rem', marginBottom: '32px', fontWeight: '700'}}>关于我们</h1>
          <div style={{textAlign: 'left', lineHeight: '1.8'}}>
            <p style={{fontSize: '1.1rem', color: '#374151', marginBottom: '20px'}}>
              nonsence 是一个专注于互联网广告投放与管理的创新平台，致力于为广告主和媒体方提供高效、智能、透明的广告服务。
            </p>
            <p style={{fontSize: '1.1rem', color: '#374151', marginBottom: '20px'}}>
              我们的团队由一群热爱技术与市场的年轻人组成，拥有丰富的广告行业经验和技术积累。我们相信，数据驱动和用户体验是广告行业的未来。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;