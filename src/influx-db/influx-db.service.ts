import 'dotenv/config';
import groupBy from 'lodash.groupby';
import { Injectable } from '@nestjs/common';
import { InfluxDB, FluxTableMetaData, QueryApi } from '@influxdata/influxdb-client';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { DataStore } from '../data-stores/entities/data-store.entity';

function formatDate(difference) {
  let days = Math.floor(difference / (1000 * 60 * 60 * 24));
  let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return "Total time elapsed is: " + days + " days " + hours + " hours " + minutes + " minutes " + seconds + " seconds."
}

@Injectable()
export class InfluxDbService {
  public queryApi: QueryApi;

  constructor(
    @InjectRepository(DataStore)
    private resourcesRepository: Repository<DataStore>
  ) {
    const url = process.env.INFLUX_DB_URL;
    const token = process.env.INFLUX_DB_TOKEN;
    const org = process.env.INFLUX_DB_ORG;

    this.queryApi = new InfluxDB({ url, token }).getQueryApi(org);
  }

  buildFluxInCondition(funcArgument, filterKey, ids) {
    const chainedOrConditions = ids.map((id) => `${funcArgument}["${filterKey}"] == "${id}"`).join(' or ');

    return `(${funcArgument}) => ${chainedOrConditions}` + ')';
  }

  groupDataById(data) {
    const groupedData = {};
    const groupDataByIdStart = +new Date();

    // Iterate through each item in the provided data array
    data.forEach((item) => {
      const { dataStoreId, value, time, name } = item;

      // Check if the dataStoreId already exists in groupedData
      if (!groupedData[dataStoreId]) {
        // If it doesn't exist, initialize it with a new array
        groupedData[dataStoreId] = { name, dataPoints: [] };
      }

      // Append the [time, value] pair to the corresponding ID array
      groupedData[dataStoreId].dataPoints.push([+new Date(time), value]);
    });

    const groupDataByIdEnd = +new Date();
    console.log('groupDataById: ', formatDate(groupDataByIdEnd - groupDataByIdStart))

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
    const influxDbCallStart = +new Date();
    const data = await this.queryApi.collectRows(
      fluxQuery //, you can also specify a row mapper as a second argument
    );
    const influxDbCallEnd = +new Date();

    console.log('influxDbCall: ', formatDate(influxDbCallEnd - influxDbCallStart))

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
