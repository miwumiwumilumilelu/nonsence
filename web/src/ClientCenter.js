import React, { useState, useEffect, useRef } from 'react';
import './ClientCenter.css';
import './App.css'; // 确保样式可用

const menu = [
  { key: 'profile', label: '个人信息' },
  { key: 'ads', label: '我的广告' },
  { key: 'buy', label: '购买广告' },
  { key: 'material', label: '广告素材管理' },
  { key: 'msg', label: '消息中心' },
  { key: 'help', label: '帮助中心' },
  { key: 'recharge', label: '充值' },
  { key: 'rechargeHistory', label: '充值历史' },
  { key: 'stats', label: '广告数据' },
  { key: 'invoice', label: '发票管理' },
];

const AD_STORAGE_KEY = 'nonsence_ads';
const RECHARGE_STORAGE_KEY = 'nonsence_recharges';
const BALANCE_STORAGE_KEY = 'nonsence_balance';
const INVOICE_STORAGE_KEY = 'nonsence_invoices';
const PROFILE_STORAGE_KEY = 'nonsence_profile';
const MATERIAL_STORAGE_KEY = 'nonsence_materials';
const MSG_STORAGE_KEY = 'nonsence_msgs';

// 模拟广告数据统计
function mockStats(ads) {
  return ads.map(ad => ({
    ...ad,
    impressions: Math.floor(Math.random() * 10000 + 1000),
    clicks: Math.floor(Math.random() * 1000 + 100),
    cost: Number(ad.budget) - Math.floor(Math.random() * 100),
    ctr: 0, // 点击率
  })).map(ad => ({ ...ad, ctr: ad.impressions ? (ad.clicks / ad.impressions * 100).toFixed(2) : '0.00' }));
}

