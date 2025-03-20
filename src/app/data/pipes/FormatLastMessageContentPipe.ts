import { Pipe, PipeTransform, untracked } from "@angular/core";
import { ChatMessage, MessageEmbed } from "../models";
import { ChatType, EmbedType } from "../enums";
import { EmbedData } from "../dtos";

@Pipe({ name: 'formatLastMessageContent' })
export class FormatLastMessageContentPipe implements PipeTransform {
    transform(message: ChatMessage, chatType: ChatType) {
        if (!message) return '';

        const isByCurrentUser = message.isByLocalUser;

        let authorPrefix = '';
        if (isByCurrentUser) {
            authorPrefix = 'You';
        } else if (chatType === ChatType.GroupChat) {
            authorPrefix = untracked(message.author.username);
        }

        let messageContent: string;
        if (message.embed) {
            switch (message.embed.type) {
                case EmbedType.File:
                    messageContent = `${this.getEmbedPrefix(isByCurrentUser)} File`;
                    break;
                case EmbedType.Image:
                    messageContent = `${this.getEmbedPrefix(isByCurrentUser)} Image`;
                    break;
                case EmbedType.Video:
                    messageContent = `${this.getEmbedPrefix(isByCurrentUser)} Video`;
                    break;
                case EmbedType.SystemMessage:
                    messageContent = this.formatSystemMessage(message.embed, isByCurrentUser);
                    break;
                default:
                    messageContent = message.content;
            }
        } else {
            messageContent = message.content;
        }

        const useAuthorPrefix = authorPrefix !== '' && message.embed?.type !== EmbedType.SystemMessage;
        return useAuthorPrefix ? `${authorPrefix}: ${messageContent}` : messageContent;
    }

    private getEmbedPrefix(isByCurrentUser: boolean): string {
        return isByCurrentUser ? 'You sent' : 'Sent';
    }

    private formatSystemMessage(embed: MessageEmbed, byCurrentUser: boolean): string {
        const systemMessageType = embed.get(EmbedData.SystemMessageType);

        switch (systemMessageType) {
            case EmbedData.SystemMessageTypeChannelCreated:
                return byCurrentUser ? 'You created the channel' : `${embed.get(EmbedData.SystemMessageDataUsername)} created the channel`;
            case EmbedData.SystemMessageTypeChannelNameChanged:
                return byCurrentUser
                    ? `You changed the channel name to ${embed.get(EmbedData.SystemMessageDataChannelName)}`
                    : `${embed.get(EmbedData.SystemMessageDataUsername)} changed the channel name to ${embed.get(EmbedData.SystemMessageDataChannelName)}`;
            case EmbedData.SystemMessageTypeChannelNameCleared:
                return byCurrentUser
                    ? 'You cleared the channel name'
                    : `${embed.get(EmbedData.SystemMessageDataUsername)} cleared the channel name`;
            case EmbedData.SystemMessageTypeCallStarted:
            case EmbedData.SystemMessageTypeCallEnded:
                return byCurrentUser ? 'You started a call' : `${embed.get(EmbedData.SystemMessageDataUsername)} started a call`;
            case EmbedData.SystemMessageTypeCallMissed:
                return 'Missed call';
            default:
                return '';
        }
    }
}