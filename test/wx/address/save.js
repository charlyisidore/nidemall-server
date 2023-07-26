const test = require('ava');
const { request, createUser, destroyUser } = require('../../helpers/app.js');
const { createAddress, destroyAddress, DATA } = require('../helpers/address.js');
const { validateResponse } = require('../../helpers/openapi.js');

const REQUEST = {
  method: 'post',
  path: '/wx/address/save',
};

// Check if an address exists
function getAddress(id) {
  return think.model('address')
    .where({ id })
    .find();
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

// Hard-delete the addresses from the database
test.afterEach(async (t) => {
  return think.model('address')
    .where({ userId: t.context.userId })
    .delete();
});

test.serial('add', async (t) => {
  const data = Object.assign({}, DATA);

  const response = await request(t, {
    ...REQUEST,
    token: t.context.token,
    data,
  });

  t.is(response.errno, 0);
  t.assert(Number.isInteger(response.data));

  data.id = response.data;

  const address = await getAddress(data.id);
  t.like(address, data);

  await validateResponse(REQUEST, response, t);
});


test.serial('update', async (t) => {
  const data = await createAddress({ userId: t.context.userId });
  t.teardown(async () => {
    await destroyAddress(data.id);
  });

  const newData = Object.assign({}, data, {
    name: 'my name 2',
    tel: '13456789013',
    province: 'my province 2',
    city: 'my city 2',
    county: 'my county 2',
    areaCode: '123457',
    addressDetail: 'my address detail 2',
    isDefault: false,
  });

  const response = await request(t, {
    ...REQUEST,
    token: t.context.token,
    data: newData,
  });

  t.is(response.errno, 0);
  t.assert(Number.isInteger(response.data));
  t.is(response.data, data.id);

  const address = await getAddress(data.id);
  t.like(address, newData);

  await validateResponse(REQUEST, response, t);
});

test.serial('not found', async (t) => {
  const data = Object.assign({}, DATA, {
    id: 99999999,
  });
  const response = await request(t, {
    ...REQUEST,
    token: t.context.token,
    data,
  });

  t.is(response.errno, 402);
});

test.serial('not logged in', async (t) => {
  const data = Object.assign({}, DATA);
  const response = await request(t, {
    ...REQUEST,
    data,
  });

  t.is(response.errno, 501);
});

test.serial('update default', async (t) => {
  const data1 = await createAddress({
    userId: t.context.userId,
    isDefault: false,
  });
  const data2 = await createAddress({
    userId: t.context.userId,
    isDefault: true,
  });

  t.teardown(async () => {
    await destroyAddress(data1.id);
    await destroyAddress(data2.id);
  });

  const newData1 = Object.assign({}, data1, {
    isDefault: true,
  });

  const response = await request(t, {
    ...REQUEST,
    token: t.context.token,
    data: newData1,
  });

  t.is(response.errno, 0);
  t.assert(Number.isInteger(response.data));
  t.is(response.data, data1.id);

  const address1 = await getAddress(data1.id);
  t.is(address1.isDefault, true);
  const address2 = await getAddress(data2.id);
  t.is(address2.isDefault, false);

  await validateResponse(REQUEST, response, t);
});
