import { Db } from "mongodb";
import Database from "../../../datasource/database";
import { MongoCollection } from "../../../datasource/database/mongo";
import Respository from "../../../domain/Repository";
import Constants from "../../../helpers/Constants";

export default class SaveSongsMongodb extends Respository<Database<Db>> {
    async exec(
        artistName: string, limit: number = Constants.PAGING_DEFAULT_LIMIT,
        offset: number = Constants.PAGING_DEFAULT_OFFSET
    ): Promise<any> {
        const db = await this.dataSource.getConnection();
        const filter = {
            'artists.name': { $regex: new RegExp(`${artistName}`, 'i') }
        };
        const projection = { _id: 0, id: 1, name: 1 };
        const pagination = { skip: offset, limit: limit };

        const rows = await db.collection(MongoCollection.SONGS)
            .find(filter, { projection, ...pagination })
            .toArray();
        const count = await db.collection(MongoCollection.SONGS)
            .countDocuments(filter);

        return { rows, count };
    }
}
