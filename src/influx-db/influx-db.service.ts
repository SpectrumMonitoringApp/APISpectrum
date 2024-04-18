import groupBy from 'lodash.groupby';
import { Injectable } from '@nestjs/common';
import { InfluxDB, FluxTableMetaData, QueryApi } from '@influxdata/influxdb-client';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { DataStore } from '../data-stores/entities/data-store.entity';

@Injectable()
export class InfluxDbService {
  public queryApi: QueryApi;

  constructor(@InjectRepository(DataStore)
              private resourcesRepository: Repository<DataStore>) {
    // const url = 'http://localhost:8086';
    // const token = 'MkSDyNlocaNlRdJ';
    const url = 'http://influxdbloadbalancer-72772441.us-east-1.elb.amazonaws.com';
    const token = 'MkSDyNlocaNlRdJ';
    const org = 'bmykhaylivvv-org';

    this.queryApi = new InfluxDB({ url, token }).getQueryApi(org);
  }

  buildFluxInCondition(funcArgument, filterKey, ids) {
    const chainedOrConditions = ids.map((id) => `${funcArgument}["${filterKey}"] == "${id}"`).join(' or ');

    return `(${funcArgument}) => ${chainedOrConditions}` + ')';
  }

  groupDataById(data) {
    const groupedData = {};

    // Iterate through each item in the provided data array
    data.forEach(item => {
      const { dataStoreId, value, time, name } = item;

      // Check if the dataStoreId already exists in groupedData
      if (!groupedData[dataStoreId]) {
        // If it doesn't exist, initialize it with a new array
        groupedData[dataStoreId] = { name, dataPoints: [] };
      }

      // Append the [time, value] pair to the corresponding ID array
      groupedData[dataStoreId].dataPoints.push([+new Date(time), value]);
    });

    return groupedData;
  }

  async getResourceInfluxDbData(resourceId: number, dataStoreIds: number[], measurement: string) {
    // TODO: Think about caching mechanism
    if (!dataStoreIds.length) return this.groupDataById([]);

    const fluxQuery = `from(bucket: "bmykhaylivvv-bucket")
        |> range(start: -30d)
        |> filter(fn: (r) => r["_measurement"] == "${measurement}")
        |> filter(fn: (r) => r["_field"] == "payload")
        |> filter(fn: ${this.buildFluxInCondition('r', 'dataStoreId', dataStoreIds)}
        |> filter(fn: (r) => r["resourceId"] == "${resourceId}")`;
    const data = await this.queryApi.collectRows(
      fluxQuery //, you can also specify a row mapper as a second argument
    );
    const dataStores = await this.resourcesRepository.find({ where: { id: In(dataStoreIds) } });
    const dataStoresMap = {};

    dataStores.forEach((ds) => {
      dataStoresMap[ds.id] = ds.name;
    });

    const mappedData = data.map((row: any) => ({
      dataStoreId: row.dataStoreId,
      name: dataStoresMap[+row.dataStoreId],
      value: row['_value'],
      time: row['_time']
    }));

    return this.groupDataById(mappedData);
  }
}
