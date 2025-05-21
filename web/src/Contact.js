import React, { useState } from 'react';
import './Contact.css';
import './App.css';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
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
          <input name="name" type="text" placeholder="姓名" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="邮箱" value={form.email} onChange={handleChange} required />
          <textarea name="message" placeholder="留言内容" value={form.message} onChange={handleChange} required />
          <button type="submit">提交</button>
          {submitted && <div className="contact-success">感谢您的留言，我们会尽快联系您！</div>}
        </form>
      </div>
    </div>
  );
}

export default Contact; 