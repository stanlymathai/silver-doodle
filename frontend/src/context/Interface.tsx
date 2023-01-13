interface IArticleData {
    articleId: string
    reaction: {
        like: boolean
        brilliant: boolean
        thoughtful: boolean
    }
    reactionCount: number
}
interface ICommentData {
    text: string
    comId: string
    fullName: string
    avatarUrl: string
    timeStamp: string
    reaction: {
        like: boolean
        brilliant: boolean
        thoughtful: boolean
    }
    reactionCount: number
    replies: Array<{
        text: string
        comId: string
        fullName: string
        avatarUrl: string
        timeStamp: string
        reaction: {
            like: boolean
            brilliant: boolean
            thoughtful: boolean
        }
        reactionCount: number
        repliedToCommentId?: string
    }>
}
interface ICurrentUser {
    currentUserId: string
    currentUserImg: string
    currentUserFullName: string
}

export type { IArticleData, ICommentData, ICurrentUser }