import React from 'react';
import './Navbar.css';

const Sidebar = ({ setPage, current }) => (
  <aside className="sidebar">
    {/* 顶部圆形点缀 */}
    <svg width="40" height="40" style={{position:'absolute',top:24,left:65,opacity:0.18,zIndex:2,pointerEvents:'none'}}>
      <circle cx="20" cy="20" r="20" fill="#fff" />
    </svg>
    <button className={current === 'client' ? 'active' : ''} onClick={() => setPage('client')}>
      <span role="img" aria-label="ad" style={{marginRight:8}}>📢</span>广告主中心
    </button>
    <button className={current === 'admin' ? 'active' : ''} onClick={() => setPage('admin')}>
      <span role="img" aria-label="admin" style={{marginRight:8}}>🛡️</span>管理员中心
    </button>
  </aside>
);

const Navbar = ({ setPage, current }) => (
  <nav className="navbar">
    <button className={current === 'home' ? 'active' : ''} onClick={() => setPage('home')}>首页</button>
    <button className={current === 'cases' ? 'active' : ''} onClick={() => setPage('cases')}>广告案例</button>
    <button className={current === 'messages' ? 'active' : ''} onClick={() => setPage('messages')}>社区</button>
    <button className={current === 'api' ? 'active' : ''} onClick={() => setPage('api')}>API文档</button>
    <button className={current === 'contact' ? 'active' : ''} onClick={() => setPage('contact')}>联系我们</button>
    <button className={current === 'about' ? 'active' : ''} onClick={() => setPage('about')}>关于我们</button>
  </nav>
);

export { Sidebar };
export default Navbar; 