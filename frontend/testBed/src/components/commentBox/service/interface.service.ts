interface ICommentData {
  articleId: string;
  id?: any | null;
  userId: string;
  comId: string;
  fullName: string;
  avatarUrl: string;
  text: string;
  replies?: Array<{
    userId: string;
    comId: string;
    fullName: string;
    avatarUrl: string;
    text: string;
  }> | undefined;
}

interface CommentBoxProps {
  articleId: string,
  currentUser: {
    currentUserId: string,
    currentUserFullName: string,
    currentUserImg: string
  }
}
export type { ICommentData, CommentBoxProps }
