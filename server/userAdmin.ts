import cloud from "@lafjs/cloud";

const db = cloud.database();

export async function main(ctx) {
  const { action, userId } = ctx.body || {};
  if (action === 'getUsers') {
    const { data } = await db.collection('users').orderBy('createdAt', 'desc').get();
    return { ok: true, data };
  }
  if (action === 'deleteUser') {
    if (!userId) return { ok: false, error: '参数错误' };
    await db.collection('users').where({ _id: userId }).remove();
    await db.collection('ads').where({ userId }).remove();
    await db.collection('recharge').where({ userId }).remove();
    return { ok: true };
  }
  return { ok: false, error: '未知操作' };
} 