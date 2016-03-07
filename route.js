import router from 'koa-router';
import * as user from './routes/user';
import logger from './lib/log';
import { ldapConfig } from './config';
import * as util from './lib/util';


async function validateUid(ctx, next) {
  let uid = ctx.params.uid;
  if (uid && uid.match(/[^0-9a-zA-Z]/) === null) {
    await next();
  } else {
    ctx.status = 403;
  }
}

let route = router();
let requireOwnerGroup = user.requireGroup(ldapConfig.adminGroup);
let requireOwner = util.authorizeOr(user.requireOwnership, requireOwnerGroup);
route.post('/auth', user.auth);
route.post('/logout', user.requireLogin, user.logout);
route.get('/u/:uid', user.requireLogin, validateUid, user.show);
route.post('/u/:uid', requireOwner, validateUid, user.update);
route.get('/u/:uid/del', requireOwner, validateUid, user.remove);
route.get('/u', user.requireLogin, user.list);
route.post('/u', requireOwnerGroup, user.add);

export { route };
