declare namespace PrunApi {
  interface ChannelMessage {
    messageId: string;
    type: string;
    sender: ChannelMessageSender | null;
    message: string | null;
    time: DateTime;
    channelId: string;
    deletingUser: ChannelMessageSender | null;
  }

  interface ChannelMessageSender {
    id: string;
    username: string;
  }

  interface ChannelMessageList {
    channelId: string;
    messages: ChannelMessage[];
    hasMore: boolean;
  }

  interface ChannelClientMembership {
    type: string;
    identifier: string;
    channelId: string | null;
    joined: boolean;
    muted: boolean | null;
    readUntil: DateTime;
    lastActivity: DateTime | null;
  }

  interface ChannelChannelList {
    channels: ChannelClientMembership[];
  }
}
