import http from "./http.service";
import { ICommentData } from "./interface.service"

class CommentDataService {
  getAll(articleId: string) {
    return http.get<Array<ICommentData>>(`/comment/${articleId}`);
  }

  submit(data: ICommentData) {
    console.log("check submit, ", data);

    return http.post<ICommentData>("/comment", { payload: data });
  }

  reply(data: ICommentData) {
    console.log("check reply, ", data);
  }

  get(id: string) {
    return http.get<ICommentData>(`/comment/${id}`);
  }

  create(data: ICommentData) {
    return http.post<ICommentData>("/comment", data);
  }

  update(data: ICommentData, id: any) {
    return http.put<any>(`/comment/${id}`, data);
  }

  findByArticle(article: string) {
    return http.get<Array<ICommentData>>(`/comment?article=${article}`);
  }
}

export default new CommentDataService();