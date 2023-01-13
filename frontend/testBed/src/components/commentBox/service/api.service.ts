import HTTP from './http.service';
import { ICommentData, IReportData, IReactionData } from './interface.service';

const handleError = (error: any, fn_name: string) =>
  console.error(fn_name, error);

class CommentDataService {
  async fetchCommentData(articleId: string) {
    try {
      return await HTTP.get(`/comment/${articleId}`);
    } catch (e) {
      return handleError(e, 'fetchCommentData');
    }
  }

  async handleReport(data: IReportData) {
    try {
      const payload = (({ reason, ref }) => ({ reason, ref }))(data);
      return await HTTP.post('/action/report', { payload });
    } catch (e) {
      return handleError(e, 'handleReport');
    }
  }

  async handleReaction(data: IReactionData) {
    try {
      const payload = (({ action, event, type, ref }) => ({
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

  async handleComment(payload: ICommentData) {
    try {
      return await HTTP.post('/comment', { payload });
    } catch (e) {
      return handleError(e, 'handleComment');
    }
  }
}
export default new CommentDataService();
