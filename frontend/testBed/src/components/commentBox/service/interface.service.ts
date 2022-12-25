interface ICommentData {
  articleId: string;
  id?: any | null;
  userId: string;
  comId: string;
  fullName: string;
  avatarUrl: string;
  text: string;
  replies?:
  | Array<{
    userId: string;
    comId: string;
    fullName: string;
    avatarUrl: string;
    text: string;
  }>
  | undefined;
  repliedToCommentId: string;
}

interface CommentBoxProps {
  articleId: string;
  currentUser: {
    currentUserId: string;
    currentUserFullName: string;
    currentUserImg: string;
  };
}

interface IAxiosHeaders {
  Authorization: string | any;
  refreshToken: string | any;
}
export type { ICommentData, CommentBoxProps, IAxiosHeaders };
