const host = process.env['LDAP_HOST'] || '127.0.0.1';
const tls = process.env['LDAP_TLS'] || false;
const cn = process.env['LDAP_ADMIN'] || 'cn=root';
const secret = process.env['LDAP_SECRET'] || 'password';
const url = (tls ? 'ldaps://' : 'ldap://') + host;
const base = process.env['LDAP_BASE'] || 'dc=example,dc=com';
const userBase = process.env['LDAP_USER_BASER'] || `ou=people,${base}`;
const groupBase = process.env['LDAP_GROUP_BASER'] || `ou=group,${base}`;
const adminGroup = process.env['LDAP_ADMIN_GROUP'] || 'owner';
const ldapConfig = {
  url: url,
  cn: cn,
  secret: secret,
  base: base,
  userBase: userBase,
  groupBase: groupBase,
  adminGroup: adminGroup
};
const nodeEnv = process.env['NODE_ENV'] || 'development';

export {
  ldapConfig,
  nodeEnv
};
