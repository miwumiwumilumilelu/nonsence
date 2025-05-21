import React, { useState, useEffect, useRef } from 'react';
import './ClientCenter.css';
import './App.css'; // 确保样式可用

const menu = [
  { key: 'adReview', label: '广告审核' },
  { key: 'invoiceReview', label: '发票审核' },
  { key: 'user', label: '用户管理' },
  { key: 'stats', label: '平台数据' },
];

const AD_STORAGE_KEY = 'nonsence_ads';
const INVOICE_STORAGE_KEY = 'nonsence_invoices';
const RECHARGE_STORAGE_KEY = 'nonsence_recharges';
const PROFILE_STORAGE_KEY = 'nonsence_profile';
const USERLIST_STORAGE_KEY = 'nonsence_userlist';

function AdminCenter() {
  const [tab, setTab] = useState('adReview');
  const [ads, setAds] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [recharges, setRecharges] = useState([]);
  const [userList, setUserList] = useState([]);
  const chartRef = useRef(null);

  // 加载本地数据
  useEffect(() => {
    const saved = localStorage.getItem(AD_STORAGE_KEY);
    if (saved) setAds(JSON.parse(saved));
    const invs = localStorage.getItem(INVOICE_STORAGE_KEY);
    if (invs) setInvoices(JSON.parse(invs));
    const recs = localStorage.getItem(RECHARGE_STORAGE_KEY);
    if (recs) setRecharges(JSON.parse(recs));
    let users = localStorage.getItem(USERLIST_STORAGE_KEY);
    if (users) {
      setUserList(JSON.parse(users));
    } else {
      const prof = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (prof) {
        setUserList([{ ...JSON.parse(prof), id: 1, enabled: true }]);
        localStorage.setItem(USERLIST_STORAGE_KEY, JSON.stringify([{ ...JSON.parse(prof), id: 1, enabled: true }]));
      }
    }
  }, []);

  // 保存广告和发票数据
  useEffect(() => {
    localStorage.setItem(AD_STORAGE_KEY, JSON.stringify(ads));
  }, [ads]);
  useEffect(() => {
    localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(invoices));
  }, [invoices]);
  useEffect(() => {
    localStorage.setItem(USERLIST_STORAGE_KEY, JSON.stringify(userList));
  }, [userList]);

  // 广告审核操作
  const handleReview = (id, status) => {
    setAds(ads.map(ad => ad.id === id ? { ...ad, status } : ad));
  };

  // 发票审核操作
  const handleInvoiceReview = (id, status) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status } : inv));
  };

  // 用户禁用/启用
  const handleUserEnable = (id, enabled) => {
    setUserList(userList.map(u => u.id === id ? { ...u, enabled } : u));
  };

  // 平台数据统计
  const totalAds = ads.length;
  const totalRecharge = recharges.reduce((sum, r) => sum + Number(r.amount), 0);
  const totalUsers = userList.length;
  const totalInvoices = invoices.length;
  const adStatusCount = ['待审核','投放中','已驳回'].map(status => ads.filter(ad=>ad.status===status).length);

  // 简单饼图渲染
  useEffect(() => {
    if (tab !== 'stats' || !chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');
    ctx.clearRect(0,0,300,300);
    const data = adStatusCount;
    const colors = ['#1976d2','#43a047','#e57373'];
    const total = data.reduce((a,b)=>a+b,0) || 1;
    let start = 0;
    data.forEach((v,i) => {
      const angle = (v/total)*Math.PI*2;
      ctx.beginPath();
      ctx.moveTo(150,150);
      ctx.arc(150,150,90,start,start+angle);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();
      start += angle;
    });
    // 图例
    ctx.fillStyle = '#1976d2'; ctx.fillRect(20,250,16,16); ctx.fillStyle='#333'; ctx.fillText('待审核',40,263);
    ctx.fillStyle = '#43a047'; ctx.fillRect(100,250,16,16); ctx.fillStyle='#333'; ctx.fillText('投放中',120,263);
    ctx.fillStyle = '#e57373'; ctx.fillRect(200,250,16,16); ctx.fillStyle='#333'; ctx.fillText('已驳回',220,263);
  }, [tab, adStatusCount]);

  return (
    <div className="page-card">
      <div className="page-banner">管理员中心</div>
      <div className="page-section-title">广告审核</div>
      <div className="client-center">
        <aside className="client-sidebar">
          <h3>管理员中心</h3>
          <ul>
            {menu.map(item => (
              <li key={item.key} className={tab===item.key ? 'active' : ''} onClick={()=>setTab(item.key)}>{item.label}</li>
            ))}
          </ul>
        </aside>
        <main className="client-main">
          {tab === 'adReview' && (
            <div>
              <h2>广告审核</h2>
              {ads.filter(ad => ad.status === '待审核').length === 0 ? <p>暂无待审核广告。</p> : (
                <table className="ads-table">
                  <thead>
                    <tr><th>广告名称</th><th>类型</th><th>预算</th><th>投放时间</th><th>素材</th><th>提交时间</th><th>操作</th></tr>
                  </thead>
                  <tbody>
                    {ads.filter(ad => ad.status === '待审核').map(ad => (
                      <tr key={ad.id}>
                        <td>{ad.name}</td>
                        <td>{ad.type}</td>
                        <td>￥{ad.budget}</td>
                        <td>{ad.start} ~ {ad.end}</td>
                        <td style={{maxWidth:120,wordBreak:'break-all'}}>{ad.material}</td>
                        <td>{ad.created}</td>
                        <td>
                          <button style={{background:'#43a047',color:'#fff',marginRight:8}} onClick={()=>handleReview(ad.id,'投放中')}>通过</button>
                          <button style={{background:'#e57373',color:'#fff'}} onClick={()=>handleReview(ad.id,'已驳回')}>驳回</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <h3 style={{marginTop:32}}>已审核广告</h3>
              {ads.filter(ad => ad.status !== '待审核').length === 0 ? <p>暂无已审核广告。</p> : (
                <table className="ads-table">
                  <thead>
                    <tr><th>广告名称</th><th>类型</th><th>预算</th><th>投放时间</th><th>素材</th><th>提交时间</th><th>状态</th></tr>
                  </thead>
                  <tbody>
                    {ads.filter(ad => ad.status !== '待审核').map(ad => (
                      <tr key={ad.id}>
                        <td>{ad.name}</td>
                        <td>{ad.type}</td>
                        <td>￥{ad.budget}</td>
                        <td>{ad.start} ~ {ad.end}</td>
                        <td style={{maxWidth:120,wordBreak:'break-all'}}>{ad.material}</td>
                        <td>{ad.created}</td>
                        <td>{ad.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {tab === 'invoiceReview' && (
            <div>
              <h2>发票审核</h2>
              {invoices.filter(inv => inv.status === '待开票').length === 0 ? <p>暂无待开票申请。</p> : (
                <table className="ads-table">
                  <thead>
                    <tr><th>申请时间</th><th>发票抬头</th><th>税号</th><th>金额</th><th>关联充值</th><th>操作</th></tr>
                  </thead>
                  <tbody>
                    {invoices.filter(inv => inv.status === '待开票').map(inv => (
                      <tr key={inv.id}>
                        <td>{inv.time}</td>
                        <td>{inv.title}</td>
                        <td>{inv.taxId}</td>
                        <td>￥{inv.amount}</td>
                        <td>{(() => {
                          const rec = recharges.find(r => String(r.id) === inv.rechargeId);
                          return rec ? `￥${rec.amount} - ${rec.time}` : '已删除';
                        })()}</td>
                        <td>
                          <button style={{background:'#43a047',color:'#fff',marginRight:8}} onClick={()=>handleInvoiceReview(inv.id,'已开票')}>开票</button>
                          <button style={{background:'#e57373',color:'#fff'}} onClick={()=>handleInvoiceReview(inv.id,'已驳回')}>驳回</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <h3 style={{marginTop:32}}>已处理申请</h3>
              {invoices.filter(inv => inv.status !== '待开票').length === 0 ? <p>暂无已处理申请。</p> : (
                <table className="ads-table">
                  <thead>
                    <tr><th>申请时间</th><th>发票抬头</th><th>税号</th><th>金额</th><th>关联充值</th><th>状态</th></tr>
                  </thead>
                  <tbody>
                    {invoices.filter(inv => inv.status !== '待开票').map(inv => (
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
          {tab === 'user' && (
            <div>
              <h2>用户管理</h2>
              {userList.length === 0 ? <p>暂无广告主。</p> : (
                <table className="ads-table">
                  <thead>
                    <tr><th>昵称</th><th>邮箱</th><th>手机号</th><th>状态</th><th>操作</th></tr>
                  </thead>
                  <tbody>
                    {userList.map(u => (
                      <tr key={u.id}>
                        <td>{u.nickname}</td>
                        <td>{u.email}</td>
                        <td>{u.phone}</td>
                        <td>{u.enabled ? '正常' : '已禁用'}</td>
                        <td>
                          {u.enabled ? (
                            <button style={{background:'#e57373',color:'#fff'}} onClick={()=>handleUserEnable(u.id,false)}>禁用</button>
                          ) : (
                            <button style={{background:'#43a047',color:'#fff'}} onClick={()=>handleUserEnable(u.id,true)}>启用</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {tab === 'stats' && (
            <div>
              <h2>平台数据</h2>
              <div className="platform-stats">
                <div className="stat-card">广告总数<br /><span>{totalAds}</span></div>
                <div className="stat-card">充值总额<br /><span>￥{totalRecharge.toFixed(2)}</span></div>
                <div className="stat-card">广告主数<br /><span>{totalUsers}</span></div>
                <div className="stat-card">发票总数<br /><span>{totalInvoices}</span></div>
              </div>
              <div style={{marginTop:32}}>
                <h3>广告状态分布</h3>
                <canvas ref={chartRef} width={300} height={280} style={{background:'#f4f6fa',borderRadius:8}} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminCenter; 