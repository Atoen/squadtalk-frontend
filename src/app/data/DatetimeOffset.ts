import { MessagePackObject } from "./MessagePackObject";

export type DateTimeOffsetPacked = [string, number];

export class DateTimeOffset implements MessagePackObject<DateTimeOffsetPacked> {
    readonly packed: DateTimeOffsetPacked;

    constructor(
        readonly dateTime: Date,
        readonly offset: number,
        packed?: DateTimeOffsetPacked
    ) {
        this.packed = packed ?? [
            dateTime.toISOString(),
            offset
        ];
    }

    static unpack(data: DateTimeOffsetPacked): DateTimeOffset {
        const [isoString, timezoneOffset] = data;
        const timestamp = new Date(isoString);
        const adjustedTimestamp = new Date(timestamp.getTime() - timezoneOffset * 60 * 1000);

        return new DateTimeOffset(adjustedTimestamp, timezoneOffset, data);
    }
}