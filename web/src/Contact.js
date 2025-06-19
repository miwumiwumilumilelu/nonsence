import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';
import './App.css';

function Contact() {
  const [form, setForm] = useState({ nickname: '', content: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.nickname.trim() || !form.content.trim()) {
      setMsg('请填写完整信息');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      const res = await axios.post('https://djck4ikhm4.hzh.sealos.run/message', {
        nickname: form.nickname,
        content: form.content,
        type: 2 // 联系我们
      });
      if (res.data && res.data.ok) {
        setMsg('留言提交成功，等待审核！');
        setForm({ nickname: '', content: '' });
      } else {
        setMsg(res.data.error || '提交失败');
      }
    } catch (err) {
      setMsg('网络错误，请稍后再试');
    }
    setLoading(false);
  };  return (
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
        <div className="contact-page">
          <div className="contact-info">
            <h2>联系我们</h2>
            <p><b>电话：</b>18099338216</p>
            <p><b>邮箱：</b>938770761@qq.com</p>
            <p><b>地址：</b>华中科技大学软件学院1101</p>
            <p style={{color:'#888',marginTop:24}}>欢迎合作与咨询，期待与您共创价值！</p>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <h3>在线留言</h3>
            <input name="nickname" type="text" placeholder="昵称" value={form.nickname} onChange={handleChange} required />
            <textarea name="content" placeholder="留言内容" value={form.content} onChange={handleChange} required />
            <button type="submit" disabled={loading}>{loading ? '提交中...' : '提交'}</button>
            {msg && <div className="contact-success">{msg}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact; 