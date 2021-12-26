import { RouteComponentProps } from 'react-router-dom';

type RouteProps = {
  id: string;
};

export interface SubjectProps extends RouteComponentProps<RouteProps> {};
