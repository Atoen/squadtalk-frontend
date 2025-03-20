import { Pipe, PipeTransform } from "@angular/core";
import { MessageEmbed } from "@data/models";

@Pipe({ name: 'formatEmbedContent' })
export class FormatEmbedContentPipe implements PipeTransform {
    transform(embed: MessageEmbed) {

    }
}