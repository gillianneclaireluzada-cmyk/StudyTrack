export type TaskStatus = "Incomplete" | "In progress" | "Completed"

export type TaskDraft = {
  title: string
  description: string
  subject: string
  status: TaskStatus
  scheduledDate: string
  scheduledTime: string
  deadline: string
}

export type StudyTask = TaskDraft & {
  id: string
  completedAt?: number
}

export function newDraft(): TaskDraft {
  return {
    title: "",
    description: "",
    subject: "Differential Calculus",
    status: "Incomplete",
    scheduledDate: "2026-10-07",
    scheduledTime: "19:00",
    deadline: "2026-10-08",
  }
}

export const initialTasks: StudyTask[] = [
  {
    ...newDraft(),
    id: "calculus",
    title: "Calculus assignment",
    description:
      "Complete the assigned calculus problems. Review derivatives and show your work for each solution.",
  },
  {
    ...newDraft(),
    id: "programming",
    title: "Programming activity",
    description: "Complete the programming exercise and test your solution.",
    subject: "Computer Science",
    scheduledDate: "2026-10-08",
    scheduledTime: "16:30",
    deadline: "2026-10-09",
  },
  ...["Derivative review", "Algorithm exercises", "Writing outline"].map(
    (title, index): StudyTask => ({
      ...newDraft(),
      id: `completed-${index}`,
      title,
      description: "Completed study session.",
      subject: [
        "Differential Calculus",
        "Computer Science",
        "Academic Writing",
      ][index],
      status: "Completed",
      completedAt: new Date(`2026-10-0${index + 1}T12:00:00`).getTime(),
    }),
  ),
]

export function taskProgress(tasks: StudyTask[]) {
  const completed = tasks.filter((task) => task.status === "Completed").length
  return {
    completed,
    pending: tasks.length - completed,
    percentage: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
  }
}

export function completeTask(tasks: StudyTask[], id: string): StudyTask[] {
  return tasks.map((task) =>
    task.id === id && task.status !== "Completed"
      ? { ...task, status: "Completed", completedAt: Date.now() }
      : task,
  )
}

export function pendingTasks(tasks: StudyTask[]) {
  return tasks
    .filter((task) => task.status !== "Completed")
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
}

export function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function formatTime(time: string) {
  return new Date(`2000-01-01T${time}:00`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
}

export function formatSchedule(task: TaskDraft) {
  return `${formatDate(task.scheduledDate)}, ${formatTime(task.scheduledTime)}`
}
