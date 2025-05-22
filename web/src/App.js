import React, { useState } from 'react';
import './App.css';
import Navbar, { Sidebar } from './Navbar';
import Home from './Home';
import MessageBoard from './MessageBoard';
import About from './About';
import Cases from './Cases';
import Contact from './Contact';
import Footer from './Footer';
import ClientCenter from './ClientCenter';
import ApiDoc from './ApiDoc';
import AdminCenter from './AdminCenter';
import axios from 'axios';

const API_BASE = 'https://djck4ikhm4.hzh.sealos.run';

function App() {
  const [page, setPage] = useState('home');
  // 广告主登录
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('nonsence_user_login');
    return u ? JSON.parse(u) : null;
  });
  const [userForm, setUserForm] = useState({ username: '', password: '' });
  const [userMsg, setUserMsg] = useState('');
  const [showReg, setShowReg] = useState(false);
  const [balance, setBalance] = useState(() => {
    const b = localStorage.getItem('nonsence_balance');
    return b ? Number(b) : 0;
  });

  // 管理员登录
  const [adminLogged, setAdminLogged] = useState(() => localStorage.getItem('nonsence_admin_logged') === '1');
  const [adminForm, setAdminForm] = useState({ user: '', pwd: '' });
  const [adminMsg, setAdminMsg] = useState('');
  const ADMIN_USER = 'admin';
  const ADMIN_PWD = 'admin123';

  // 登录
  const handleLogin = async e => {
    e.preventDefault();
    setUserMsg('');
    if (!userForm.username || !userForm.password) {
      setUserMsg('请填写完整信息'); return;
    }
    try {
      const res = await axios.post(`${API_BASE}/loginOrRegister`, userForm);
      if (res.data && res.data.ok) {
        setUser(res.data.data);
        setBalance(res.data.data.balance || 0);
        localStorage.setItem('nonsence_user_login', JSON.stringify(res.data.data));
        localStorage.setItem('nonsence_balance', String(res.data.data.balance || 0));
      } else {
        setUserMsg(res.data.error || '登录失败');
      }
    } catch {
      setUserMsg('网络错误');
    }
  };

  // 注册
  const handleRegister = async e => {
    e.preventDefault();
    setUserMsg('');
    if (!userForm.username || !userForm.password) {
      setUserMsg('请填写完整信息'); return;
    }
    try {
      const res = await axios.post(`${API_BASE}/register`, userForm);
      if (res.data && res.data.ok) {
        setUser(res.data.data);
        setBalance(res.data.data.balance || 0);
        localStorage.setItem('nonsence_user_login', JSON.stringify(res.data.data));
        localStorage.setItem('nonsence_balance', String(res.data.data.balance || 0));
      } else {
        setUserMsg(res.data.error || '注册失败');
      }
    } catch {
      setUserMsg('网络错误');
    }
  };

  let content;
  if (page === 'home') content = <Home />;
  else if (page === 'cases') content = <Cases />;
  else if (page === 'messages') content = <MessageBoard />;
  else if (page === 'client') {
    if (!user) {
      content = (
        <div style={{maxWidth:360,margin:'60px auto',background:'#fff',borderRadius:10,boxShadow:'0 2px 16px rgba(0,0,0,0.07)',padding:'36px 32px'}}>
          <h2 style={{textAlign:'center',color:'#1976d2'}}>{showReg ? '广告主注册' : '广告主登录'}</h2>
          <form onSubmit={showReg ? handleRegister : handleLogin}>
            <label>用户名：<input name="username" value={userForm.username} onChange={e=>setUserForm(f=>({...f,username:e.target.value}))} required /></label>
            <label>密码：<input name="password" type="password" value={userForm.password} onChange={e=>setUserForm(f=>({...f,password:e.target.value}))} required /></label>
            <button type="submit" style={{width:'100%',marginTop:18}}>{showReg ? '注册' : '登录'}</button>
          </form>
          {userMsg && <div className="form-msg" style={{marginTop:12}}>{userMsg}</div>}
          <div style={{marginTop:18,textAlign:'center'}}>
            {showReg ? (
              <span>已有账号？<a href="#" onClick={e=>{e.preventDefault();setShowReg(false);setUserMsg('');}}>去登录</a></span>
            ) : (
              <span>没有账号？<a href="#" onClick={e=>{e.preventDefault();setShowReg(true);setUserMsg('');}}>去注册</a></span>
            )}
          </div>
        </div>
      );
    } else {
      content = (
        <div>
          <button
            style={{position:'absolute',right:30,top:30,zIndex:10,background:'#e57373',color:'#fff',border:'none',borderRadius:4,padding:'6px 16px',cursor:'pointer'}}
            onClick={() => {
              setUser(null);
              localStorage.removeItem('nonsence_user_login');
              setUserMsg('');
            }}
          >
            退出登录
          </button>
          <ClientCenter user={user} balance={balance} />
        </div>
      );
    }
  }
  else if (page === 'admin') {
    if (!adminLogged) {
      content = (
        <div style={{maxWidth:360,margin:'60px auto',background:'#fff',borderRadius:10,boxShadow:'0 2px 16px rgba(0,0,0,0.07)',padding:'36px 32px'}}>
          <h2 style={{textAlign:'center',color:'#1976d2'}}>管理员登录</h2>
          <form onSubmit={e => {
            e.preventDefault();
            if (adminForm.user === ADMIN_USER && adminForm.pwd === ADMIN_PWD) {
              setAdminLogged(true);
              localStorage.setItem('nonsence_admin_logged', '1');
            } else {
              setAdminMsg('账号或密码错误');
            }
          }} style={{display:'flex',flexDirection:'column',gap:18}}>
            <label>账号：<input value={adminForm.user} onChange={e=>setAdminForm(f=>({...f,user:e.target.value}))} required /></label>
            <label>密码：<input type="password" value={adminForm.pwd} onChange={e=>setAdminForm(f=>({...f,pwd:e.target.value}))} required /></label>
            <button type="submit" style={{background:'#1976d2',color:'#fff',border:'none',borderRadius:4,padding:'8px 0',fontSize:'1.08rem',marginTop:8}}>登录</button>
            {adminMsg && <div style={{color:'#e57373',marginTop:4}}>{adminMsg}</div>}
          </form>
        </div>
      );
    } else {
      content = <AdminCenter />;
    }
  }
  else if (page === 'api') content = <ApiDoc />;
  else if (page === 'contact') content = <Contact />;
  else if (page === 'about') content = <About />;

  return (
    <div className="App">
      <Sidebar setPage={setPage} current={page} />
      <Navbar setPage={setPage} current={page} />
      <div className="App-content" style={{marginLeft:180}}>
        {content}
      </div>
      <Footer />
    </div>
  );
}

export default App;
