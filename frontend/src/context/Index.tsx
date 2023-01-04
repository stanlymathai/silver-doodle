import React, { createContext, useEffect, useState } from "react"

import { IArticleData, ICommentData, ICurrentUser } from "./Interface"

export const GlobalContext = createContext({})

export const Provider = ({
  loading,
  loadMore,
  children,
  totalCount,
  currentUser,
  commentData,
  articleData,
  onReplyAction,
  onReportAction,
  cancelBtnStyle,
  onSubmitAction
}: {
  loading: boolean
  articleData?: IArticleData
  totalCount?: number
  children: any
  currentUser?: ICurrentUser
  cancelBtnStyle?: object
  commentData?: Array<ICommentData>
  loadMore?: Function
  onReportAction: Function
  onReplyAction?: Function
  onSubmitAction?: Function
}) => {
  const [currentUserData] = useState(currentUser)
  const [data, setData] = useState<Array<ICommentData>>([])
  const [reportData, setReport] = useState<any>({})
  const [article, setArticle] = useState<IArticleData>({
    articleId: '###',
    reaction: {
      like: false,
      brilliant: false,
      thoughtful: false
    }
  })
  const [replyThreadId, setReplyThread] = useState<string>("")
  const [showDiscussionBox, setDiscussionVisibility] = useState<Boolean>(false)

  useEffect(() => { if (commentData) setData(commentData) }, [commentData])
  useEffect(() => { if (articleData) setArticle(articleData) }, [articleData])

  const handleReply = (id: string) => setReplyThread(id)

  const handleSubmit = (text: string, uuid: string, timeStamp: string) => {
    let commentData = {
      text,
      timeStamp,
      comId: uuid,
      replies: [],
      reaction: {
        like: false,
        brilliant: false,
        thoughtful: false
      },
      userId: currentUserData!.currentUserId,
      avatarUrl: currentUserData!.currentUserImg,
      fullName: currentUserData!.currentUserFullName,
    }
    setData([commentData, ...data])
  }

  const handleSort = (el: { value: string }) => {
    let arrCopy = data

    switch (el.value) {
      case "oldest":
        arrCopy.sort(function (a, b) {
          return a.timeStamp > b.timeStamp ? 1
            : a.timeStamp < b.timeStamp ? -1 : 0
        })
        break;
      case "newest":
        arrCopy.sort(function (a, b) {
          return a.timeStamp < b.timeStamp ? 1
            : a.timeStamp > b.timeStamp ? -1 : 0
        })
        break;
      case "engaged":
        arrCopy.sort(function (a, b) {
          return a.replies.length < b.replies?.length ? 1
            : a.replies.length > b.replies.length ? -1 : 0
        })
        break;

      default:
        break;
    }
    setData([...arrCopy])
  }

  const handleReaction = (event: string, info: any) => {
    const ref = info.comId ?? info.articleId
    const type = info.comId ? "COMMENT" : "ARTICLE"
    const action = info.reaction[event] ? "REMOVE" : "ADD"
    const payload = { ref, type, action, event }

    switch (type) {
      case "COMMENT":
        let copyData = [...data]

        if (info.repliedToCommentId) {
          const parentIdx = copyData.findIndex((i) => i.comId == info.repliedToCommentId)
          const childIdx = copyData[parentIdx].replies.findIndex(i => i.comId == info.comId)

          copyData[parentIdx].replies[childIdx].reaction[event] = !copyData[parentIdx].replies[childIdx].reaction[event]
        } else {
          const targetIdx = copyData.findIndex((i) => i.comId == info.comId)

          copyData[targetIdx].reaction[event] = !copyData[targetIdx].reaction[event]
        }
        setData(copyData)
        break;

      case "ARTICLE":
        let articleCopy = article
        articleCopy.reaction[event] = !articleCopy.reaction[event]

        setArticle(articleCopy)
        break;

      default:
        return
    }
    console.log(payload, "payload")
  }

  const report = {
    open: (commentData: any) => {
      switchComponent("report-main")
      setReport(commentData)
    },
    menu: (reson: string) => {
      switchComponent("report-menu")
      setReport({
        reson, ...reportData,
        reportedUser: currentUser?.currentUserId
      })
    },
    submit: () => {
      onReportAction(reportData)
      switchComponent("feedback")
      setReport({})
    },
    close: () => {
      setReport({})
      switchComponent("close-menu")
    }
  }

  const switchComponent = (id: string) => document.getElementById(id)?.click()
  const toggleDisscusionbox = () => setDiscussionVisibility(!showDiscussionBox)


  const onReply = (
    text: string,
    uuid: string,
    comId: string,
    timeStamp: string
  ) => {
    handleReply("")
    let copyData = [...data]
    const targetIdx = copyData.findIndex((i) => i.comId == comId)
    copyData[targetIdx].replies!.push({
      text,
      timeStamp,
      comId: uuid,
      reaction: {
        like: false,
        brilliant: false,
        thoughtful: false
      },
      userId: currentUserData!.currentUserId,
      avatarUrl: currentUserData!.currentUserImg,
      fullName: currentUserData!.currentUserFullName
    })
    setData(copyData)
  }
  return (
    <GlobalContext.Provider
      value={{
        data,
        report,
        article,
        loading,
        loadMore,
        totalCount,
        replyThreadId,
        onReplyAction,
        cancelBtnStyle,
        onSubmitAction,
        onReportAction,
        currentUserData,
        showDiscussionBox,
        onReply,
        handleSort,
        handleReply,
        handleSubmit,
        handleReaction,
        toggleDisscusionbox,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}