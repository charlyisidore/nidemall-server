const test = require('ava');
const { request, createUser, destroyUser } = require('../../helpers/app.js');
const { createAddress, destroyAddress } = require('../helpers/address.js');
const { validateResponse } = require('../../helpers/openapi.js');

const REQUEST = {
  method: 'get',
  path: '/wx/address/list',
};

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
  t.context.addressList = await Promise.all(
    Array.from(
      { length: 11 },
      () => createAddress({ userId: t.context.userId })
    )
  );
});

// Hard-delete the addresses from the database
test.afterEach(async (t) => {
  await Promise.all(
    t.context.addressList
      .map((address) => destroyAddress(address.id))
  );
});

test.serial('success', async (t) => {
  const list = t.context.addressList;

  const response = await request(t, {
    ...REQUEST,
    token: t.context.token,
  });

  t.is(response.errno, 0);
  t.deepEqual(response.data, {
    total: list.length,
    pages: 1,
    limit: list.length,
    page: 1,
    list,
  });

  await t.notThrowsAsync(() => validateResponse(REQUEST, response));
});

test('not logged in', async (t) => {
  const response = await request(t, {
    ...REQUEST,
  });

  t.is(response.errno, 501);
});
