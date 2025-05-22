import cloud from "@lafjs/cloud";

const db = cloud.database();

interface RechargeHistoryBody {
  userId: string;
}

interface FunctionContext {
  body: RechargeHistoryBody;
}

export async function main(ctx: FunctionContext) {
  const { userId } = ctx.body;
  if (!userId) return { error: '参数错误' };
  const { data } = await db.collection('recharges').where({ userId }).orderBy('time', 'desc').get();
  return { ok: true, data };
} 