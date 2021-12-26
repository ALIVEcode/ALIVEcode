import { RouteComponentProps } from 'react-router-dom';

type RouteProps = {
  id: string;
};

export interface QuestionProps extends RouteComponentProps<RouteProps> {};
