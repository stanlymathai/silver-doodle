interface ICommentData {
  comId: string;
  fullName: string;
  avatarUrl: string;
  timeStamp: string;
  text: string;
  replies?:
  | Array<{
    comId: string;
    fullName: string;
    avatarUrl: string;
    timeStamp: string;
    text: string;
  }>
  | undefined;
  parentId: string;
}

interface IReportData {
  reason: string;
  ref: string;
}

interface IReactionData {
  action: string;
  event:string;
  type:string;
  ref:string;
}

interface CommentBoxProps {
  articleId: string;
  currentUser: {
    fullName: string;
    avatar: string;
  };
}

interface IAxiosHeaders {
  Authorization: string | any;
  refreshToken: string | any;
}
export type { ICommentData, IReportData, IReactionData, CommentBoxProps, IAxiosHeaders };
