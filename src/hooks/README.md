# useTask Hook

一个通用的任务管理 Hook，提供完整的 CRUD 操作，支持 API 调用。

## 特性

- ✅ 完整的任务 CRUD 操作
- ✅ 支持 API 调用
- ✅ 自动错误处理和用户提示
- ✅ 加载状态管理
- ✅ 与当前任务状态同步
- ✅ TypeScript 类型安全

## 基本用法

### 基本使用（推荐用于生产环境）

```tsx
import useTask from "@/hooks/useTask";

function TaskManager() {
  const {
    tasks,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
  } = useTask();

  const handleAddTask = async () => {
    try {
      await addTask({
        title: "新任务",
        description: "任务描述",
        quadrant: "q1",
        skillIds: ["1", "2"],
      });
    } catch (error) {
      // 错误已在 hook 中处理
      console.error("添加任务失败:", error);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {isLoading && <div className="loading">加载中...</div>}

      {tasks.map((task) => (
        <div key={task.id}>
          {task.title}
          <button onClick={() => completeTask(task.id)}>完成</button>
          <button onClick={() => deleteTask(task.id)}>删除</button>
        </div>
      ))}
    </div>
  );
}
```

## API 参考

### Options

| 参数           | 类型      | 默认值 | 描述                    |
| -------------- | --------- | ------ | ----------------------- |
| `initialTasks` | `Task[]`  | `[]`   | 初始任务列表            |
| `autoFetch`    | `boolean` | `true` | 是否自动从 API 获取任务 |

### 返回值

#### 状态

| 属性        | 类型             | 描述         |
| ----------- | ---------------- | ------------ |
| `tasks`     | `Task[]`         | 当前任务列表 |
| `isLoading` | `boolean`        | 是否正在加载 |
| `error`     | `string \| null` | 错误信息     |

#### API 操作方法

| 方法           | 类型                             | 描述                         |
| -------------- | -------------------------------- | ---------------------------- |
| `addTask`      | `(task) => Promise<void>`        | 添加任务（API 调用）         |
| `updateTask`   | `(id, updates) => Promise<void>` | 更新任务（API 调用）         |
| `deleteTask`   | `(id) => Promise<void>`          | 删除任务（API 调用）         |
| `completeTask` | `(id) => Promise<void>`          | 切换任务完成状态（API 调用） |

#### 工具方法

| 方法           | 类型                        | 描述             |
| -------------- | --------------------------- | ---------------- |
| `getTaskById`  | `(id) => Task \| undefined` | 根据 ID 获取任务 |
| `refreshTasks` | `() => Promise<void>`       | 刷新任务列表     |

## 使用场景

### 1. Pomodoro 任务管理器

```tsx
// 使用 API 调用，适合生产环境
const { tasks, addTask, completeTask, deleteTask } = useTask({
  initialTasks: serverTasks,
});
```

### 2. 任务矩阵（四象限）

```tsx
// 使用 API 调用，适合生产环境
const { tasks, addTask, updateTask, deleteTask } = useTask({
  autoFetch: true,
});
```

### 3. 实时协作

```tsx
// 结合 WebSocket 或其他实时更新
const { tasks, refreshTasks } = useTask();

useEffect(() => {
  socket.on("task-updated", (updatedTask) => {
    // 刷新任务列表以获取最新数据
    refreshTasks();
  });
}, [refreshTasks]);
```

## 注意事项

1. **错误处理**: API 调用方法会自动处理错误并显示 toast 提示
2. **状态同步**: 删除任务时会自动清理当前选中的任务
3. **类型安全**: 所有方法都有完整的 TypeScript 类型定义
4. **数据持久化**: 所有操作都会保存到数据库
5. **多用户支持**: 支持多用户同时使用和实时数据同步
