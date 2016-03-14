import * as client from '../lib/ldap';
import logger from '../lib/log';
async function show(ctx) {
  let uid = ctx.params.uid;
  let result = await client.search(uid);
  if (result.length === 0) {
    ctx.status = 404;
    ctx.body = { };
  } else {
    let entry = result[0].object;
    let groups = [];
    for (let group of await client.getGroupOfUser(uid)) {
      groups.push(group.object.cn);
    }
    ctx.body = {
      name: entry.cn,
      uid: entry.uid,
      groups: groups
    }
  }
}

async function list(ctx) {
  let result = []
  for (let entry of await client.list()) {
    let object = entry.object;
    let groups = [];
    for (let group of await client.getGroupOfUser(object.uid)) {
      groups.push(group.object.cn);
    }
    result.push({
      name: object.cn,
      uid: object.uid,
      groups: groups
    });
  }
  ctx.body = result;
}

async function add(ctx) {
  let body = ctx.request.body,
    name = body.name,
    uid = body.uid,
    password = body.password;
  if (name && uid && password && uid.match(/[^0-9a-zA-Z]/) === null) {
    try {
      await client.addUser({
        cn: name,
        sn: name,
        uid: uid,
        password: password
      });
      ctx.redirect(`/u/${uid}`);
    } catch (err) {
      ctx.status = 403;
      ctx.body = { error: err };
    }
  } else {
    ctx.status = 403;
  }
}

async function remove(ctx) {
  let uid = ctx.params.uid;
  try {
    await client.remove(uid);
    ctx.body = { };
  } catch (err) {
    ctx.status = 403;
    ctx.body = { error: err };
  }
}

async function update(ctx) {
  let uid = ctx.params.uid;
  let body = ctx.request.body,
    name = body.name;
  if (name) {
    await client.update({
      uid: uid,
      cn: name,
    });
  } else {
    ctx.status = 304;
  }
  ctx.redirect(`/u/${uid}`);
}

async function auth(ctx) {
  let body = ctx.request.body,
    username = body.uid,
    password = body.password;
  try {
    await client.auth(username, password);
    ctx.session.uid = username;
    ctx.body = { };
  } catch (err) {
    ctx.status = 403;
    ctx.body = { error: err };
  }
}

async function requireLogin(ctx, next) {
  if (ctx.session.uid) {
    await next();
  } else {
    ctx.status = 403;
  }
}

async function requireOwnership(ctx, next) {
  if (ctx.session.uid && ctx.session.uid === ctx.params.uid) {
    await next();
  } else  {
    ctx.status = 403;
  }
}

async function logout(ctx) {
  ctx.session = null;
  ctx.body = { };
}

function requireGroup(group) {
  return async function(ctx, next) {
    if (ctx.session.uid) {
      let found = false;
      for (let entry of await client.getGroupOfUser(ctx.session.uid)) {
        if (entry.object.cn === group) {
          found = true;
          break;
        }
      }
      if (found) {
        await next();
      } else {
        ctx.status = 403;
      }
    } else {
      ctx.status = 403;
    }
  }
}

export {
  show,
  list,
  add,
  remove,
  update,
  auth,
  requireLogin,
  requireOwnership,
  requireGroup,
  logout
};
