// 请求响应参数（不包含data）
export interface Result {
  code: string;
  msg: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
  code: string;
}

// 分页请求参数
export interface ReqPage {
  pageNum: number;
  pageSize: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    LoginName: string;
    PassWord: string;
  }
  export interface ResLogin {
    access_token: string;
    data: string;
  }
  export interface ResAuthButtons {
    [key: string]: string[];
  }
}

// 用户管理模块
export namespace User {
  export interface ReqCsdnParams {
    Title: string;
    CreateTime: string[];
    RefreshCount: 2;
  }

  export interface ReqUserParams extends ReqPage {
    LoginName: string;
    gender: number;
    idCard: string;
    email: string;
    address: string;
    createTime: string[];
    status: number;
  }
  export interface ResUserList {
    id: string;
    LoginName: string;
    gender: number;
    user: { detail: { age: number } };
    idCard: string;
    email: string;
    address: string;
    createTime: string;
    status: number;
    avatar: string;
    photo: any[];
    children?: ResUserList[];
  }
  export interface ResStatus {
    userLabel: string;
    userValue: number;
  }
  export interface ResGender {
    genderLabel: string;
    genderValue: number;
  }
  export interface ResDepartment {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  export interface ResRole {
    id: string;
    name: string;
    children?: ResDepartment[];
  }

  //文章Model
  export interface BaseBlogModel {
    Id: string;
    Title: string;
    title: string;
    IsDel: boolean;
    CreateTime: string;
  }

  /**
   * Csdn博客
   */
  export interface Csdnblogs extends BaseBlogModel {
    img: string;
    subContent: string;
    contentUrl: string;
    author: string;
    authorManUrl: string;
    createdAt: string;
    productType: string;
    diggNum: number;
    /**
     * 点赞数
     */
    commentNum: number;
    readNum: number;
    analyzingType: any;

    //补充
    id: any;
    sufixName: string;
    downLoadImgName: string;
    /**
     * 获取时间
     */
    loadContextTime: string;
    imgBase64: string;
  }

  /**
   * Cn博客
   */
  export interface Cnblogs extends BaseBlogModel {
    title: string;
    img: string;
    subContent: string;
    contentUrl: string;
    recommendNum: number;
    author: string;
    authorManUrl: string;
    releaseTime: Date;
    commentNum: number;
    readNum: number;
    analyzingType: any;

    id: any;
    sufixName: string;
    downLoadImgName: string;
    /**
     * 获取时间
     */
    loadContextTime: string;
    imgBase64: string;
  }

  /**
   * Cn博客
   */
  export interface CodeDeaultblogs extends BaseBlogModel {
    ContentUrl: string;
    SubContent: string;
    Category: string;
    ReleaseTime: Date;
    /**
     * 阅读
     */
    ReadNum: number;
    /**
     * 评论
     */
    CommentNum: number;
    /**
     * 喜欢
     */
    LikeNum: number;
    /**
     * 收藏
     */
    CollectionNum: number;
    AnalyzingType: any;
  }

  export interface CTO51blogs extends BaseBlogModel {
    SubContent: string;
    ContentUrl: string;
    Img: string;
    KeyWords: string;
    SourceType: string;
    ReleaseTime: Date;
    AnalyzingType: any;
  }

  export interface ItHomeblogs extends BaseBlogModel {
    ContentUrl: string;
    SubContent: string;
    Tags: string;
    TagsUrl: string;
    Img: string;
    ReleaseTime: Date;
    AnalyzingType: any;
  }

  export interface JueJinblogs extends BaseBlogModel {
    Img: string;
    SubContent: string;
    ContentUrl: string;
    Author: string;
    AuthorManUrl: string;
    ReleaseTime: Date;
    CommentNum: number;
    GiveLikeNum: number;
    ReadNum: number;
    HotIndex: number;
    AnalyzingType: any;
  }

  export interface OsChinablogs extends BaseBlogModel {
    Img: string;
    SubContent: string;
    ContentUrl: string;
    Author: string;
    AuthorManUrl: string;
    ReleaseTimeStr: string;
    CommentNum: number;
    ReadNum: number;
    LikeNum: number;
    AnalyzingType: any;
  }

  export interface Segmentfaultblogs extends BaseBlogModel {
    ContentUrl: string;
    Author: string;
    Img: string;
    AuthorManUrl: string;
    ReleaseTime: Date;
    DiggNum: number;
    /**
     * 点赞数
     */
    CommentNum: number;
    AnalyzingType: any;
  }
}
