import assert from "node:assert/strict"
import test from "node:test"
import {
  completeTask,
  formatDate,
  formatSchedule,
  initialTasks,
  newDraft,
  pendingTasks,
  taskProgress,
  type StudyTask,
} from "./tasks.ts"

test("initial progress and calculus completion match the wireframe flow", () => {
  assert.deepEqual(taskProgress(initialTasks), {
    completed: 3,
    pending: 2,
    percentage: 60,
  })
  const updated = completeTask(initialTasks, "calculus")
  assert.deepEqual(taskProgress(updated), {
    completed: 4,
    pending: 1,
    percentage: 80,
  })
  assert.equal(
    updated.find((task) => task.id === "calculus")?.status,
    "Completed",
  )
  assert.equal(
    updated.find((task) => task.id === "programming")?.status,
    "Incomplete",
  )
  assert.equal(initialTasks[0].status, "Incomplete")
})

test("new tasks retain their form data and update pending counts", () => {
  const saved: StudyTask = {
    ...newDraft(),
    id: "new-task",
    title: "Physics review",
    description: "Review Newton’s laws.",
    subject: "Physics",
    status: "In progress",
    scheduledDate: "2026-10-10",
    scheduledTime: "09:30",
    deadline: "2026-10-11",
  }
  const tasks = [...initialTasks, saved]
  assert.deepEqual(taskProgress(tasks), {
    completed: 3,
    pending: 3,
    percentage: 50,
  })
  assert.deepEqual(
    tasks.find((task) => task.id === saved.id),
    saved,
  )
  assert.equal(pendingTasks(tasks)[2]?.id, saved.id)
  assert.equal(formatDate(saved.deadline), "October 11, 2026")
  assert.equal(formatSchedule(saved), "October 10, 2026, 9:30 AM")
})

test("repeated completion does not double count or overwrite activity timestamps", () => {
  const once = completeTask(initialTasks, "programming")
  const twice = completeTask(once, "programming")
  assert.deepEqual(twice, once)
  assert.equal(taskProgress(twice).completed, 4)
  assert.ok(!pendingTasks(twice).some((task) => task.id === "programming"))
})

test("empty and fully completed task lists produce valid progress", () => {
  assert.deepEqual(taskProgress([]), {
    completed: 0,
    pending: 0,
    percentage: 0,
  })
  const allDone = initialTasks.reduce(
    (tasks, task) => completeTask(tasks, task.id),
    initialTasks,
  )
  assert.deepEqual(taskProgress(allDone), {
    completed: 5,
    pending: 0,
    percentage: 100,
  })
  assert.deepEqual(pendingTasks(allDone), [])
})
