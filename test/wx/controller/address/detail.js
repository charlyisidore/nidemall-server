const test = require('ava');
const { request, createUser, destroyUser } = require('../../../helpers/app.js');

const REQUEST = {
  method: 'get',
  url: '/wx/address/detail',
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

// Hard-delete the addresses from the database
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
  t.like(response.body.data, {
    ...DATA,
    id: t.context.id,
  });
});

test.serial('not logged in', async (t) => {
  const response = await request({
    ...REQUEST,
    data: { id: t.context.id },
  });

  t.is(response.body.errno, 501);
});

test.serial('missing id', async (t) => {
  const response = await request({
    ...REQUEST,
    token: t.context.token,
    data: {},
  });

  t.is(response.body.errno, 402);
});

test.serial('not found', async (t) => {
  const response = await request({
    ...REQUEST,
    token: t.context.token,
    data: { id: 99999999 },
  });

  t.is(response.body.errno, 402);
});

test.serial('stolen id', async (t) => {
  const response = await request({
    ...REQUEST,
    token: t.context.token,
    data: { id: t.context.stolenId },
  });

  t.is(response.body.errno, 402);
});
