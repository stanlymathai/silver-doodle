import HTTP from './http.service';
import { ICommentData, IReportData, IReactionData } from './interface.service';

const handleError = (error: any, fn_name: string) =>
  console.error(fn_name, error);

class CommentDataService {
  async fetchCommentData(articleId: string, userId: string) {
    try {
      return await HTTP.get(`/comment/${articleId}/${userId}`);
    } catch (e) {
      return handleError(e, 'fetchCommentData');
    }
  }

  async handleComment(data: ICommentData) {
    try {
      const payload = (({
        text,
        comId,
        userId,
        parentId,
        articleId,
        timeStamp,
      }) => ({
        text,
        comId,
        userId,
        parentId,
        articleId,
        timeStamp,
      }))(data);
      return await HTTP.post('/comment', { payload });
    } catch (e) {
      return handleError(e, 'handleComment');
    }
  }

  async handleReport(data: IReportData) {
    try {
      const payload = (({ userId, reason, ref, timeStamp }) => ({
        ref,
        userId,
        reason,
        timeStamp,
      }))(data);
      return await HTTP.post('/action/report', { payload });
    } catch (e) {
      return handleError(e, 'handleReport');
    }
  }

  async handleReaction(data: IReactionData) {
    try {
      const payload = (({ userId, timeStamp, action, event, type, ref }) => ({
        timeStamp,
        userId,
        action,
        event,
        type,
        ref,
      }))(data);
      return await HTTP.post('/action/react', { payload });
    } catch (e) {
      return handleError(e, 'handleReaction');
    }
  }

}
export default new CommentDataService();
