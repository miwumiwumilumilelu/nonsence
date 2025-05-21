import React from 'react';
import './App.css'; // 确保样式可用

function About() {
  return (
    <div className="page-card">
      <div className="page-section-title">关于我们</div>
      <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: '32px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', color: '#444', marginBottom: 16 }}>
          nonsence 是一个专注于互联网广告投放与管理的创新平台，致力于为广告主和媒体方提供高效、智能、透明的广告服务。
        </p>
        <p style={{ color: '#666' }}>
          我们的团队由一群热爱技术与市场的年轻人组成，拥有丰富的广告行业经验和技术积累。我们相信，数据驱动和用户体验是广告行业的未来。
        </p>
      </div>
    </div>
  );
}

export default About; 