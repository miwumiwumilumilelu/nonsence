import cloud from "@lafjs/cloud";

const db = cloud.database();

interface QueryBody {
  type?: number; // 1=社区，2=联系我们
  status?: number; // 0=待审核，1=已通过
  page?: number;
  pageSize?: number;
}

interface FunctionContext {
  body: QueryBody;
}

export async function main(ctx: FunctionContext) {
  const { type, status, page = 1, pageSize = 20 } = ctx.body || {};
  const where: any = {};
  if (typeof type === 'number') where.type = type;
  if (typeof status === 'number') where.status = status;
  const skip = (page - 1) * pageSize;
  const query = db.collection('messages').where(where).orderBy('created', 'desc');
  const total = await db.collection('messages').where(where).count();
  const result = await query.skip(skip).limit(pageSize).get();
  const data = Array.isArray(result.data) ? result.data : [];
  return {
    ok: true,
    data,
    total: total.total,
    page,
    pageSize
  };
}
