import React, { createContext, useEffect, useState } from "react"

import _ from "lodash"

export const GlobalContext = createContext({})

export const GlobalProvider = ({
  loading,
  loadMore,
  children,
  articleId,
  totalCount,
  currentUser,
  commentData,
  onReplyAction,
  onReportAction,
  cancelBtnStyle,
  onSubmitAction
}: {
  loading: boolean
  articleId: string
  totalCount?: number
  children: any
  currentUser?: {
    currentUserId: string
    currentUserImg: string
    currentUserFullName: string
  } | null
  cancelBtnStyle?: object
  commentData?: Array<{
    userId: string
    comId: string
    fullName: string
    avatarUrl: string
    timeStamp: string
    text: string
    replies: Array<{
      userId: string
      comId: string
      fullName: string
      avatarUrl: string
      timeStamp: string
      text: string
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
      userId: string
      comId: string
      fullName: string
      avatarUrl: string
      timeStamp: string
      text: string
      replies: Array<{
        userId: string
        comId: string
        fullName: string
        avatarUrl: string
        timeStamp: string
        text: string
      }>
    }>
  >([])
  const [reportData, setReport] = useState<any>({})
  const [replyArr, setReply] = useState<string[]>([])
  const [showDiscussionBox, setDiscussionVisibility] = useState<Boolean>(false)

  useEffect(() => { if (commentData) setData(commentData) }, [commentData])


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
      replies: [],
      comId: uuid,
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
        onReply,
        handleSort,
        handleReply,
        handleSubmit,
        toggleDisscusionbox,
        data,
        report,
        loading,
        loadMore,
        replyArr,
        articleId,
        totalCount,
        onReplyAction,
        cancelBtnStyle,
        onSubmitAction,
        onReportAction,
        currentUserData,
        showDiscussionBox,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider
