import { db } from "@/app/lib/db";
import { hash } from "bcryptjs";
import { cfg } from "@/app/config/config";

async function handler(req: Request) {
    const { email } = await req.json();
    console.log(`EMAIL:${email}`);
    if (!email) {
      return Response.json({ error: "Invalid parameters" }, { status: 400 });
    }
    const find_user: any = await db.user.findUnique({
      where: {
        email: email,
      },
      select: {
        name: true,
      },
    });

    if (!find_user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    } else {
      const newToken = await hash(
        `${find_user.name + Math.random() * 100}`,
        10
      );
      const expire = new Date();
      const expDur = cfg.expire_dur;
      expire.setMinutes(expire.getMinutes() + expDur);
      const upd_token = await db.user.update({
        where: {
          email: email,
        },
        data: {
          token: newToken,
          expirationTime: expire,
        },
      });
      
      if (upd_token) {
        return Response.json({ message: "token reset" }, { status: 200 });
      }
      return Response.json(
        { message: "something went wrong" },
        { status: 404 }
      );
    }
  }

export { handler as POST, handler as GET };
