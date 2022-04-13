import { Module } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';

export enum COLLECTION {
    INCIDENTS = "incidents",
    STATISTICS = "statistics",
    RELEASES = "releases"
}

@Module({
    providers: [
        {
            provide: 'MONGODB_CONNECTION',
            useFactory: async (): Promise<Db> => {
                try {
                    const MONGODB_PASS = process.env.MONGODB_PASS;
                    const MONGODB_NAME = process.env.MONGODB_NAME;
                    const uri = `mongodb+srv://mongodb-workspace:${MONGODB_PASS}@cluster0.agz58.mongodb.net/${MONGODB_NAME}?retryWrites=true&w=majority`;

                    const client = await MongoClient.connect(uri, {
                        // useUnifiedTopology: true
                    });

                    return client.db(MONGODB_NAME);
                } catch (e) {
                    throw e;
                }
            }
        }
    ],
    exports: ['MONGODB_CONNECTION'],
})
export class MongodbModule { }