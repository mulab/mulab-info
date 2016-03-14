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

export {
  show,
  list
};
