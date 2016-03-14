import * as client from '../lib/ldap';
async function show(ctx) {
  let cn = ctx.params.gid;
  let result = await client.getGroupInfo(cn);
  if (result.length === 0) {
    ctx.status = 404;
    ctx.body = { };
  } else {
    let entry = result[0].object;
    ctx.body = entry;
  }
}

async function list(ctx) {
  let result = [];
  for (let entry of await client.getGroups()) {
    result.push(entry.object);
  }
  ctx.body = result;
}

async function add(ctx) {
  let body = ctx.request.body,
    gid = body.gid,
    uid = body.uid;
  try {
    await client.addGroup({ cn: gid, uid });
    ctx.redirect(`/g/${gid}`);
  } catch (err) {
    ctx.status = 403;
    ctx.body = { error: err };
  }
}

export {
  show,
  list,
  add
};
