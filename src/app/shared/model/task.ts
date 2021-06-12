import { TaskColorEnum } from './task-color.enum';
import { TaskStatusEnum } from './task-status.enum';

export interface Task {
  id: number;
  name: string;
  tags?: string[];
  color?: TaskColorEnum;
  description?: string;
  status?: TaskStatusEnum;
  start?: number;
  stop?: number;
  duration?: number;
  times?: number;
}
