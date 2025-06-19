import React, { useState } from 'react';
import './App.css';
import './Login.css';
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
  });  const [userForm, setUserForm] = useState({ username: '', password: '' });
  const [userMsg, setUserMsg] = useState('');
  const [showReg, setShowReg] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [balance, setBalance] = useState(() => {
    const b = localStorage.getItem('nonsence_balance');
    return b ? Number(b) : 0;
  });

  // 管理员登录
  const [adminLogged, setAdminLogged] = useState(() => localStorage.getItem('nonsence_admin_logged') === '1');  const [adminForm, setAdminForm] = useState({ pwd: '' });
  const [adminMsg, setAdminMsg] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminTab, setAdminTab] = useState('adReview');
  const ADMIN_USER = 'admin';
  const ADMIN_PWD = 'admin123';
  // 登录
  const handleLogin = async e => {
    e.preventDefault();
    setUserMsg('');
    setUserLoading(true);
    if (!userForm.username || !userForm.password) {
      setUserMsg('请填写完整信息'); 
      setUserLoading(false);
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/loginOrRegister`, userForm);
      if (res.data && res.data.ok) {
        setUser(res.data.data);
        setBalance(res.data.data.balance || 0);
        localStorage.setItem('nonsence_user_login', JSON.stringify(res.data.data));
        localStorage.setItem('nonsence_balance', String(res.data.data.balance || 0));
        setPage('client_ads');
      } else {
        setUserMsg(res.data.error || '登录失败');
      }
    } catch {
      setUserMsg('网络错误');
    }
    setUserLoading(false);
  };
  // 注册
  const handleRegister = async e => {
    e.preventDefault();
    setUserMsg('');
    setUserLoading(true);
    if (!userForm.username || !userForm.password) {
      setUserMsg('请填写完整信息'); 
      setUserLoading(false);
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/register`, userForm);
      if (res.data && res.data.ok) {
        if (res.data.data.status === 1) {
          setUser(res.data.data);
          setBalance(res.data.data.balance || 0);
          localStorage.setItem('nonsence_user_login', JSON.stringify(res.data.data));
          localStorage.setItem('nonsence_balance', String(res.data.data.balance || 0));
          setPage('client_ads');
        } else {
          setUserMsg('注册成功，等待管理员审核！');
        }
      } else {
        setUserMsg(res.data.error || '注册失败');
      }
    } catch {
      setUserMsg('网络错误');
    }
    setUserLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nonsence_user_login');
    setUserMsg('');
    setPage('home');
  };

  const handleAdminLogout = () => {
    setAdminLogged(false);
    localStorage.removeItem('nonsence_admin_logged');
    setAdminMsg('');
    setPage('home');
  };  let content;
  let showSidebar = false;
  let isLoginPage = false;
  let isSpecialBgPage = false;
  if (page.startsWith('client') && user) showSidebar = true;
  if (page === 'admin' && adminLogged) showSidebar = true;
  if ((page === 'client' && !user) || (page === 'admin' && !adminLogged)) isLoginPage = true;
  if (page === 'messages' || page === 'cases' || page === 'api' || page === 'contact' || page === 'about') isSpecialBgPage = true;

  if (page === 'home') content = <Home />;
  else if (page === 'cases') content = <Cases />;
  else if (page === 'messages') content = <MessageBoard />;  else if (page === 'client' && !user) {
    content = (
      <div className="login-bg">
        <div className="login-wave-bg">
          <svg className="login-wave-anim" viewBox="0 0 2880 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#a5b4fc" fillOpacity="0.35" d="M0,60 C480,120 960,0 1440,60 C1920,120 2400,0 2880,60 L2880,120 L0,120 Z"/>
          </svg>
        </div>
        <div className="login-card">
          <div className="login-decoration"></div>
          <div className="login-decoration-2"></div>
          <h2 className="login-title">{showReg ? '广告主注册' : '广告主登录'}</h2>
          <form className="login-form" onSubmit={showReg ? handleRegister : handleLogin}>
            <div className="login-form-group">
              <label className="login-label">用户名</label>
              <input 
                className="login-input"
                name="username" 
                value={userForm.username} 
                onChange={e=>setUserForm(f=>({...f,username:e.target.value}))} 
                required 
                placeholder="请输入用户名"
              />
            </div>
            <div className="login-form-group">
              <label className="login-label">密码</label>
              <input 
                className="login-input"
                name="password" 
                type="password" 
                value={userForm.password} 
                onChange={e=>setUserForm(f=>({...f,password:e.target.value}))} 
                required 
                placeholder="请输入密码"
              />
            </div>            <button type="submit" className="login-button" disabled={userLoading}>
              {userLoading && <span className="login-loading"></span>}
              {showReg ? '注册' : '登录'}
            </button>
          </form>
          {userMsg && (
            <div className={`login-message ${userMsg.includes('成功') ? 'success' : 'error'}`}>
              {userMsg}
            </div>
          )}
          <div className="login-switch">
            {showReg ? (
              <span>已有账号？<a href="#" onClick={e=>{e.preventDefault();setShowReg(false);setUserMsg('');}}>去登录</a></span>
            ) : (
              <span>没有账号？<a href="#" onClick={e=>{e.preventDefault();setShowReg(true);setUserMsg('');}}>去注册</a></span>
            )}
          </div>
        </div>
      </div>
    );
  }
  else if (page.startsWith('client') && user) {
    content = <ClientCenter user={user} page={page} />;
  }  else if (page === 'admin') {
    if (!adminLogged) {
      content = (
        <div className="login-bg">
          <div className="login-wave-bg">
            <svg className="login-wave-anim" viewBox="0 0 2880 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#a5b4fc" fillOpacity="0.35" d="M0,60 C480,120 960,0 1440,60 C1920,120 2400,0 2880,60 L2880,120 L0,120 Z"/>
            </svg>
          </div>
          <div className="login-card">
            <div className="login-decoration"></div>
            <div className="login-decoration-2"></div>
            <h2 className="login-title">管理员登录</h2>            <form className="login-form" onSubmit={e => {
              e.preventDefault();
              setAdminLoading(true);
              setAdminMsg('');
              setTimeout(() => {
                if (adminForm.pwd === '123456') {
                  setAdminLogged(true);
                  localStorage.setItem('nonsence_admin_logged', '1');
                } else {
                  setAdminMsg('密码错误');
                }
                setAdminLoading(false);
              }, 500);
            }}>
              <div className="login-form-group">
                <label className="login-label">管理员密码</label>
                <input 
                  className="login-input"
                  type="password" 
                  value={adminForm.pwd} 
                  onChange={e=>setAdminForm(f=>({...f,pwd:e.target.value}))} 
                  required 
                  placeholder="请输入管理员密码"
                />
              </div>
              <button type="submit" className="login-button" disabled={adminLoading}>
                {adminLoading && <span className="login-loading"></span>}
                登录
              </button>
            </form>
            {adminMsg && (
              <div className="login-message error">
                {adminMsg}
              </div>
            )}
          </div>
        </div>
      );
    } else {
      content = <AdminCenter tab={adminTab} setTab={setAdminTab} />;
    }
  }
  else if (page === 'api') content = <ApiDoc />;
  else if (page === 'contact') content = <Contact />;
  else if (page === 'about') content = <About />;

  return (
    <div className="App">
      {showSidebar && <Sidebar setPage={setPage} current={page} adminTab={adminTab} setAdminTab={setAdminTab} />}
      <Navbar
        setPage={setPage}
        current={page}
        user={user}
        adminLogged={adminLogged}
        onLogout={handleLogout}
        onAdminLogout={handleAdminLogout}
        setShowReg={setShowReg}
      />      <div className={`App-content ${isLoginPage ? 'login-page' : ''} ${isSpecialBgPage ? 'special-bg-page' : ''}`} style={showSidebar ? {marginLeft:180} : {}}>
        {content}
      </div>
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;
