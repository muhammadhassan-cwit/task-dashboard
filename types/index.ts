export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
    id: string;
    title: string;
    priority: Priority;
    completed: boolean;
    dueDate: string;
}