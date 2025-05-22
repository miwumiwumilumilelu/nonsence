import cloud from "@lafjs/cloud";

const db = cloud.database();

export async function main(ctx: any) {
  const userCount = await db.collection('users').count();
  const adCount = await db.collection('ads').count();
  const rechargeSum = await db.collection('recharge').aggregate().group({ _id: null, total: { $sum: '$amount' } }).end();
  const adSum = await db.collection('ads').aggregate().group({ _id: null, total: { $sum: '$budget' } }).end();
  return {
    ok: true,
    data: {
      userCount: userCount.total,
      adCount: adCount.total,
      totalRecharge: rechargeSum.list[0]?.total || 0,
      totalAdSpend: adSum.list[0]?.total || 0,
    }
  };
} 