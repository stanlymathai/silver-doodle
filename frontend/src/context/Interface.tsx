interface IArticleData {
    articleId: string
    reaction: {
        like: boolean
        brilliant: boolean
        thoughtful: boolean
    }
}
interface ICommentData {
    text: string
    comId: string
    userId: string
    fullName: string
    avatarUrl: string
    timeStamp: string
    reaction: {
        like: boolean
        brilliant: boolean
        thoughtful: boolean
    }
    replies: Array<{
        text: string
        userId: string
        comId: string
        fullName: string
        avatarUrl: string
        timeStamp: string
        reaction: {
            like: boolean
            brilliant: boolean
            thoughtful: boolean
        }
    }>
}
interface ICurrentUser {
    currentUserId: string
    currentUserImg: string
    currentUserFullName: string
}

export type { IArticleData, ICommentData, ICurrentUser }