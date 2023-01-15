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
        userId,
        comId,
        text,
        parentId,
        articleId,
        timeStamp,
      }) => ({
        userId,
        comId,
        text,
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
      const payload = (({ userId, reason, ref }) => ({ userId, reason, ref }))(
        data
      );
      return await HTTP.post('/action/report', { payload });
    } catch (e) {
      return handleError(e, 'handleReport');
    }    
  }

  async handleReaction(data: IReactionData) {
    try {
      const payload = (({ userId, action, event, type, ref }) => ({
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
