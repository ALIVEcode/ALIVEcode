import { RouteComponentProps } from 'react-router-dom';

type RouteProps = {
  id: string;
};

export interface QuizCategoryProps extends RouteComponentProps<RouteProps> {};
