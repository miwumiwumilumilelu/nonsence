import React from 'react';
import './ApiDoc.css';
import './App.css';

function ApiDoc() {
  return (
    <div className="page-card">
      <div className="page-section-title">API文档</div>
      <section>
        <h3>1. 获取广告</h3>
        <pre>{`
GET /api/ads?type={type}&count={count}
返回示例：
[
  {
    "id": 123,
    "type": "横幅广告",
    "image": "https://cdn.example.com/ad1.jpg",
    "link": "https://ad.example.com/landing",
    "title": "品牌推广",
    "desc": "高效投放，精准触达"
  }
]
        `}</pre>
      </section>
      <section>
        <h3>2. 上报广告曝光</h3>
        <pre>{`
POST /api/ads/expose
Body: { "adId": 123, "userId": "abc" }
返回: { "success": true }
        `}</pre>
      </section>
      <section>
        <h3>3. 上报广告点击</h3>
        <pre>{`
POST /api/ads/click
Body: { "adId": 123, "userId": "abc" }
返回: { "success": true }
        `}</pre>
      </section>
      <section>
        <h3>4. 查询广告数据</h3>
        <pre>{`
GET /api/ads/stats?adId=123
返回示例：
{
  "impressions": 12345,
  "clicks": 234,
  "ctr": "1.89%",
  "cost": 120.00
}
        `}</pre>
      </section>
      <section>
        <h3>5. 其它说明</h3>
        <ul>
          <li>所有接口均为RESTful风格，返回JSON格式。</li>
          <li>如需API KEY或鉴权，请联系平台管理员。</li>
        </ul>
      </section>
    </div>
  );
}

export default ApiDoc; 