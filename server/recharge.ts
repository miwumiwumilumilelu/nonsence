import cloud from "@lafjs/cloud";

const db = cloud.database();

interface RechargeBody {
  userId: string;
  amount: number;
  method: '微信支付';
}

interface FunctionContext {
  body: RechargeBody;
  headers: Record<string, string>;
}

export async function main(ctx: FunctionContext) {
  const { userId, amount, method } = ctx.body;
  if (!userId || !amount || amount <= 0 || method !== '微信支付') {
    return { error: '参数错误' };
  }
  // 写入充值记录
  const recharge = {
    userId,
    amount,
    method,
    time: new Date().toISOString(),
    status: '成功',
  };
  await db.collection('recharges').add(recharge);
  // 更新用户余额
  const user = await db.collection('users').where({ _id: userId }).getOne();
  if (!user.data) return { error: '用户不存在' };
  const newBalance = (user.data.balance || 0) + amount;
  await db.collection('users').where({ _id: userId }).update({ balance: newBalance });
  return { ok: true, msg: '充值成功', balance: newBalance };
} 