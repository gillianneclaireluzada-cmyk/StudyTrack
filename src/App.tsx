import { FormEvent, ReactNode, useState } from "react"
import {
  completeTask,
  formatDate,
  formatSchedule,
  formatTime,
  initialTasks,
  newDraft,
  pendingTasks,
  taskProgress,
  type StudyTask,
  type TaskDraft,
  type TaskStatus,
} from "./tasks"

type Screen = "login" | "dashboard" | "add-task" | "schedule" | "upcoming" | "details" | "progress"

type IconName = "arrow-left" | "arrow-right" | "book" | "calendar" | "check" | "clock" | "home" | "list" | "plus" | "target" | "user"

function Icon({
  name,
  className = "size-5",
}: {
  name: IconName
  className?: string
}) {
  const paths: Record<IconName, ReactNode> = {
    "arrow-left": <path d="m15 18-6-6 6-6" />,
    "arrow-right": <path d="m9 18 6-6-6-6" />,
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </>
    ),
    calendar: (
      <>
        <path d="M8 2v4M16 2v4M3 10h18" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10M9 20v-6h6v6" />
      </>
    ),
    list: (
      <>
        <path d="M9 6h11M9 12h11M9 18h11" />
        <path d="M4 6h.01M4 12h.01M4 18h.01" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
  }

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <div className="mt-2 flex items-center gap-3">
      <div
        className={`grid size-11 place-items-center rounded-xl ${
          light ? "bg-white/10 text-amber-300" : "bg-navy text-amber"
        }`}
      >
        <Icon name="book" className="size-5" />
      </div>
      <div>
        <p
          className={`font-display text-base font-extrabold tracking-tight ${
            light ? "text-white" : "text-navy"
          }`}
        >
          CSU
        </p>
        <p
          className={`text-[9px] font-bold uppercase tracking-[0.22em] ${
            light ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Study Track
        </p>
      </div>
    </div>
  )
}

const navItems: { screen: Screen label: string icon: IconName }[] = [
  { screen: "dashboard", label: "Dashboard", icon: "home" },
  { screen: "upcoming", label: "Subjects", icon: "book" },
  { screen: "upcoming", label: "Tasks", icon: "list" },
  { screen: "progress", label: "Progress", icon: "target" },
]

function AppShell({
  children,
  screen,
  onNavigate,
  title,
  eyebrow,
  progress,
}: {
  children: ReactNode
  screen: Screen
  onNavigate: (screen: Screen) => void
  title: string
  eyebrow: string
  progress: ReturnType<typeof taskProgress>
}) {
  return (
    <div className="tech-canvas min-h-screen bg-cream text-ink lg:flex">
      <aside className="tech-dark hidden w-64 shrink-0 flex-col bg-navy px-5 py-7 lg:flex">
        <Brand light />
        <nav className="mt-12 space-y-2" aria-label="Main navigation">
          {navItems.map((item, index) => {
            const active =
              item.screen === screen ||
              (screen === "details" && item.label === "Tasks") ||
              (["add-task", "schedule"].includes(screen) &&
                item.label === "Tasks")
            return (
              <button
                key={`${item.label}-${index}`}
                onClick={() => onNavigate(item.screen)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  active && (item.label !== "Subjects" || screen === "upcoming")
                    ? "bg-white text-navy shadow-sm"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon name={item.icon} className="size-5" />
                {item.label}
              </button>
            )
          })}
        </nav>
        <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-300">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
            <Icon name="target" className="size-4 text-amber-300" />
            Weekly goal
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-amber-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <p className="mt-2 text-xs">
            You’re {progress.percentage}% of the way there.
          </p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="border-b border-line bg-cream/90 px-5 py-4 backdrop-blur md:px-8 lg:px-12">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div className="lg:hidden">
              <Brand />
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">
                {eyebrow}
              </p>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-navy">
                {title}
              </h1>
            </div>
            <button className="flex items-center gap-3 rounded-full border border-line bg-white py-1.5 pl-1.5 pr-4 text-sm font-bold text-navy shadow-sm">
              <span className="grid size-8 place-items-center rounded-full bg-powder">
                <Icon name="user" className="size-4" />
              </span>
              <span className="hidden sm:inline">Alex Morgan</span>
            </button>
          </div>
        </header>

        <main className="px-5 py-7 md:px-8 md:py-10 lg:px-12">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>

        <nav className="fixed inset-x-3 bottom-3 z-20 flex justify-around rounded-2xl border border-white/10 bg-navy p-2 shadow-2xl lg:hidden">
          {[navItems[0], navItems[2], navItems[3]].map((item) => {
            const active =
              item.screen === screen ||
              (screen === "details" && item.screen === "upcoming") ||
              (["add-task", "schedule"].includes(screen) &&
                item.screen === "upcoming")
            return (
              <button
                key={item.label}
                onClick={() => onNavigate(item.screen)}
                className={`flex min-w-20 flex-col items-center gap-1 rounded-xl px-3 py-2 text-[10px] font-bold ${
                  active ? "bg-white text-navy" : "text-slate-300"
                }`}
              >
                <Icon name={item.icon} className="size-5" />
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
}: {
  children: ReactNode
  onClick?: () => void
  type?: "button" | "submit"
  variant?: "primary" | "secondary" | "ghost"
  className?: string
}) {
  const styles = {
    primary:
      "bg-navy text-white shadow-lg shadow-navy/10 hover:-translate-y-0.5 hover:bg-ink",
    secondary: "bg-amber text-navy hover:-translate-y-0.5 hover:bg-amber-dark",
    ghost: "border border-line bg-white text-navy hover:border-navy",
  }
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-extrabold transition ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: ReactNode
  hint?: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-extrabold text-navy">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-2 block text-xs text-slate-500">{hint}</span>
      )}
    </label>
  )
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [isCreating, setIsCreating] = useState(false)

  function submit(event: FormEvent) {
    event.preventDefault()
    onLogin()
  }

  return (
    <main className="tech-canvas grid min-h-screen bg-cream lg:grid-cols-[1.05fr_0.95fr]">
      <section className="tech-dark relative hidden overflow-hidden bg-navy p-12 text-white lg:flex lg:flex-col">
        <div className="my-auto max-w-xl self-center text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
            <span className="size-1.5 rounded-full bg-amber-300" />
            Build your path. Shape your future.
          </div>
          <h1 className="font-display text-6xl font-extrabold leading-[1.05] tracking-tight">
            Stay focused on
            <span className="block font-serif italic text-amber-300">
              what matters.
            </span>
          </h1>
          <p className="mx-auto mt-7 max-w-md text-lg leading-8 text-slate-300">
            The digital study workspace for CSU STUDENTS.
          </p>
        </div>
        <div className="absolute -bottom-24 -right-24 size-80 rounded-full border-[70px] border-white/[0.03]" />
      </section>

      <section className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="mb-12 lg:hidden">
            <Brand />
          </div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-coral">
            {isCreating ? "Start your journey" : "Welcome back"}
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-navy">
            {isCreating ? "Create your account" : "Student login"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {isCreating
              ? "Set up your CSU Study Track account in just a moment."
              : "Enter your details to return to your study space."}
          </p>

          <form onSubmit={submit} className="mt-9 space-y-5">
            {isCreating && (
              <Field label="Full name">
                <input className="field" placeholder="Alex Morgan" required />
              </Field>
            )}
            <Field label="Email or username">
              <input
                className="field"
                type="email"
                placeholder="alex@university.edu"
                required
              />
            </Field>
            <Field label="Password">
              <input
                className="field"
                type="password"
                placeholder="Enter your password"
                required
              />
            </Field>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 font-semibold text-slate-600">
                <input type="checkbox" className="size-4 accent-navy" />
                Remember me
              </label>
              <button
                type="button"
                className="font-bold text-coral hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <Button type="submit" className="w-full">
              {isCreating ? "Create account" : "Log in"}
              <Icon name="arrow-right" className="size-4" />
            </Button>
          </form>
          <p className="mt-7 text-center text-sm text-slate-500">
            {isCreating
              ? "Already have an account?"
              : "New to CSU Study Track?"}{" "}
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="font-extrabold text-navy underline decoration-amber decoration-2 underline-offset-4"
            >
              {isCreating ? "Log in" : "Create account"}
            </button>
          </p>
        </div>
      </section>
    </main>
  )
}

function Dashboard({
  onAdd,
  onViewTasks,
  tasks,
  onView,
}: {
  onAdd: () => void
  onViewTasks: () => void
  tasks: StudyTask[]
  onView: (id: string) => void
}) {
  const progress = taskProgress(tasks)
  const upcoming = pendingTasks(tasks)
  return (
    <>
      <section className="grid gap-5 lg:grid-cols-[1.45fr_0.75fr]">
        <div className="tech-dark relative overflow-hidden rounded-3xl bg-navy p-7 text-white md:p-10">
          <p className="text-sm font-bold text-amber-300">Monday, October 7</p>
          <h2 className="mt-4 max-w-lg font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            Good afternoon, Alex.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
            {progress.pending
              ? `You have ${progress.pending} task${
                  progress.pending === 1 ? "" : "s"
                } ahead. Keep your momentum going.`
              : "You’re all caught up. Great work!"}
          </p>
          <Button variant="secondary" onClick={onAdd} className="mt-8">
            <Icon name="plus" className="size-4" />
            Add study task
          </Button>
          <div className="absolute -bottom-20 -right-20 size-60 rounded-full border-[50px] border-white/[0.04]" />
        </div>

        <div className="rounded-3xl border border-line bg-white p-7 shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                This week
              </p>
              <p className="mt-2 font-display text-4xl font-extrabold text-navy">
                {progress.percentage}%
              </p>
            </div>
            <span className="grid size-11 place-items-center rounded-2xl bg-mint text-navy">
              <Icon name="target" />
            </span>
          </div>
          <div className="mt-8 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-coral"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <div className="mt-5 flex justify-between text-xs font-bold text-slate-500">
            <span>{progress.completed} completed</span>
            <span>{progress.pending} pending</span>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.45fr_0.75fr]">
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card md:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-kicker">Next up</p>
              <h2 className="section-title">Upcoming tasks</h2>
            </div>
            <button
              onClick={onViewTasks}
              className="text-sm font-extrabold text-coral hover:underline"
            >
              View all
            </button>
          </div>
          <div className="mt-6 space-y-3">
            {upcoming.slice(0, 2).map((task) => (
              <button
                key={task.id}
                onClick={() => onView(task.id)}
                className="group flex w-full items-center gap-4 rounded-2xl border border-line p-4 text-left transition hover:border-coral/40 hover:bg-coral/[0.03]"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-amber-soft text-navy">
                  <span className="font-display text-xs font-extrabold">
                    {new Date(`${task.deadline}T12:00:00`)
                      .toLocaleDateString("en-US", { month: "short" })
                      .toUpperCase()}
                    <br />
                    {new Date(`${task.deadline}T12:00:00`).getDate()}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-base font-extrabold text-navy">
                    {task.title}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {task.subject} · {formatTime(task.scheduledTime)}
                  </span>
                </span>
                <span className="rounded-full bg-coral-soft px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-coral">
                  {task.status}
                </span>
              </button>
            ))}
            {!upcoming.length && (
              <p className="text-sm text-slate-500">
                No upcoming tasks. Add a task to plan your next study session.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-amber-soft p-7">
          <span className="grid size-11 place-items-center rounded-2xl bg-amber text-navy">
            <Icon name="book" />
          </span>
          <p className="mt-7 font-display text-lg font-extrabold text-navy">
            Study tip
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Break large assignments into 25-minute focus sessions for steady
            progress.
          </p>
          <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.15em] text-coral">
            Small steps, big wins
          </p>
        </div>
      </section>
    </>
  )
}

function StepHeader({
  step,
  title,
  description,
}: {
  step: string
  title: string
  description: string
}) {
  return (
    <div className="mb-8">
      <p className="section-kicker">{step}</p>
      <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  )
}

function AddTask({
  onNext,
  onCancel,
  draft,
  onChange,
}: {
  onNext: () => void
  onCancel: () => void
  draft: TaskDraft
  onChange: (changes: Partial<TaskDraft>) => void
}) {
  function submit(event: FormEvent) {
    event.preventDefault()
    onNext()
  }
  return (
    <div className="mx-auto max-w-3xl pb-24">
      <StepHeader
        step="Step 1 of 2"
        title="Add a study task"
        description="Capture the essentials first. You’ll set the schedule and deadline on the next step."
      />
      <div className="mb-7 flex items-center gap-3">
        <div className="h-1.5 flex-1 rounded-full bg-navy" />
        <div className="h-1.5 flex-1 rounded-full bg-line" />
      </div>
      <form
        onSubmit={submit}
        className="rounded-3xl border border-line bg-white p-6 shadow-card md:p-9"
      >
        <div className="space-y-6">
          <Field label="Task title" hint="Keep it clear and actionable.">
            <input
              className="field"
              value={draft.title}
              onChange={(event) => onChange({ title: event.target.value })}
              placeholder="e.g. Calculus assignment"
              required
              pattern=".*\S.*"
              title="Enter a task title containing at least one non-space character."
            />
          </Field>
          <Field label="Description">
            <textarea
              className="field min-h-32 resize-none"
              value={draft.description}
              onChange={(event) =>
                onChange({ description: event.target.value })
              }
            />
          </Field>
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Subject">
              <select
                className="field"
                value={draft.subject}
                onChange={(event) => onChange({ subject: event.target.value })}
              >
                <option>Differential Calculus</option>
                <option>Computer Science</option>
                <option>Academic Writing</option>
                <option>Physics</option>
              </select>
            </Field>
            <Field label="Status">
              <select
                className="field"
                value={draft.status}
                onChange={(event) =>
                  onChange({ status: event.target.value as TaskStatus })
                }
              >
                <option>Incomplete</option>
                <option>In progress</option>
                <option>Completed</option>
              </select>
            </Field>
          </div>
        </div>
        <div className="mt-9 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Continue
            <Icon name="arrow-right" className="size-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}

function Schedule({
  onBack,
  onSave,
  draft,
  onChange,
}: {
  onBack: () => void
  onSave: () => void
  draft: TaskDraft
  onChange: (changes: Partial<TaskDraft>) => void
}) {
  return (
    <div className="mx-auto max-w-3xl pb-24">
      <StepHeader
        step="Step 2 of 2"
        title="Set schedule & deadline"
        description="Choose a focused study window and give yourself a clear finish line."
      />
      <div className="mb-7 flex items-center gap-3">
        <div className="h-1.5 flex-1 rounded-full bg-navy" />
        <div className="h-1.5 flex-1 rounded-full bg-navy" />
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          onSave()
        }}
        className="rounded-3xl border border-line bg-white p-6 shadow-card md:p-9"
      >
        <div className="mb-8 flex items-center gap-4 rounded-2xl bg-amber-soft p-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-amber text-navy">
            <Icon name="book" className="size-5" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Scheduling
            </p>
            <p className="mt-1 font-display font-extrabold text-navy">
              {draft.title}
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Scheduled date">
            <input
              className="field"
              type="date"
              required
              value={draft.scheduledDate}
              onChange={(event) =>
                onChange({ scheduledDate: event.target.value })
              }
            />
          </Field>
          <Field label="Scheduled time">
            <input
              className="field"
              type="time"
              required
              value={draft.scheduledTime}
              onChange={(event) =>
                onChange({ scheduledTime: event.target.value })
              }
            />
          </Field>
          <div className="md:col-span-2">
            <Field
              label="Deadline"
              hint="Choose a deadline on or after your scheduled study date."
            >
              <input
                className="field"
                type="date"
                required
                min={draft.scheduledDate}
                value={draft.deadline}
                onChange={(event) => onChange({ deadline: event.target.value })}
              />
            </Field>
          </div>
        </div>
        <div className="mt-9 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onBack}>
            <Icon name="arrow-left" className="size-4" />
            Back
          </Button>
          <Button type="submit">
            <Icon name="check" className="size-4" />
            Save task
          </Button>
        </div>
      </form>
    </div>
  )
}

function Upcoming({
  tasks,
  onView,
  onAdd,
}: {
  tasks: StudyTask[]
  onView: (id: string) => void
  onAdd: () => void
}) {
  const ordered = [...tasks].sort(
    (a, b) =>
      Number(a.status === "Completed") - Number(b.status === "Completed") ||
      a.deadline.localeCompare(b.deadline),
  )
  return (
    <div className="pb-24">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <StepHeader
          step="Your plan"
          title="Upcoming tasks"
          description="Everything you need to focus on next, ordered by deadline."
        />
        <Button onClick={onAdd} className="mb-8 self-start sm:self-auto">
          <Icon name="plus" className="size-4" />
          Add task
        </Button>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {ordered.map((task, index) => (
          <article
            key={task.id}
            className="overflow-hidden rounded-3xl border border-line bg-white shadow-card"
          >
            <div
              className={`h-2 ${index % 2 === 0 ? "bg-amber" : "bg-blue-300"}`}
            />
            <div className="p-6 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <span
                  className={`grid size-12 place-items-center rounded-2xl text-navy ${
                    index % 2 === 0 ? "bg-amber-soft" : "bg-powder"
                  }`}
                >
                  <Icon name={index === 0 ? "book" : "list"} />
                </span>
                <span className="rounded-full bg-coral-soft px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-coral">
                  {task.status}
                </span>
              </div>
              <h2 className="mt-6 font-display text-xl font-extrabold text-navy">
                {task.title}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{task.subject}</p>
              <div className="mt-6 space-y-3 border-y border-line py-5 text-sm">
                <div className="flex items-center gap-3 text-slate-600">
                  <Icon name="clock" className="size-4 text-coral" />
                  <span>{formatSchedule(task)}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Icon name="calendar" className="size-4 text-coral" />
                  <span>Deadline: {formatDate(task.deadline)}</span>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <span className="size-2 rounded-full bg-coral" />
                  {task.status}
                </span>
                <Button variant="ghost" onClick={() => onView(task.id)}>
                  View task
                  <Icon name="arrow-right" className="size-4" />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function Details({
  task,
  tasks,
  onBack,
  onComplete,
}: {
  task: StudyTask
  tasks: StudyTask[]
  onBack: () => void
  onComplete: () => void
}) {
  const projected = taskProgress(completeTask(tasks, task.id)).percentage
  return (
    <div className="mx-auto max-w-4xl pb-24">
      <button
        onClick={onBack}
        className="mb-7 inline-flex items-center gap-2 text-sm font-extrabold text-slate-500 hover:text-navy"
      >
        <Icon name="arrow-left" className="size-4" />
        Back to tasks
      </button>
      <article className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
        <div className="bg-navy p-7 text-white md:p-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">
                Task details
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight">
                {task.title}
              </h2>
              <p className="mt-2 text-sm text-slate-300">{task.subject}</p>
            </div>
            <span className="self-start rounded-full border border-coral/30 bg-coral/15 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-orange-200">
              {task.status}
            </span>
          </div>
        </div>
        <div className="grid gap-8 p-7 md:grid-cols-[1.2fr_0.8fr] md:p-10">
          <div>
            <p className="section-kicker">Description</p>
            <p className="mt-3 text-base leading-7 text-slate-600">
              {task.description || "No description provided."}
            </p>
            <div className="mt-8 rounded-2xl bg-amber-soft p-5">
              <p className="text-sm font-extrabold text-navy">
                {task.status === "Completed"
                  ? "Task completed"
                  : "Ready to wrap this up?"}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                {task.status === "Completed"
                  ? "This task is already included in your progress."
                  : `Completing this task will update your progress dashboard to ${projected}%.`}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4 rounded-2xl border border-line p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-powder text-navy">
                <ClockIcon />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Schedule
                </p>
                <p className="mt-1 text-sm font-bold text-navy">
                  {formatSchedule(task)}
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-2xl border border-line p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-coral-soft text-coral">
                <Icon name="calendar" className="size-4" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Deadline
                </p>
                <p className="mt-1 text-sm font-bold text-navy">
                  {formatDate(task.deadline)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end border-t border-line bg-slate-50 p-6 md:px-10">
          <Button onClick={onComplete} className="w-full sm:w-auto">
            <Icon name="check" className="size-4" />
            {task.status === "Completed" ? "View progress" : "Mark as complete"}
          </Button>
        </div>
      </article>
    </div>
  )
}

function ClockIcon() {
  return <Icon name="clock" className="size-4" />
}

function Progress({
  tasks,
  onBack,
}: {
  tasks: StudyTask[]
  onBack: () => void
}) {
  const progress = taskProgress(tasks)
  const latest = tasks
    .filter((task) => task.status === "Completed")
    .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))[0]
  return (
    <div className="pb-24">
      <StepHeader
        step="Keep going"
        title="Study progress"
        description="A clear view of your momentum across every subject and task."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {[
          [
            String(progress.completed),
            "Completed tasks",
            "bg-mint",
            "check" as IconName,
          ],
          [
            String(progress.pending),
            "Pending tasks",
            "bg-amber-soft",
            "clock" as IconName,
          ],
          [
            `${progress.percentage}%`,
            "Overall progress",
            "bg-powder",
            "target" as IconName,
          ],
        ].map(([value, label, color, icon]) => (
          <div
            key={label as string}
            className="rounded-3xl border border-line bg-white p-6 shadow-card"
          >
            <div
              className={`grid size-11 place-items-center rounded-2xl text-navy ${color}`}
            >
              <Icon name={icon as IconName} className="size-5" />
            </div>
            <p className="mt-6 font-display text-4xl font-extrabold text-navy">
              {value}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-line bg-white p-6 shadow-card md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-kicker">Overall</p>
              <h2 className="section-title">Goal progress</h2>
            </div>
            <span className="font-display text-2xl font-extrabold text-coral">
              {progress.percentage}%
            </span>
          </div>
          <div className="mt-7 h-4 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-coral"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <div className="mt-4 flex justify-between text-xs font-bold text-slate-400">
            <span>0%</span>
            <span>Weekly target</span>
            <span>100%</span>
          </div>
          <div className="mt-8 rounded-2xl bg-mint p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-navy text-white">
                <Icon name="check" className="size-4" />
              </span>
              <div>
                <p className="font-display text-sm font-extrabold text-navy">
                  Great work, Alex.
                </p>
                <p className="mt-0.5 text-xs text-slate-600">
                  {progress.pending
                    ? `${progress.pending} task${
                        progress.pending === 1 ? "" : "s"
                      } left to complete your plan.`
                    : "All tasks completed. You’ve reached your goal!"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-line bg-white p-6 shadow-card md:p-8">
          <p className="section-kicker">Latest update</p>
          <h2 className="section-title">Recent activity</h2>
          <div className="mt-7 flex gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-mint text-navy">
              <Icon name="check" className="size-5" />
            </span>
            <div>
              <p className="font-display text-sm font-extrabold text-navy">
                {latest?.title ?? "No completed tasks yet"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {latest
                  ? "Marked as completed"
                  : "Your completed tasks will appear here."}
              </p>
              {latest && (
                <span className="mt-3 inline-block rounded-full bg-mint px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                  Completed
                </span>
              )}
            </div>
          </div>
          <Button variant="ghost" onClick={onBack} className="mt-8 w-full">
            <Icon name="arrow-left" className="size-4" />
            Back to dashboard
          </Button>
        </section>
      </div>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("login")
  const [tasks, setTasks] = useState<StudyTask[]>(initialTasks)
  const [draft, setDraft] = useState<TaskDraft>(newDraft)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedTask = tasks.find((task) => task.id === selectedId)

  function updateDraft(changes: Partial<TaskDraft>) {
    setDraft((current) => ({ ...current, ...changes }))
  }

  function addTask() {
    setDraft(newDraft())
    setScreen("add-task")
  }

  function viewTask(id: string) {
    setSelectedId(id)
    setScreen("details")
  }

  function saveTask() {
    const task: StudyTask = {
      ...draft,
      title: draft.title.trim(),
      id: crypto.randomUUID(),
      ...(draft.status === "Completed" ? { completedAt: Date.now() } : {}),
    }
    setTasks((current) => [...current, task])
    setDraft(newDraft())
    setScreen("upcoming")
  }

  function markComplete() {
    if (!selectedId) return
    setTasks((current) => completeTask(current, selectedId))
    setScreen("progress")
  }

  if (screen === "login") {
    return <Login onLogin={() => setScreen("dashboard")} />
  }

  const headings: Record<Exclude<Screen, "login">, [string, string]> = {
    dashboard: ["Your workspace", "Dashboard"],
    "add-task": ["Plan your work", "New task"],
    schedule: ["Plan your time", "Schedule"],
    upcoming: ["Stay organized", "Tasks"],
    details: ["Task overview", "Details"],
    progress: ["Your momentum", "Progress"],
  }
  const [eyebrow, title] = headings[screen]

  return (
    <AppShell
      screen={screen}
      onNavigate={setScreen}
      title={title}
      eyebrow={eyebrow}
      progress={taskProgress(tasks)}
    >
      {screen === "dashboard" && (
        <Dashboard
          tasks={tasks}
          onAdd={addTask}
          onView={viewTask}
          onViewTasks={() => setScreen("upcoming")}
        />
      )}
      {screen === "add-task" && (
        <AddTask
          draft={draft}
          onChange={updateDraft}
          onNext={() => setScreen("schedule")}
          onCancel={() => setScreen("dashboard")}
        />
      )}
      {screen === "schedule" && (
        <Schedule
          draft={draft}
          onChange={updateDraft}
          onBack={() => setScreen("add-task")}
          onSave={saveTask}
        />
      )}
      {screen === "upcoming" && (
        <Upcoming tasks={tasks} onView={viewTask} onAdd={addTask} />
      )}
      {screen === "details" && selectedTask && (
        <Details
          task={selectedTask}
          tasks={tasks}
          onBack={() => setScreen("upcoming")}
          onComplete={markComplete}
        />
      )}
      {screen === "progress" && (
        <Progress tasks={tasks} onBack={() => setScreen("dashboard")} />
      )}
    </AppShell>
  )
}
