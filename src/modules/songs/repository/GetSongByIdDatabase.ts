import { Db } from "mongodb";
import Database from "../../../datasource/database";
import Respository from "../../../domain/Repository";

export default class SaveSongsDatabase extends Respository<Database<Db>> {
    async exec(songId: string): Promise<any> {
        const db = await this.dataSource.getConnection();
        const filter = { id: songId };
        const projection = { _id: 0, available_markets: 0 };

        // FIXME: EXTERNALIZE COLLECTION NAME
        return await db.collection('songs')
            .findOne(filter, { projection });
    }
}
