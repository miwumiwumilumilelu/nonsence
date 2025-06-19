import cloud from "@lafjs/cloud";

const db = cloud.database();

interface AuditBody {
  _id: string;
  status: 1 | 2; // 1=通过, 2=删除
}

interface FunctionContext {
  body: AuditBody;
}

export async function main(ctx: FunctionContext) {
  const { _id, status } = ctx.body;
  if (!_id || (status !== 1 && status !== 2)) {
    return { error: '参数错误' };
  }
  const { updated } = await db.collection('messages').where({ _id }).update({ status });
  if (updated === 1) {
    return { ok: true, msg: '操作成功' };
  } else {
    return { error: '操作失败或记录不存在' };
  }
} 