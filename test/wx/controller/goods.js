const test = require('ava');
const request = require('supertest');
const path = require('path');
require(path.join(process.cwd(), 'production.js'));

const GOODS_ID = [
  1006051, 1009024, 1025005, 1083009, 1086015, 1092026,
  1113019, 1116032, 1125026, 1127052, 1130038, 1135002,
  1143006, 1143018, 1152097, 1181000, 1009012, 1009027,
  1011004, 1033000, 1038004, 1064022, 1085019, 1092025,
  1109008, 1110003, 1116031, 1127047, 1135050, 1138000,
  1143019, 1153006, 1009013, 1023003, 1027004, 1064021,
  1075022, 1083010, 1097004, 1110004, 1127025, 1129016,
  1130039, 1135072, 1138001, 1143020, 1152004, 1156006,
  1015007, 1023012, 1064003, 1073008, 1075023, 1086052,
  1092001, 1097005, 1110007, 1111007, 1116030, 1127024,
  1129015, 1135073, 1152031, 1023034, 1036002, 1048005,
  1064000, 1065004, 1092005, 1097017, 1113011, 1114011,
  1115028, 1116005, 1116011, 1128010, 1152100, 1166008,
  1037012, 1039056, 1051002, 1057036, 1064002, 1065005,
  1097016, 1113010, 1116004, 1128011, 1130049, 1143016,
  1152095, 1152161, 1155015, 1006013, 1019006, 1021000,
  1045000, 1051000, 1055022, 1056002, 1064004, 1072001,
  1093000, 1097009, 1125010, 1135001, 1152008, 1019000,
  1021001, 1046001, 1051001, 1055016, 1068012, 1070000,
  1074001, 1093001, 1097011, 1108032, 1125011, 1127038,
  1152009, 1019001, 1046002, 1051003, 1072000, 1093002,
  1097012, 1108030, 1111010, 1116008, 1130056, 1134036,
  1135065, 1151013, 1152101, 1019002, 1055012, 1097013,
  1108031, 1109034, 1131017, 1151012, 1043005, 1064006,
  1097014, 1108029, 1109004, 1115053, 1127039, 1064007,
  1097007, 1109005, 1110016, 1134030, 1143015, 1155000,
  1097006, 1110002, 1110019, 1115023, 1134032, 1135000,
  1039051, 1092024, 1110017, 1116033, 1125016, 1134056,
  1006014, 1020000, 1021010, 1110018, 1125017, 1006010,
  1022001, 1071006, 1135058, 1006007, 1071005, 1090004,
  1130037, 1022000, 1068011, 1092039, 1115052, 1009009,
  1030004, 1092038, 1130041, 1023032, 1071004, 1075024,
  1130042, 1030006, 1068010, 1081002, 1110013, 1030005,
  1037011, 1081000, 1110014, 1006002, 1030003, 1110015,
  1127003, 1029005, 1030002, 1086024, 1030001, 1086023,
  1100000, 1086026, 1110008, 1147046, 1036013, 1086025,
  1128002, 1036016, 1147045, 1100002, 1147047, 1100001,
  1147048, 1084003, 1134022, 1021004, 1035006, 1010001,
  1135057, 1046044, 1135052, 1044012, 1135051, 1010000,
  1135056, 1084001, 1135055, 1135053, 1135054
];

function omit(obj, keys) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([k, v]) => !keys.includes(k)
    )
  );
}

test.serial('list', async (t) => {
  const url = '/wx/goods/list';
  let pages = 0;

  // No parameter
  {
    const response = await request(think.app.listen())
      .get(url)
      .expect('Content-Type', /json/)
      .expect(200);

    const actual = response.body;
    const expected = require(`./goods/list_1.json`);

    t.is(actual.errno, expected.errno);
    t.deepEqual(actual.data, expected.data);

    pages = actual.data.pages;
  }

  // With `page`
  for (let page = 1; page <= pages; page++) {
    const response = await request(think.app.listen())
      .get(url)
      .query({ page })
      .expect('Content-Type', /json/)
      .expect(200);

    const actual = response.body;
    const expected = require(`./goods/list_${page}.json`);

    t.is(actual.errno, expected.errno);
    t.deepEqual(actual.data, expected.data);
  }
});

test.serial('detail', async (t) => {
  const url = '/wx/goods/detail';
  const ignoreKeys = ['groupon'];

  // Missing `id`
  {
    const response = await request(think.app.listen())
      .get(url)
      .expect('Content-Type', /json/)
      .expect(200);

    t.is(response.body.errno, 402);
  }

  // Not found `id`
  {
    const response = await request(think.app.listen())
      .get(url)
      .query({ id: 99999999 })
      .expect('Content-Type', /json/)
      .expect(200);

    // litemall returns 502
    t.is(response.body.errno, 402);
  }

  // With `id`
  await Promise.all(
    GOODS_ID
      .map(async (id) => {
        const response = await request(think.app.listen())
          .get(url)
          .query({ id })
          .expect('Content-Type', /json/)
          .expect(200);

        const actual = response.body;
        const expected = require(`./goods/detail_${id}.json`);

        t.is(actual.errno, expected.errno);

        t.deepEqual(
          omit(actual.data, ignoreKeys),
          omit(expected.data, ignoreKeys)
        );
      })
  );
});

test.serial('related', async (t) => {
  const url = '/wx/goods/related';

  // // Missing `id`
  {
    const response = await request(think.app.listen())
      .get(url)
      .expect('Content-Type', /json/)
      .expect(200);

    t.is(response.body.errno, 402);
  }

  // Not found `id`
  {
    const response = await request(think.app.listen())
      .get(url)
      .query({ id: 99999999 })
      .expect('Content-Type', /json/)
      .expect(200);

    t.is(response.body.errno, 402);
  }

  // With `id`
  await Promise.all(
    GOODS_ID
      .map(async (id) => {
        const response = await request(think.app.listen())
          .get(url)
          .query({ id })
          .expect('Content-Type', /json/)
          .expect(200);

        const actual = response.body;
        const expected = require(`./goods/related_${id}_1.json`);

        t.is(actual.errno, expected.errno);
        t.deepEqual(actual.data, expected.data);
      })
  );
});
