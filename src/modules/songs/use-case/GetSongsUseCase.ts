import UseCase from "../../../domain/UseCase";

export default class GetSongsUseCase extends UseCase<any> {
    async exec(
        endpointPath: string, artistName: string,
        limit: number, offset: number
    ): Promise<any> {
        const { rows, count } = await this.repository.exec(artistName, limit, offset);

        const paging = this.getPagingData(endpointPath, artistName, count, limit, offset);
        const songs = rows.map((row: any) => {
            const { id, name } = row;
            return { songId: id, songTitle: name };
        });

        return { songs, limit, offset, ...paging };
    }

    private getPagingData(
        endpointPath: string, artistName: string, total: number,
        limit: number, offset: number
    ): any {
        const nextOffset = Math.min(total, offset + limit);
        const previousOffset = Math.max(0, offset - limit);
        let next = null;
        let previous = null;

        if (nextOffset < total) {
            next = `${endpointPath}?artistName=${artistName}&offset=${nextOffset}&limit=${limit}`;
        }
        if (previousOffset > 0) {
            previous = `${endpointPath}?artistName=${artistName}&offset=${previousOffset}&limit=${limit}`;
        }

        return { total, next, previous };
    }
}
