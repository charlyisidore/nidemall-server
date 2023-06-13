const Base = require('./base.js');

module.exports = class AdminRegionController extends Base {
  async clistAction() {
    /** @type {number} */
    const id = this.get('id');
    /** @type {RegionService} */
    const regionService = this.service('region');

    const regionList = await regionService.queryByPid(id);

    return this.successList(regionList);
  }

  async listAction() {
    /** @type {RegionService} */
    const regionService = this.service('region');

    const nidemallRegions = await regionService.getAll();

    const collect = nidemallRegions.reduce((previous, current) => {
      previous[current.type] ??= [];
      previous[current.type].push(current);
      return previous;
    }, {});

    const provinceList = collect[1];
    const cityList = collect[2];
    const areaList = collect[3];

    const cityMap = cityList.reduce((previous, current) => {
      previous[current.pid] ??= [];
      previous[current.pid].push(current);
      return previous;
    }, {});

    const areaMap = areaList.reduce((previous, current) => {
      previous[current.pid] ??= [];
      previous[current.pid].push(current);
      return previous;
    }, {});

    const regionVoList = provinceList.map((province) => ({
      id: province.id,
      name: province.name,
      code: province.code,
      type: province.type,
      children: cityMap[province.id]?.map((city) => ({
        id: city.id,
        name: city.name,
        code: city.code,
        type: city.type,
        children: areaMap[city.id]?.map((area) => ({
          id: area.id,
          name: area.name,
          code: area.code,
          type: area.type,
        })) ?? [],
      })) ?? [],
    }));

    return this.successList(regionVoList);
  }
};
