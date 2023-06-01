const test = require('ava');
const { request, createUser, destroyUser } = require('../../helpers/app.js');
const { createAddress, destroyAddress } = require('../helpers/address.js');

const REQUEST = {
  method: 'get',
  url: '/wx/address/list',
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

  const response = await request({
    ...REQUEST,
    token: t.context.token,
  });

  t.is(response.body.errno, 0);
  t.deepEqual(response.body.data, {
    total: list.length,
    pages: 1,
    limit: list.length,
    page: 1,
    list,
  });
});

test('not logged in', async (t) => {
  const response = await request({
    ...REQUEST,
  });

  t.is(response.body.errno, 501);
});
