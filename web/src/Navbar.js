import React from 'react';
import './Navbar.css';

const clientMenu = [
  { key: 'client_ads', label: '我的广告' },
  { key: 'client_buy', label: '购买广告' },
  { key: 'client_material', label: '广告素材管理' },
  { key: 'client_recharge', label: '充值' },
  { key: 'client_rechargeHistory', label: '充值历史' },
  { key: 'client_stats', label: '广告数据' },
  { key: 'client_invoice', label: '发票管理' },
  { key: 'client_help', label: '帮助中心' },
];

const adminMenu = [
  { key: 'adReview', label: '广告审核' },
  { key: 'invoiceReview', label: '发票审核' },
  { key: 'user', label: '用户管理' },
  { key: 'stats', label: '平台数据' },
  { key: 'msg', label: '留言管理' },
  { key: 'discuss', label: '讨论审核' },
];

const Sidebar = ({ setPage, current, adminTab, setAdminTab }) => (
  <aside className="sidebar">
    {current && current.startsWith('client') && (
      <ul style={{margin:0,padding:0,listStyle:'none',width:'100%'}}>
        {clientMenu.map(item => (
          <li
            key={item.key}
            className={`sidebar-menu-item${current === item.key ? ' active' : ''}`}
            onClick={() => setPage(item.key)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    )}
    {current === 'admin' && (
      <ul style={{margin:0,padding:0,listStyle:'none',width:'100%'}}>
        {adminMenu.map(item => (
          <li
            key={item.key}
            className={`sidebar-menu-item${adminTab === item.key ? ' active' : ''}`}
            onClick={() => setAdminTab(item.key)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    )}
  </aside>
);

const Navbar = ({ setPage, current, user, adminLogged, onLogout, onAdminLogout, setShowReg }) => (
  <nav className="navbar">
    <div style={{flex:1,display:'flex',justifyContent:'center',gap:24}}>
      <button className={current === 'home' ? 'active' : ''} onClick={() => setPage('home')}>首页</button>
      <button className={current === 'cases' ? 'active' : ''} onClick={() => setPage('cases')}>广告案例</button>
      <button className={current === 'messages' ? 'active' : ''} onClick={() => setPage('messages')}>社区</button>
      <button className={current === 'api' ? 'active' : ''} onClick={() => setPage('api')}>API文档</button>
      <button className={current === 'contact' ? 'active' : ''} onClick={() => setPage('contact')}>联系我们</button>
      <button className={current === 'about' ? 'active' : ''} onClick={() => setPage('about')}>关于我们</button>
      <button className={current === 'admin' ? 'active' : ''} onClick={() => setPage('admin')}>系统管理</button>
    </div>
    <div style={{position:'absolute',right:32,top:16}}>
      {user ? (
        <button onClick={onLogout} style={{background:'#e57373',color:'#fff',border:'none',borderRadius:4,padding:'6px 16px',cursor:'pointer'}}>退出账号</button>
      ) : adminLogged ? (
        <button onClick={onAdminLogout} style={{background:'#e57373',color:'#fff',border:'none',borderRadius:4,padding:'6px 16px',cursor:'pointer'}}>退出账号</button>
      ) : (
        <button onClick={() => { setPage('client'); setShowReg(false); }} style={{background:'#1976d2',color:'#fff',border:'none',borderRadius:4,padding:'6px 16px',cursor:'pointer'}}>登录</button>
      )}
    </div>
  </nav>
);

export { Sidebar };
export default Navbar; 