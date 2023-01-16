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
  userId: string;
  parentId: string;
  articleId:string;
}

interface IReportData {
  timeStamp: string;
  userId: string;
  reason: string;
  ref: string;
}

interface IReactionData {
  timeStamp: string;
  action: string;
  userId:string;
  event:string;
  type:string;
  ref:string;
}

interface CommentBoxProps {
  articleId: string;
  currentUser: {
    fullName: string;
    avatar: string;
    userId: any;
  };
}

interface IAxiosHeaders {
  Authorization: string | any;
  refreshToken: string | any;
}
export type { ICommentData, IReportData, IReactionData, CommentBoxProps, IAxiosHeaders };
