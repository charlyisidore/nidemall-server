const test = require('ava');
const { request, createUser, destroyUser } = require('../../../helpers/app.js');

const REQUEST = {
  method: 'post',
  url: '/wx/address/delete',
};

const DATA = {
  name: 'my name',
  tel: '13945678911',
  province: 'my province',
  city: 'my city',
  county: 'my county',
  areaCode: '123456',
  addressDetail: 'my address detail',
  isDefault: false,
};

// Create an address
function createAddress(userId) {
  return think.model('address')
    .add({
      ...DATA,
      userId,
    });
}

// Delete an address
function destroyAddress(id) {
  return think.model('address')
    .where({ id })
    .delete();
}

// Check if the address exists and is not soft deleted
async function notDeleted(id) {
  const address = await think.model('address')
    .where({ id })
    .find();
  return !think.isEmpty(address) && !address.deleted;
}

// Check if the address exists and is soft deleted
async function softDeleted(id) {
  const address = await think.model('address')
    .where({ id })
    .find();
  return true === address?.deleted;
}

// Create a user
test.before(async (t) => {
  const { token, id } = await createUser();
  t.context.token = token;
  t.context.userId = id;
});

// Delete the user
test.after.always(async (t) => {
  await destroyUser(t.context.userId);
});

// Create the addresses
test.beforeEach(async (t) => {
  t.context.id = await createAddress(t.context.userId);
  t.context.stolenId = await createAddress(99999999);
});

// Hard-delete the address from the database
test.afterEach(async (t) => {
  await destroyAddress(t.context.id);
  await destroyAddress(t.context.stolenId);
  t.context.id = null;
  t.context.stolenId = null;
});

test.serial('success', async (t) => {
  const response = await request({
    ...REQUEST,
    token: t.context.token,
    data: { id: t.context.id },
  });

  t.is(response.body.errno, 0);
  t.assert(softDeleted(t.context.id));
});

test.serial('not logged in', async (t) => {
  const response = await request({
    ...REQUEST,
    data: { id: t.context.id },
  });

  t.is(response.body.errno, 501);
  t.assert(notDeleted(t.context.id));
});

test.serial('missing id', async (t) => {
  const response = await request({
    ...REQUEST,
    token: t.context.token,
    data: {},
  });

  t.is(response.body.errno, 402);
  t.assert(notDeleted(t.context.id));
});

test.serial('not found', async (t) => {
  const response = await request({
    ...REQUEST,
    token: t.context.token,
    data: { id: 99999999 },
  });

  t.is(response.body.errno, 402);
  t.assert(notDeleted(t.context.id));
});

test.serial('stolen id', async (t) => {
  const response = await request({
    ...REQUEST,
    token: t.context.token,
    data: { id: t.context.stolenId },
  });

  t.is(response.body.errno, 402);
  t.assert(notDeleted(t.context.id));
});
