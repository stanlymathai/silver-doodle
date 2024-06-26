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
    moderated?: boolean
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
        parentId?: string
        moderated?: boolean
    }>
}
interface ICurrentUser {
    userId: string
    avatar: string
    fullName: string
}

export type { IArticleData, ICommentData, ICurrentUser }