import { promisifyAll } from 'bluebird';
import { createClient, Change } from 'ldapjs';
import { ldapConfig } from '../config';
import logger from './log';
let client = promisifyAll(createClient(ldapConfig));
let userClient = promisifyAll(createClient(ldapConfig));

(async function() {
  await client.bindAsync(ldapConfig.cn, ldapConfig.secret, []);
})();

function promisifyEventCommiter(res) {
  return new Promise((resolve, reject) => {
    let objects = [];
    res.on('searchEntry', (entry) => {
      objects.push(entry);
    });
    res.on('error', (err) => {
      reject(err);
    });
    res.on('end', (result) => {
      resolve(objects);
    });
  });
}

async function search(uid) {
  let opts = {
    filter: `(&(uid=${uid})(objectclass=inetOrgPerson))`,
    scope: 'one',
    attributes: ['cn', 'sn', 'uid']
  };
  let res = await client.searchAsync(ldapConfig.userBase, opts, []);
  return promisifyEventCommiter(res);
};

async function list() {
  let opts = {
    filter: '(objectclass=inetOrgPerson)',
    scope: 'one',
    attributes: ['cn', 'sn', 'uid']
  };
  let res = await client.searchAsync(ldapConfig.userBase, opts, []);
  return promisifyEventCommiter(res);
}

async function addUser({ cn, sn, uid, password }) {
  let entry = {
    cn: cn,
    sn: sn,
    uid: uid,
    userPassword: password,
    objectClass: 'inetOrgPerson'
  };
  await client.addAsync(`uid=${uid},${ldapConfig.userBase}`, entry);
}

async function remove(uid) {
  await client.delAsync(`uid=${uid},${ldapConfig.userBase}`);
}

async function update({ uid, cn, sn }) {
  let changes = [];
  if (cn) {
    let change = new Change({
      operation: 'replace',
      modification: {
        cn: cn,
      }
    });
    changes.push(change);
  }
  if (sn) {
    let change = new Change({
      operation: 'replace',
      modification: {
        sn: sn,
      }
    });
    changes.push(change);
  }
  await client.modifyAsync(`uid=${uid},${ldapConfig.userBase}`, changes);
}

async function auth(uid, password) {
  await userClient.bindAsync(`uid=${uid},${ldapConfig.userBase}`, password, []);
}

async function getGroupOfUser(uid) {
  let opts = {
    filter: `(&(uniqueMember=uid=${uid},${ldapConfig.userBase})(objectclass=groupOfUniqueNames))`,
    scope: 'one',
    attributes: ['cn']
  };
  let res = await client.searchAsync(ldapConfig.groupBase, opts, []);
  return promisifyEventCommiter(res);
}

async function getGroupInfo(cn) {
  let opts = {
    filter: `(&(cn=${cn})(objectclass=groupOfUniqueNames))`,
    scope: 'one',
  };
  let res = await client.searchAsync(ldapConfig.groupBase, opts, []);
  return promisifyEventCommiter(res);
}

async function getGroups() {
  return getGroupInfo('*');
}

async function addGroup({ cn, uid }) {
  let entry = {
    cn: cn,
    objectClass: 'groupOfUniqueNames',
    uniqueMember: `uid=${uid},${ldapConfig.userBase}`
  };
  await client.addAsync(`cn=${cn},${ldapConfig.groupBase}`, entry);
}

export {
  search,
  list,
  addUser,
  remove,
  update,
  auth,
  getGroupOfUser,
  getGroupInfo,
  getGroups,
  addGroup
};
