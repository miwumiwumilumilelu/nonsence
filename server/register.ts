import cloud from "@lafjs/cloud";
import { createHash } from "crypto";

const db = cloud.database();

interface RegisterBody {
  username: string;
  password: string;
}

interface FunctionContext {
  body: RegisterBody;
  headers: Record<string, string>;
}

export async function main(ctx: FunctionContext) {
  const { username, password } = ctx.body;
  if (!username || !password) {
    return { error: "用户名或密码不能为空" };
  }
  const { data: user } = await db.collection("users").where({ username }).getOne();
  if (user) {
    if (user.status === 0) {
      return { error: "账号正在审核中，请等待管理员审核！" };
    }
    if (user.status === 2) {
      return { error: (user.rejectMsg || "账号已被拒绝注册") + "，请修改后重新注册" };
    }
    return { error: "该用户名已被注册，请直接登录！" };
  }
  const passwordHash = createHash("sha256").update(password).digest("hex");
  const now = new Date().toISOString();
  const newUser = {
    username,
    password: passwordHash,
    createdAt: now,
    lastIp: ctx.headers['x-real-ip'] || '',
    lock: 0,
    balance: 0,
    status: 0 // 0=待审核，1=已通过
  };
  const { insertedId } = await db.collection("users").add(newUser);
  return {
    ok: true,
    msg: '注册成功，等待管理员审核！',
    data: { ...newUser, _id: insertedId }
  };
} 