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

function App() {
  const [page, setPage] = useState('home');
  // 广告主登录
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('nonsence_user_login');
    return u ? JSON.parse(u) : null;
  });
  const [userForm, setUserForm] = useState({ email: '', pwd: '' });
  const [userReg, setUserReg] = useState({ email: '', pwd: '', nickname: '', phone: '' });
  const [userMsg, setUserMsg] = useState('');
  const [showReg, setShowReg] = useState(false);

  // 管理员登录
  const [adminLogged, setAdminLogged] = useState(() => localStorage.getItem('nonsence_admin_logged') === '1');
  const [adminForm, setAdminForm] = useState({ user: '', pwd: '' });
  const [adminMsg, setAdminMsg] = useState('');
  const ADMIN_USER = 'admin';
  const ADMIN_PWD = 'admin123';

  // 广告主本地用户表
  const USERLIST_STORAGE_KEY = 'nonsence_userlist';
  let userList = [];
  try { userList = JSON.parse(localStorage.getItem(USERLIST_STORAGE_KEY) || '[]'); } catch { userList = []; }

  let content;
  if (page === 'home') content = <Home />;
  else if (page === 'cases') content = <Cases />;
  else if (page === 'messages') content = <MessageBoard />;
  else if (page === 'client') {
    if (!user) {
      content = (
        <div style={{maxWidth:360,margin:'60px auto',background:'#fff',borderRadius:10,boxShadow:'0 2px 16px rgba(0,0,0,0.07)',padding:'36px 32px'}}>
          <h2 style={{textAlign:'center',color:'#1976d2'}}>{showReg ? '广告主注册' : '广告主登录'}</h2>
          {showReg ? (
            <form onSubmit={e => {
              e.preventDefault();
              if (!userReg.email || !userReg.pwd || !userReg.nickname || !userReg.phone) {
                setUserMsg('请填写完整信息'); return;
              }
              if (userList.find(u => u.email === userReg.email)) {
                setUserMsg('该邮箱已注册'); return;
              }
              const newUser = { ...userReg, id: Date.now(), enabled: true };
              localStorage.setItem(USERLIST_STORAGE_KEY, JSON.stringify([newUser, ...userList]));
              setUser(newUser);
              localStorage.setItem('nonsence_user_login', JSON.stringify(newUser));
            }} style={{display:'flex',flexDirection:'column',gap:18}}>
              <label>邮箱：<input value={userReg.email} onChange={e=>setUserReg(f=>({...f,email:e.target.value}))} required /></label>
              <label>密码：<input type="password" value={userReg.pwd} onChange={e=>setUserReg(f=>({...f,pwd:e.target.value}))} required /></label>
              <label>昵称：<input value={userReg.nickname} onChange={e=>setUserReg(f=>({...f,nickname:e.target.value}))} required /></label>
              <label>手机号：<input value={userReg.phone} onChange={e=>setUserReg(f=>({...f,phone:e.target.value}))} required /></label>
              <button type="submit" style={{background:'#1976d2',color:'#fff',border:'none',borderRadius:4,padding:'8px 0',fontSize:'1.08rem',marginTop:8}}>注册</button>
              {userMsg && <div style={{color:'#e57373',marginTop:4}}>{userMsg}</div>}
            </form>
          ) : (
            <form onSubmit={e => {
              e.preventDefault();
              const u = userList.find(u => u.email === userForm.email && u.pwd === userForm.pwd);
              if (!u) { setUserMsg('账号或密码错误'); return; }
              if (!u.enabled) { setUserMsg('账号已被禁用'); return; }
              setUser(u);
              localStorage.setItem('nonsence_user_login', JSON.stringify(u));
            }} style={{display:'flex',flexDirection:'column',gap:18}}>
              <label>邮箱：<input value={userForm.email} onChange={e=>setUserForm(f=>({...f,email:e.target.value}))} required /></label>
              <label>密码：<input type="password" value={userForm.pwd} onChange={e=>setUserForm(f=>({...f,pwd:e.target.value}))} required /></label>
              <button type="submit" style={{background:'#1976d2',color:'#fff',border:'none',borderRadius:4,padding:'8px 0',fontSize:'1.08rem',marginTop:8}}>登录</button>
              {userMsg && <div style={{color:'#e57373',marginTop:4}}>{userMsg}</div>}
            </form>
          )}
          <div style={{marginTop:18,textAlign:'center'}}>
            <button style={{background:'none',border:'none',color:'#1976d2',cursor:'pointer'}} onClick={()=>{setShowReg(r=>!r);setUserMsg('');}}>
              {showReg ? '已有账号？去登录' : '没有账号？去注册'}
            </button>
          </div>
        </div>
      );
    } else {
      content = <ClientCenter user={user} />;
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
