const test = require('ava');
const { request, createUser, destroyUser } = require('../../helpers/app.js');
const { DATA } = require('../helpers/address.js');

const REQUEST = {
  method: 'post',
  url: '/wx/address/save',
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

test.serial('success', async (t) => {
  const data = Object.assign({}, DATA);
  const response = await request({
    ...REQUEST,
    token: t.context.token,
    data,
  });

  t.is(response.body.errno, 0);
  t.assert(Number.isInteger(response.body.data));

  data.id = response.body.data;

  const address = await getAddress(data.id);
  t.like(address, data);
});

test.serial('not logged in', async (t) => {
  const data = Object.assign({}, DATA);
  const response = await request({
    ...REQUEST,
    data,
  });

  t.is(response.body.errno, 501);
});