function ClientCenter({ user }) {
  const [tab, setTab] = useState('ads');
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
  const [balance, setBalance] = useState(0);
  const [rechargeForm, setRechargeForm] = useState({ amount: '', method: '支付宝' });
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

  // 消息相关
  const [msgs, setMsgs] = useState([]);

  // 加载本地数据
  useEffect(() => {
    const saved = localStorage.getItem(AD_STORAGE_KEY);
    if (saved) setAds(JSON.parse(saved));
    const bal = localStorage.getItem(BALANCE_STORAGE_KEY);
    if (bal) setBalance(Number(bal));
    const recs = localStorage.getItem(RECHARGE_STORAGE_KEY);
    if (recs) setRecharges(JSON.parse(recs));
    const invs = localStorage.getItem(INVOICE_STORAGE_KEY);
    if (invs) setInvoices(JSON.parse(invs));
    const prof = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (prof) setProfile(JSON.parse(prof));
    const mats = localStorage.getItem(MATERIAL_STORAGE_KEY);
    if (mats) setMaterials(JSON.parse(mats));
    const msgSaved = localStorage.getItem(MSG_STORAGE_KEY);
    if (msgSaved) setMsgs(JSON.parse(msgSaved));
  }, []);

  // 保存广告数据
  useEffect(() => {
    localStorage.setItem(AD_STORAGE_KEY, JSON.stringify(ads));
    setStats(mockStats(ads));
  }, [ads]);

  // 保存余额
  useEffect(() => {
    localStorage.setItem(BALANCE_STORAGE_KEY, String(balance));
  }, [balance]);

  // 保存充值历史
  useEffect(() => {
    localStorage.setItem(RECHARGE_STORAGE_KEY, JSON.stringify(recharges));
  }, [recharges]);

  // 保存发票历史
  useEffect(() => {
    localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(invoices));
  }, [invoices]);

  // 保存个人信息
  useEffect(() => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  // 保存素材
  useEffect(() => {
    localStorage.setItem(MATERIAL_STORAGE_KEY, JSON.stringify(materials));
  }, [materials]);

  // 保存消息
  useEffect(() => {
    localStorage.setItem(MSG_STORAGE_KEY, JSON.stringify(msgs));
  }, [msgs]);

  // 自动生成消息（广告审核、发票审核）
  useEffect(() => {
    // 广告审核消息
    ads.forEach(ad => {
      if ((ad.status === '投放中' || ad.status === '已驳回') && !msgs.find(m => m.type==='ad' && m.id===ad.id)) {
        setMsgs(msgs => [{
          id: ad.id,
          type: 'ad',
          title: `广告"${ad.name}"审核${ad.status==='投放中'?'通过':'被驳回'}`,
          content: `广告"${ad.name}"已${ad.status==='投放中'?'通过审核，已投放':'被驳回，请修改后重新提交'}`,
          time: ad.created,
          status: ad.status
        }, ...msgs]);
      }
    });
    // 发票审核消息
    if (Array.isArray(invoices)) {
      invoices.forEach(inv => {
        if ((inv.status === '已开票' || inv.status === '已驳回') && !msgs.find(m => m.type==='inv' && m.id===inv.id)) {
          setMsgs(msgs => [{
            id: inv.id,
            type: 'inv',
            title: `发票申请${inv.status==='已开票'?'已开票':'被驳回'}`,
            content: `您的发票申请（抬头：${inv.title}，金额：￥${inv.amount}）${inv.status==='已开票'?'已开票':'被驳回，请检查信息'}`,
            time: inv.time,
            status: inv.status
          }, ...msgs]);
        }
      });
    }
  }, [ads, invoices]);

  // 处理广告表单输入
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 提交购买广告
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name.trim() || !form.budget.trim() || !form.start || !form.end || !form.material.trim()) {
      setMsg('请填写完整信息');
      return;
    }
    const newAd = {
      ...form,
      id: Date.now(),
      status: '待审核',
      created: new Date().toLocaleString(),
    };
    setAds([newAd, ...ads]);
    setForm({ type: '横幅广告', name: '', budget: '', start: '', end: '', material: '' });
    setMsg('广告购买申请已提交，等待审核');
    setTab('ads');
  };

  // 处理充值表单输入
  const handleRechargeChange = e => {
    setRechargeForm({ ...rechargeForm, [e.target.name]: e.target.value });
  };

  // 提交充值
  const handleRecharge = e => {
    e.preventDefault();
    const amount = Number(rechargeForm.amount);
    if (!amount || amount <= 0) {
      setRechargeMsg('请输入正确的充值金额');
      return;
    }
    const newRec = {
      id: Date.now(),
      amount,
      method: rechargeForm.method,
      time: new Date().toLocaleString(),
      status: '成功',
    };
    setBalance(balance + amount);
    setRecharges([newRec, ...recharges]);
    setRechargeForm({ amount: '', method: '支付宝' });
    setRechargeMsg('充值成功！');
    setTab('rechargeHistory');
  };

  // 处理广告数据类型筛选
  const handleStatsType = e => {
    setStatsType(e.target.value);
  };

  // 发票表单输入
  const handleInvoiceChange = e => {
    setInvoiceForm({ ...invoiceForm, [e.target.name]: e.target.value });
  };

  // 提交发票申请
  const handleInvoice = e => {
    e.preventDefault();
    if (!invoiceForm.rechargeId || !invoiceForm.title.trim() || !invoiceForm.taxId.trim()) {
      setInvoiceMsg('请填写完整信息');
      return;
    }
    const recharge = recharges.find(r => String(r.id) === invoiceForm.rechargeId);
    if (!recharge) {
      setInvoiceMsg('请选择有效的充值记录');
      return;
    }
    const newInvoice = {
      id: Date.now(),
      rechargeId: invoiceForm.rechargeId,
      title: invoiceForm.title,
      taxId: invoiceForm.taxId,
      amount: recharge.amount,
      time: new Date().toLocaleString(),
      status: '待开票',
    };
    setInvoices([newInvoice, ...invoices]);
    setInvoiceForm({ rechargeId: '', title: '', taxId: '' });
    setInvoiceMsg('发票申请已提交，等待处理');
  };

  // 个人信息表单输入
  const handleProfileChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // 个人信息保存
  const handleProfileSave = e => {
    e.preventDefault();
    if (!profile.nickname.trim() || !profile.email.trim() || !profile.phone.trim()) {
      setProfileMsg('请填写完整信息');
      return;
    }
    setProfileMsg('保存成功！');
    setTimeout(() => setProfileMsg(''), 1500);
  };

  // 素材上传
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

  // 删除素材
  const handleMaterialDelete = id => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  // 过滤后的统计数据
  const filteredStats = statsType === '全部' ? stats : stats.filter(ad => ad.type === statsType);

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
    <div className="page-card">
      <div className="page-banner">广告主中心</div>
      <div className="client-center">
        <aside className="client-sidebar">
          <h3>广告主中心</h3>
          <ul>
            {menu.map(item => (
              <li key={item.key} className={tab===item.key ? 'active' : ''} onClick={()=>setTab(item.key)}>{item.label}</li>
            ))}
          </ul>
        </aside>
        <main className="client-main">
          <div className="balance-bar">账户余额：<span>￥{balance.toFixed(2)}</span></div>
          {tab === 'msg' && (
            <div>
              <h2>消息中心</h2>
              {msgs.length === 0 ? <p>暂无消息。</p> : (
                <ul className="msg-list">
                  {msgs.map((m,i) => (
                    <li key={i} className={m.status==='投放中'||m.status==='已开票'?'msg-ok':'msg-err'}>
                      <div className="msg-title">{m.title}</div>
                      <div className="msg-content">{m.content}</div>
                      <div className="msg-time">{m.time}</div>
                    </li>
                  ))}
                </ul>
              )}
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
          {tab === 'profile' && (
            <div>
              <h2>个人信息</h2>
              <form className="profile-form" onSubmit={handleProfileSave}>
                <label>昵称：
                  <input name="nickname" value={profile.nickname} onChange={handleProfileChange} required />
                </label>
                <label>邮箱：
                  <input name="email" value={profile.email} onChange={handleProfileChange} required />
                </label>
                <label>手机号：
                  <input name="phone" value={profile.phone} onChange={handleProfileChange} required />
                </label>
                <button type="submit">保存</button>
                {profileMsg && <div className="form-msg">{profileMsg}</div>}
              </form>
            </div>
          )}
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
                      <tr key={ad.id}>
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
          {tab === 'recharge' && (
            <div>
              <h2>充值</h2>
              <form className="recharge-form" onSubmit={handleRecharge}>
                <label>充值金额（元）：
                  <input name="amount" type="number" min="1" value={rechargeForm.amount} onChange={handleRechargeChange} required />
                </label>
                <label>支付方式：
                  <select name="method" value={rechargeForm.method} onChange={handleRechargeChange}>
                    <option>支付宝</option>
                    <option>微信支付</option>
                    <option>银行卡</option>
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
                      <tr key={rec.id}>
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
                      <th>广告名称</th><th>类型</th><th>曝光量</th><th>点击量</th><th>点击率</th><th>消耗（元）</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStats.map(ad => (
                      <tr key={ad.id}>
                        <td>{ad.name}</td>
                        <td>{ad.type}</td>
                        <td>{ad.impressions}</td>
                        <td>{ad.clicks}</td>
                        <td>{ad.ctr}%</td>
                        <td>￥{ad.cost}</td>
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
                      <option value={rec.id} key={rec.id}>￥{rec.amount} - {rec.time}</option>
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
                      <tr key={inv.id}>
                        <td>{inv.time}</td>
                        <td>{inv.title}</td>
                        <td>{inv.taxId}</td>
                        <td>￥{inv.amount}</td>
                        <td>{(() => {
                          const rec = recharges.find(r => String(r.id) === inv.rechargeId);
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
                  <div className="faq-a">A: 一般1个工作日内完成审核，审核结果会在"消息中心"通知。</div>
                </div>
                <div className="faq-item">
                  <div className="faq-q">Q: 如何充值和开具发票？</div>
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
      </div>
    </div>
  );
}

export default ClientCenter; 