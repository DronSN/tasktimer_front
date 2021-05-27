import { TaskColor } from './taskColor';
import { TaskStatus } from './TaskStatus';

export interface Task {
  id: number;
  name: string;
  tags?: string[];
  color?: TaskColor;
  description?: string;
  status?: TaskStatus;
  start?: number;
  end?: number;
}
