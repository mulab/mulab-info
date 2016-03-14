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

export {
  show
};
