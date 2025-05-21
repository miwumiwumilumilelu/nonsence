import React from 'react';
import './Cases.css';
import './App.css';

const cases = [
  {
    img: '/case1.jpg',
    title: '品牌A新品发布',
    desc: '通过nonsence平台精准投放，品牌A新品上市首月销量提升200%。',
  },
  {
    img: '/case2.jpg',
    title: '电商B双11大促',
    desc: '整合多渠道广告资源，助力电商B活动曝光量突破5000万。',
  },
  {
    img: '/case3.jpg',
    title: 'App C用户增长',
    desc: '智能优化广告投放，App C日活跃用户增长150%。',
  },
];

function Cases() {
  return (
    <div className="page-card">
      <div className="page-section-title">广告案例</div>
      <div className="cases-list">
        {cases.map((item, i) => (
          <div className="case-card" key={i}>
            <img src={item.img} alt={item.title} className="case-img" />
            <div className="case-info">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cases; 