import React, { createContext, useEffect, useState } from "react"

import _ from "lodash"

export const GlobalContext = createContext({})

export const GlobalProvider = ({
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
  articleData?: {
    articleId: string
    reaction: {
      like: boolean
      brilliant: boolean
      thoughtful: boolean
    }
  }
  totalCount?: number
  children: any
  currentUser?: {
    currentUserId: string
    currentUserImg: string
    currentUserFullName: string
  }
  cancelBtnStyle?: object
  commentData?: Array<{
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
  }>
  loadMore?: Function
  onReportAction: Function
  onReplyAction?: Function
  onSubmitAction?: Function
}) => {
  const [currentUserData] = useState(currentUser)
  const [data, setData] = useState<
    Array<{
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
      };
      replies: Array<{
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
      }>
    }>
  >([])
  const [reportData, setReport] = useState<any>({})
  const [article, setArticle] = useState<{
    articleId: string
    reaction: {
      like: boolean
      brilliant: boolean
      thoughtful: boolean
    }
  }>({
    articleId: '###',
    reaction: {
      like: false,
      brilliant: false,
      thoughtful: false
    }
  })
  const [replyArr, setReply] = useState<string[]>([])
  const [showDiscussionBox, setDiscussionVisibility] = useState<Boolean>(false)

  useEffect(() => { if (commentData) setData(commentData) }, [commentData])
  useEffect(() => { if (articleData) setArticle(articleData) }, [articleData])


  const handleReply = (id: string) => {
    let replyArrCopy: string[] = [...replyArr]
    let indexOfId = _.indexOf(replyArrCopy, id)
    if (_.includes(replyArr, id)) {
      replyArrCopy.splice(indexOfId, 1)
      setReply(replyArrCopy)
    } else {
      replyArrCopy.push(id)
      setReply(replyArrCopy)
    }
  }

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
  const handleReaction = (reaction: any, info: any) => {
    console.log(reaction, "reaction from provider")
    console.log(info, "info from provider")

    const ref = info.comId ?? info.articleId
    const type = info.comId ? "COMMENT" : "ARTICLE"
    const action = info[reaction] ? "REMOVE" : "ADD"
    const payload = { ref, type, action, reaction }

    switch (type) {
      case "COMMENT":
        let copyData = [...data]

        const targetIndex = copyData.findIndex((i) => i.comId == info.comId)

        copyData[targetIndex].reaction[reaction] = !copyData[targetIndex].reaction[reaction]

        setData(copyData)
        break;
      case "ARTICLE":

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
      switchComponent("feedback")
      onReportAction(reportData)
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
    parentId: string,
    timeStamp: string
  ) => {
    let copyData = [...data]
    if (parentId) {
      const indexOfParent = _.findIndex(copyData, { comId: parentId })
      copyData[indexOfParent].replies!.push({
        reaction: {
          like: false,
          brilliant: false,
          thoughtful: false
        },
        text,
        timeStamp,
        comId: uuid,
        userId: currentUserData!.currentUserId,
        avatarUrl: currentUserData!.currentUserImg,
        fullName: currentUserData!.currentUserFullName
      })
      setData(copyData)
      handleReply(comId)
    } else {
      const indexOfId = _.findIndex(copyData, { comId })
      copyData[indexOfId].replies!.push({
        reaction: {
          like: false,
          brilliant: false,
          thoughtful: false
        },
        text,
        timeStamp,
        comId: uuid,
        userId: currentUserData!.currentUserId,
        avatarUrl: currentUserData!.currentUserImg,
        fullName: currentUserData!.currentUserFullName
      })
      setData(copyData)
      handleReply(comId)
    }
  }
  return (
    <GlobalContext.Provider
      value={{
        data,
        report,
        article,
        loading,
        loadMore,
        replyArr,
        totalCount,
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

export default GlobalProvider
