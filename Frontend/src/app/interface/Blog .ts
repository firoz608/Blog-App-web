export interface Blog {
  userId: number;
  title: string;
  content: string;
  likes: number;
  isLiked: boolean;
  author:string;
  createdDate: string;
  image: string;
  comments: number;
  saved: boolean;
}