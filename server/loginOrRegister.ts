import cloud from "@lafjs/cloud";
import { createHash } from "crypto";

const db = cloud.database();

interface LoginBody {
  username: string;
  password: string;
}

interface FunctionContext {
  body: LoginBody;
  headers: Record<string, string>;
}

export async function main(ctx: FunctionContext) {
  const { username, password } = ctx.body;
  if (!username || !password) {
    return { error: "用户名或密码不能为空" };
  }
  const passwordHash = createHash("sha256").update(password).digest("hex");
  const { data: user } = await db.collection("users").where({ username }).getOne();
  if (!user) return { error: "账号未注册，请先注册！" };
  if (user.lock === 1) return { error: '用户已被锁定，请联系管理员！' };
  if (user.password !== passwordHash) return { error: "用户名或密码错误" };
  await db.collection('users').where({ _id: user._id }).update({
    lastIp: ctx.headers['x-real-ip'] || ''
  });
  if (typeof user.balance !== 'number') user.balance = 0;
  return {
    ok: true,
    msg: '登录成功！',
    data: user
  };
} 