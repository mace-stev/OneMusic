export type OAuthParams = {
  client_id?: string;
  redirect_uri?: string;
  response_type?: string;
  scope?: string;
  include_granted_scopes?: string;
  state?: string;
  access_token?: string;
  [key: string]: string | undefined;
};
export type YoutubePlaylists = {
  etag: string;
  id: string;
  kind: string;
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
    publishedAt: Date;
    title: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      },
      medium: {
        url: string;
        width: number;
        height: number
      }
    };
  }
}
export type YoutubeVideos= {
  etag: string;
  id: string;
  kind: string;
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
    publishedAt: Date;
    title: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      },
      medium: {
        url: string;
        width: number;
        height: number
      }
    };
    videoOwnerChannelTitle: string
  }
}
export type cleanYoutubePlaylists = {
  id: string;
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
    publishedAt: Date;
    title: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      },
      medium: {
        url: string;
        width: number;
        height: number
      }
    };
  }
}
 export type FilteredYoutubeSong = {
    id?: string | undefined;
    ytId: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      }
    },
    title: string;
    videoOwnerChannelTitle: string;
    imageId: string;

  }
  export type UpdatedFilteredYoutubeSong={
    id?: string | undefined;
    ytId: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      }
    },
    title: string;
    videoOwnerChannelTitle: string;
    imageId: string;
    songArtist: string;
    songTitle: string;
  }

  export type OAuthParams = {
  client_id?: string;
  redirect_uri?: string;
  response_type?: string;
  scope?: string;
  include_granted_scopes?: string;
  state?: string;
  access_token?: string;
  [key: string]: string | undefined;
};