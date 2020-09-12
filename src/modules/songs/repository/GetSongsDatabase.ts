import { Db } from "mongodb";
import Database from "../../../datasource/database";
import Respository from "../../../domain/Repository";

export default class SaveSongsDatabase extends Respository<Database<Db>> {
    async exec(artistName: string, limit: number = 20, offset: number = 0): Promise<any> {
        const db = await this.dataSource.getConnection();
        const filter = {
            'artists.name': { $regex: new RegExp(`${artistName}`, 'i') }
        };
        const projection = { _id: 0, id: 1, name: 1 };
        const pagination = { skip: offset, limit: limit };

        // FIXME: EXTERNALIZE COLLECTION NAME
        const rows = await db.collection('songs')
            .find(filter, { projection, ...pagination })
            .toArray();
        const count = await db.collection('songs')
            .countDocuments(filter);
        return { rows, count };
    }
}
