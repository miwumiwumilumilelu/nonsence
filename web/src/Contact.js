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
  };

  return (
    <div className="page-card">
      <div className="page-section-title">联系我们</div>
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
  );
}

export default Contact; 