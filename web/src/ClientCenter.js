import React, { useState, useEffect, useRef } from 'react';
import './ClientCenter.css';
import './App.css'; // 确保样式可用
import axios from 'axios';

const API_BASE = 'https://djck4ikhm4.hzh.sealos.run';

function ClientCenter({ user, page }) {
  const tab = page.replace('client_', '');
  const [ads, setAds] = useState([]);
  const [form, setForm] = useState({
    type: '横幅广告',
    name: '',
    budget: '',
    start: '',
    end: '',
    material: '',
  });
  const [msg, setMsg] = useState('');

  // 充值相关
  const [balance, setBalance] = useState(() => {
    const b = localStorage.getItem('nonsence_balance');
    return b ? Number(b) : 0;
  });
  const [rechargeForm, setRechargeForm] = useState({ amount: '', method: '微信支付' });
  const [rechargeMsg, setRechargeMsg] = useState('');
  const [recharges, setRecharges] = useState([]);

  // 广告数据统计相关
  const [statsType, setStatsType] = useState('全部');
  const [stats, setStats] = useState([]);
  const chartRef = useRef(null);

  // 发票相关
  const [invoices, setInvoices] = useState([]);
  const [invoiceForm, setInvoiceForm] = useState({ rechargeId: '', title: '', taxId: '' });
  const [invoiceMsg, setInvoiceMsg] = useState('');

  // 个人信息相关
  const [profile, setProfile] = useState({ nickname: '', email: '', phone: '' });
  const [profileMsg, setProfileMsg] = useState('');

  // 素材管理相关
  const [materials, setMaterials] = useState([]);
  const [materialMsg, setMaterialMsg] = useState('');

  // 加载后端数据
  useEffect(() => {
    if (!user) return;
    // 只读 localStorage 的余额
    const b = localStorage.getItem('nonsence_balance');
    setBalance(b ? Number(b) : 0);
    // 查询广告、充值、发票等
    axios.post(`${API_BASE}/myAds`, { userId: user._id }).then(res => {
      if (res.data && res.data.ok) setAds(res.data.data);
    });
    axios.post(`${API_BASE}/rechargeHistory`, { userId: user._id }).then(res => {
      if (res.data && res.data.ok) setRecharges(res.data.data);
    });
    axios.post(`${API_BASE}/invoiceHistory`, { userId: user._id }).then(res => {
      if (res.data && res.data.ok) setInvoices(res.data.data);
    });
  }, [user]);

  // 每次余额变化时持久化到 localStorage
  useEffect(() => {
    localStorage.setItem('nonsence_balance', String(balance));
  }, [balance]);

  // 处理广告表单输入
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 提交购买广告
  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    if (!form.name.trim() || !form.budget.trim() || !form.start || !form.end || !form.material.trim()) {
      setMsg('请填写完整信息');
      return;
    }
    try {
      const payload = {
        userId: user && user._id ? user._id : user?.id,
        type: form.type,
        name: form.name,
        budget: Number(form.budget),
        start: form.start,
        end: form.end,
        material: form.material
      };
      if (!payload.userId || !payload.type || !payload.name || !payload.budget || !payload.start || !payload.end || !payload.material) {
        setMsg('参数不完整'); return;
      }
      const res = await axios.post(`${API_BASE}/buyAd`, payload);
      if (res.data && res.data.ok) {
        setMsg('广告购买申请已提交，等待审核');
        axios.post(`${API_BASE}/myAds`, { userId: payload.userId }).then(res => {
          if (res.data && res.data.ok) setAds(res.data.data);
        });
        if (typeof res.data.balance === 'number') {
          setBalance(res.data.balance);
          localStorage.setItem('nonsence_balance', String(res.data.balance));
        }
        setForm({ type: '横幅广告', name: '', budget: '', start: '', end: '', material: '' });
      } else {
        setMsg(res.data.error || '购买失败');
      }
    } catch {
      setMsg('网络错误');
    }
  };

  // 处理充值表单输入
  const handleRechargeChange = e => {
    setRechargeForm({ ...rechargeForm, [e.target.name]: e.target.value });
  };

  // 提交充值
  const handleRecharge = async e => {
    e.preventDefault();
    setRechargeMsg('');
    const amount = Number(rechargeForm.amount);
    const payload = {
      userId: user && user._id ? user._id : user?.id,
      amount,
      method: '微信支付'
    };
    if (!payload.userId || !payload.amount || payload.amount <= 0 || payload.method !== '微信支付') {
      setRechargeMsg('参数错误'); return;
    }
    try {
      const res = await axios.post(`${API_BASE}/recharge`, payload);
      if (res.data && res.data.ok) {
        setRechargeMsg('充值成功！');
        setBalance(res.data.balance);
        axios.post(`${API_BASE}/rechargeHistory`, { userId: payload.userId }).then(res => {
          if (res.data && res.data.ok) setRecharges(res.data.data);
        });
        setRechargeForm({ amount: '', method: '微信支付' });
      } else {
        setRechargeMsg(res.data.error || '充值失败');
      }
    } catch {
      setRechargeMsg('网络错误');
    }
  };

  // 处理广告数据类型筛选
  const handleStatsType = e => {
    setStatsType(e.target.value);
  };

  // 发票表单输入
  const handleInvoiceChange = e => {
    setInvoiceForm({ ...invoiceForm, [e.target.name]: e.target.value });
  };

  // 提交发票申请（本地模拟，后端可扩展）
  const handleInvoice = e => {
    e.preventDefault();
    if (!invoiceForm.rechargeId || !invoiceForm.title.trim() || !invoiceForm.taxId.trim()) {
      setInvoiceMsg('请填写完整信息');
      return;
    }
    // 可扩展为后端接口
    setInvoiceMsg('发票申请已提交，等待处理');
  };

  // 素材上传（本地模拟）
  const handleMaterialUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setMaterials([{ id: Date.now(), name: file.name, url: ev.target.result }, ...materials]);
      setMaterialMsg('上传成功！');
      setTimeout(() => setMaterialMsg(''), 1500);
    };
    reader.readAsDataURL(file);
  };

  // 删除素材（本地模拟）
  const handleMaterialDelete = id => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  // 过滤后的统计数据（本地模拟）
  const filteredStats = statsType === '全部' ? ads : ads.filter(ad => ad.type === statsType);

  // 简单柱状图渲染
  useEffect(() => {
    if (tab !== 'stats' || !chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');
    ctx.clearRect(0, 0, 800, 300);
    const data = filteredStats.slice(0, 8); // 最多显示8条
    const barWidth = 40;
    const gap = 40;
    const maxImpr = Math.max(...data.map(d => d.impressions), 1);
    const maxClick = Math.max(...data.map(d => d.clicks), 1);
    // 画曝光量
    data.forEach((d, i) => {
      const h = Math.round((d.impressions / maxImpr) * 180);
      ctx.fillStyle = '#1976d2';
      ctx.fillRect(60 + i * (barWidth + gap), 220 - h, barWidth, h);
      ctx.fillStyle = '#333';
      ctx.font = '12px sans-serif';
      ctx.fillText(d.name.slice(0, 6), 60 + i * (barWidth + gap), 240);
      ctx.fillText(d.impressions, 60 + i * (barWidth + gap), 220 - h - 6);
    });
    // 画点击量
    data.forEach((d, i) => {
      const h = Math.round((d.clicks / maxClick) * 180);
      ctx.fillStyle = '#43a047';
      ctx.fillRect(60 + i * (barWidth + gap) + barWidth / 2, 220 - h, barWidth / 2, h);
      ctx.fillStyle = '#333';
      ctx.font = '12px sans-serif';
      ctx.fillText(d.clicks, 60 + i * (barWidth + gap) + barWidth / 2, 220 - h - 6);
    });
    // 图例
    ctx.fillStyle = '#1976d2';
    ctx.fillRect(600, 30, 18, 18);
    ctx.fillStyle = '#333';
    ctx.fillText('曝光量', 625, 44);
    ctx.fillStyle = '#43a047';
    ctx.fillRect(600, 60, 18, 18);
    ctx.fillStyle = '#333';
    ctx.fillText('点击量', 625, 74);
  }, [tab, filteredStats]);

  return (
    <main className="client-main">
      <div style={{marginBottom: 24, textAlign: 'left', fontWeight: 500, color: '#6366f1', fontSize: 18}}>
        当前账号：<span style={{color:'#222'}}>{user?.username}</span>
      </div>
      <div className="balance-bar">账户余额：<span>￥{balance.toFixed(2)}</span></div>
      {tab === 'ads' && (
        <div>
          <h2>我的广告</h2>
          {ads.length === 0 ? <p>暂无广告，请先购买。</p> : (
            <table className="ads-table">
              <thead>
                <tr>
                  <th>广告名称</th><th>类型</th><th>预算</th><th>投放时间</th><th>状态</th><th>操作</th>
                </tr>
              </thead>
              <tbody>
                {ads.map(ad => (
                  <tr key={ad._id}>
                    <td>{ad.name}</td>
                    <td>{ad.type}</td>
                    <td>￥{ad.budget}</td>
                    <td>{ad.start} ~ {ad.end}</td>
                    <td>{ad.status}</td>
                    <td><button disabled>编辑</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {tab === 'buy' && (
        <div>
          <h2>购买广告</h2>
          <form className="buy-form" onSubmit={handleSubmit}>
            <label>广告类型：
              <select name="type" value={form.type} onChange={handleChange}>
                <option>横幅广告</option>
                <option>视频广告</option>
                <option>信息流广告</option>
                <option>开屏广告</option>
                <option>原生广告</option>
              </select>
            </label>
            <label>广告名称：
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>预算（元）：
              <input name="budget" type="number" min="1" value={form.budget} onChange={handleChange} required />
            </label>
            <label>投放开始：
              <input name="start" type="date" value={form.start} onChange={handleChange} required />
            </label>
            <label>投放结束：
              <input name="end" type="date" value={form.end} onChange={handleChange} required />
            </label>
            <label>广告素材（图片/链接/文字）：
              <input name="material" value={form.material} onChange={handleChange} required />
            </label>
            <button type="submit">提交购买</button>
            {msg && <div className="form-msg">{msg}</div>}
          </form>
        </div>
      )}
      {tab === 'material' && (
        <div>
          <h2>广告素材管理</h2>
          <input type="file" accept="image/*" onChange={handleMaterialUpload} />
          {materialMsg && <div className="form-msg">{materialMsg}</div>}
          <div className="material-list">
            {materials.length === 0 ? <p>暂无素材，请上传。</p> : (
              <ul>
                {materials.map(m => (
                  <li key={m.id}>
                    <img src={m.url} alt={m.name} />
                    <div className="mat-name">{m.name}</div>
                    <button onClick={() => handleMaterialDelete(m.id)}>删除</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {tab === 'recharge' && (
        <div>
          <h2>充值</h2>
          <form className="recharge-form" onSubmit={handleRecharge}>
            <label>充值金额（元）：
              <input name="amount" type="number" min="1" value={rechargeForm.amount} onChange={handleRechargeChange} required />
            </label>
            <label>支付方式：
              <select name="method" value={rechargeForm.method} onChange={handleRechargeChange} disabled>
                <option>微信支付</option>
              </select>
            </label>
            <button type="submit">立即充值</button>
            {rechargeMsg && <div className="form-msg">{rechargeMsg}</div>}
          </form>
        </div>
      )}
      {tab === 'rechargeHistory' && (
        <div>
          <h2>充值历史</h2>
          {recharges.length === 0 ? <p>暂无充值记录。</p> : (
            <table className="ads-table">
              <thead>
                <tr><th>时间</th><th>金额</th><th>方式</th><th>状态</th></tr>
              </thead>
              <tbody>
                {recharges.map(rec => (
                  <tr key={rec._id}>
                    <td>{rec.time}</td>
                    <td>￥{rec.amount}</td>
                    <td>{rec.method}</td>
                    <td>{rec.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {tab === 'stats' && (
        <div>
          <h2>广告数据</h2>
          <div className="stats-bar">
            <label>广告类型筛选：
              <select value={statsType} onChange={handleStatsType}>
                <option>全部</option>
                <option>横幅广告</option>
                <option>视频广告</option>
                <option>信息流广告</option>
                <option>开屏广告</option>
                <option>原生广告</option>
              </select>
            </label>
          </div>
          <canvas ref={chartRef} width={800} height={260} style={{marginBottom:24,background:'#f4f6fa',borderRadius:8}} />
          {filteredStats.length === 0 ? <p>暂无广告数据。</p> : (
            <table className="ads-table">
              <thead>
                <tr>
                  <th>广告名称</th><th>类型</th><th>预算</th><th>投放时间</th><th>状态</th>
                </tr>
              </thead>
              <tbody>
                {filteredStats.map(ad => (
                  <tr key={ad._id}>
                    <td>{ad.name}</td>
                    <td>{ad.type}</td>
                    <td>￥{ad.budget}</td>
                    <td>{ad.start} ~ {ad.end}</td>
                    <td>{ad.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {tab === 'invoice' && (
        <div>
          <h2>发票管理</h2>
          <form className="invoice-form" onSubmit={handleInvoice}>
            <label>选择充值记录：
              <select name="rechargeId" value={invoiceForm.rechargeId} onChange={handleInvoiceChange} required>
                <option value="">请选择</option>
                {recharges.map(rec => (
                  <option value={rec._id} key={rec._id}>￥{rec.amount} - {rec.time}</option>
                ))}
              </select>
            </label>
            <label>发票抬头：
              <input name="title" value={invoiceForm.title} onChange={handleInvoiceChange} required />
            </label>
            <label>税号：
              <input name="taxId" value={invoiceForm.taxId} onChange={handleInvoiceChange} required />
            </label>
            <button type="submit">申请开票</button>
            {invoiceMsg && <div className="form-msg">{invoiceMsg}</div>}
          </form>
          <h3 style={{marginTop:32}}>发票申请历史</h3>
          {invoices.length === 0 ? <p>暂无发票申请。</p> : (
            <table className="ads-table">
              <thead>
                <tr><th>申请时间</th><th>发票抬头</th><th>税号</th><th>金额</th><th>关联充值</th><th>状态</th></tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv._id}>
                    <td>{inv.time}</td>
                    <td>{inv.title}</td>
                    <td>{inv.taxId}</td>
                    <td>￥{inv.amount}</td>
                    <td>{(() => {
                      const rec = recharges.find(r => String(r._id) === inv.rechargeId);
                      return rec ? `￥${rec.amount} - ${rec.time}` : '已删除';
                    })()}</td>
                    <td>{inv.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {tab === 'help' && (
        <div>
          <h2>帮助中心</h2>
          <div className="faq-list">
            <div className="faq-item">
              <div className="faq-q">Q: 如何购买广告？</div>
              <div className="faq-a">A: 在"购买广告"页面填写广告信息并提交，等待管理员审核即可。</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">Q: 广告审核需要多久？</div>
              <div className="faq-a">A: 一般1个工作日内完成审核，审核结果会在"我的广告"页面显示。</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">Q: 如何充值和开票？</div>
              <div className="faq-a">A: 在"充值"页面完成充值后，可在"发票管理"申请开票，管理员审核后开具。</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">Q: 联系方式？</div>
              <div className="faq-a">A: 如有疑问可在"联系我们"页面留言，或拨打客服电话 400-888-8888。</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">Q: 如何管理广告素材？</div>
              <div className="faq-a">A: 在"广告素材管理"页面上传、删除素材，购买广告时可直接引用。</div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ClientCenter; 