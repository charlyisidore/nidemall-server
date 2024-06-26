const test = require('ava');
const { request, createUser, destroyUser } = require('../../helpers/app.js');
const { createAddress, destroyAddress } = require('../helpers/address.js');
const { validateResponse } = require('../../helpers/openapi.js');

const REQUEST = {
  method: 'post',
  path: '/wx/address/delete',
};

// Check if an address exists and is soft deleted
async function softDeleted(id) {
  const address = await think.model('address')
    .where({ id })
    .find();
  return !think.isEmpty(address) && address.deleted;
}

// Check if an address exists and is not soft deleted
async function notDeleted(id) {
  const address = await think.model('address')
    .where({ id })
    .find();
  return !think.isEmpty(address) && !address.deleted;
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
  t.context.address = await createAddress({ userId: t.context.userId });
  t.context.other = await createAddress({ userId: 99999999 });
});

// Hard-delete the addresses from the database
test.afterEach(async (t) => {
  await destroyAddress(t.context.address.id);
  await destroyAddress(t.context.other.id);
});

test('success', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    token: t.context.token,
    data: { id: t.context.address.id },
  });

  t.is(response.errno, 0);
  t.assert(softDeleted(t.context.address.id));
  t.assert(notDeleted(t.context.other.id));

  await validateResponse(REQUEST, response, t);
});

test('not logged in', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    data: { id: t.context.address.id },
  });

  t.is(response.errno, 501);
  t.assert(notDeleted(t.context.address.id));
  t.assert(notDeleted(t.context.other.id));
});

test('missing id', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    token: t.context.token,
    data: {},
  });

  t.is(response.errno, 402);
  t.assert(notDeleted(t.context.address.id));
  t.assert(notDeleted(t.context.other.id));
});

test('not found', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    token: t.context.token,
    data: { id: 99999999 },
  });

  t.is(response.errno, 402);
  t.assert(notDeleted(t.context.address.id));
  t.assert(notDeleted(t.context.other.id));
});

test('not owned', async (t) => {
  const response = await request(t, {
    ...REQUEST,
    token: t.context.token,
    data: { id: t.context.other.id },
  });

  t.is(response.errno, 402);
  t.assert(notDeleted(t.context.address.id));
  t.assert(notDeleted(t.context.other.id));
});
