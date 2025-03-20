import { Pipe, PipeTransform } from "@angular/core";
import { DateTimeOffset } from "@data/DatetimeOffset";
import { TimestampFormatMode } from "@data/enums/TimestampFormatMode";
import { DatePipe } from "@angular/common";

@Pipe({ name: 'formatTimestamp' })
export class FormatTimestampPipe implements PipeTransform {

    private static readonly pipe = new DatePipe('en-US');

    transform(value: DateTimeOffset, mode: TimestampFormatMode = TimestampFormatMode.Default) {
        return FormatTimestampPipe.pipe.transform(value.dateTime);
    }
}