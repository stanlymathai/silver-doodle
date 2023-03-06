import React, { createContext, useEffect, useState } from "react"

import { IArticleData, ICommentData, ICurrentUser } from "./Interface"

export const GlobalContext = createContext({})

import moment from "moment";

export const Provider = ({
  loading,
  loadMore,
  children,
  totalCount,
  currentUser,
  commentData,
  articleData,
  onUserRection,
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
  onUserRection: Function
  onReplyAction: Function
  onSubmitAction: Function
  onReportAction: Function
}) => {
  const [currentUserData] = useState(currentUser)
  const [data, setData] = useState<Array<ICommentData>>([])
  const [reportData, setReport] = useState<any>({})
  const [alertData, setAlertData] = useState<any>({})
  const [article, setArticle] = useState<IArticleData>()
  const [replyThreadId, setReplyThread] = useState<string>("")
  const [showDiscussionBox, setDiscussionVisibility] = useState<Boolean>(false)

  useEffect(() => { if (commentData) setData(commentData) }, [commentData])
  useEffect(() => { if (articleData) setArticle(articleData) }, [articleData])

  const onReplyThread = (id: string) => setReplyThread(replyThreadId == id ? "" : id)

  const handleSubmit = (payload: any) => {
    if (currentUserData?.userId === 'GUEST')
      return alert.open({
        title: 'Alert Message',
        content: 'Please login/signup to post a comment.',
      });
  
    let commentData = {
      ...payload,
      replies: [],
      reaction: {
        like: false,
        brilliant: false,
        thoughtful: false,
      },
      reactionCount: 0,
    };
    setData([commentData, ...data]);
  };  

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
    if (currentUserData?.userId === 'GUEST')
      return alert.open({
        title: 'Alert Message',
        content: 'Please login/signup to submit reaction.',
      });
    const action = info.reaction[event] ? 'REMOVE' : 'ADD';

    const ref: string = info.comId

    let copyData = [...data]

    if (info.parentId) {
      const parentIdx = copyData.findIndex((i) => i.comId == info.parentId)
      const childIdx = copyData[parentIdx].replies.findIndex(i => i.comId == info.comId)

      copyData[parentIdx].replies[childIdx].reaction[event]
        = !copyData[parentIdx].replies[childIdx].reaction[event]

      if (action == "REMOVE") {
        copyData[parentIdx].replies[childIdx].reactionCount--
      } else
        copyData[parentIdx].replies[childIdx].reactionCount++
    } else {
      const targetIdx = copyData.findIndex((i) => i.comId == info.comId)
      copyData[targetIdx].reaction[event] = !copyData[targetIdx].reaction[event]

      if (action == "REMOVE") {
        copyData[targetIdx].reactionCount--
      } else copyData[targetIdx].reactionCount++
    }
    setData(copyData)
    onUserRection({
      ref,
      event,
      action,
      type: 'COMMENT',
      timeStamp: moment().format(),
    });
  }

  const report = {
    open: (commentData: any) => {
      if (currentUserData?.userId === 'GUEST')
        return alert.open({
          title: 'Alert Message',
          content: 'Please login/signup to report a comment.',
        });

      switchComponent('report-main');
      setReport({ timeStamp: moment().format(), ref: commentData.info.comId });
    },
    menu: (reason: string) => {
      switchComponent('report-menu');
      setReport({ reason, ...reportData });
    },
    submit: () => {
      onReportAction(reportData);
      switchComponent('feedback');
      setReport({});
    },
    close: () => {
      setReport({});
      switchComponent('close-menu');
    },
  };

  const alert = {
    open: ({title, content }: any) => {
      setAlertData({title, content})
      switchComponent('alert-modal');
    },
    
    close: () => switchComponent('close-alert'),
  };

  const switchComponent = (id: string) => document.getElementById(id)?.click()
  const toggleDisscusionbox = () => setDiscussionVisibility(!showDiscussionBox)


  const handleReply = (
    payload: any
  ) => {
    if (currentUserData?.userId === 'GUEST')
      return alert.open({
        title: 'Alert Message',
        content: 'Please login/signup to reply to a comment.',
      });

    onReplyThread("")
    let copyData = [...data]
    const targetIdx = copyData.
      findIndex((i) => i.comId == payload.parentId)

    copyData[targetIdx].replies!.push({
      ...payload,
      reaction: {
        like: false,
        brilliant: false,
        thoughtful: false
      },
      reactionCount: 0
    })
    setData(copyData)
  }
  return (
    <GlobalContext.Provider
      value={{
        data,
        alert,
        report,
        article,
        loading,
        loadMore,
        alertData,
        totalCount,
        replyThreadId,
        onReplyAction,
        onUserRection,
        onSubmitAction,
        onReportAction,
        cancelBtnStyle,
        currentUserData,
        showDiscussionBox,
        handleSort,
        handleReply,
        handleSubmit,
        onReplyThread,
        handleReaction,
        toggleDisscusionbox,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}