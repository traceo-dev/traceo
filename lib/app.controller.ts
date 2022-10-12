import { Controller, Get } from '@nestjs/common';
// import * as Influx from "influx";
import { InfluxDB, Point } from '@influxdata/influxdb-client'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'

const token = 'z0uPbnrssUlNiw1Vtc_Ja-MqVJvCe3qEUArL6UnBZAmIBgbsgTJz6GkKkHvHdFU9KeIWayihW2KnB6I1DEJ-aA=='
const org = 'traceo'
const bucket = 'traceo_test'

@Controller()
export class AppController {
  private influx: InfluxDB;

  constructor() {
    this.influx = new InfluxDB({ url: 'http://localhost:8086', token: token });
  }

  async influxTest() {
    const writeApi = this.influx.getWriteApi(org, bucket)
    const point = new Point('mem').floatField('used_percent', 23.43234543)
    writeApi.writePoint(point)

    writeApi
      .close()
      .then(() => {
        console.log('FINISHED')
      })
      .catch(e => {
        console.error(e)
        console.log('Finished ERROR')
      })

  }

  @Get("/heartbeat")
  async heartbeat(): Promise<string> {
    await this.influxTest()
    return `Traceo - backend, v.${process.env.VERSION} - ${process.env.NODE_ENV}`;
  }

  @Get("/heartbeat2")
  async heartbeat2(): Promise<any> {
    const queryApi = this.influx.getQueryApi(org)

    const query = `
      from(bucket: "traceo_test") 
        |> range(start: -1h) 
        |> filter(fn: (r) => r._measurement == "metrics")
        |> filter(fn: (r) => r._field == "otherMetric" or r._field == "cpuUsage")
        |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> keep(columns: ["_time", "cpuUsage", "otherMetric"])
      `;
    const metrics: {time: any, value: any}[] = [];

    return await new Promise<any>((resolve, reject) => {
      queryApi.queryRows(query, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          console.log(o)
        },
        error: reject,
        complete() {
          resolve(metrics)
        }
      })
    })
  }
}
