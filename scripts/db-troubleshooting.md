# 数据库连接问题排查指南

## 当前错误

```
Can't reach database server at `interchange.proxy.rlwy.net:21442`
```

## 快速诊断步骤

### 1. 运行诊断脚本

```bash
pnpm test:db
```

这个脚本会：
- 检查环境变量是否配置
- 测试数据库连接
- 显示详细的错误信息

### 2. 检查 Railway 数据库状态

如果使用的是 Railway 数据库：

1. **登录 Railway 控制台**
   - 访问 https://railway.app
   - 登录您的账户

2. **检查数据库服务状态**
   - 进入项目页面
   - 找到数据库服务
   - 检查服务是否正在运行（绿色状态）
   - 如果显示"Paused"或"Stopped"，需要重新启动

3. **获取最新的连接信息**
   - 点击数据库服务
   - 进入 "Connect" 或 "Variables" 标签
   - 复制最新的 `DATABASE_URL`
   - 更新到 `.env.local` 文件中

### 3. Railway 免费服务常见问题

**问题：服务已暂停**
- Railway 免费服务在长时间不活动后会自动暂停
- 解决方案：在 Railway 控制台中重新启动服务

**问题：连接信息已更改**
- Railway 可能会更新数据库连接信息
- 解决方案：从 Railway 控制台获取最新的连接字符串

**问题：网络连接问题**
- 某些地区可能无法直接访问 Railway 服务器
- 解决方案：
  - 使用 VPN 或代理
  - 检查防火墙设置
  - 尝试使用不同的网络环境

### 4. 验证连接字符串格式

正确的 PostgreSQL 连接字符串格式：

```
postgresql://用户名:密码@主机:端口/数据库名?参数
```

示例：
```
postgresql://postgres:password@interchange.proxy.rlwy.net:21442/railway
```

**注意事项：**
- 如果密码包含特殊字符，需要进行 URL 编码
- 常见特殊字符编码：
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`
  - `&` → `%26`
  - `+` → `%2B`
  - `=` → `%3D`
  - `?` → `%3F`
  - `/` → `%2F`
  - `:` → `%3A`

### 5. 测试网络连接

```bash
# 测试主机和端口是否可达
telnet interchange.proxy.rlwy.net 21442

# 或使用 nc (netcat)
nc -zv interchange.proxy.rlwy.net 21442
```

如果连接失败，可能是：
- 网络问题
- 防火墙阻止
- 服务器已关闭

### 6. 使用 Prisma 命令测试

```bash
# 测试数据库连接
npx prisma db pull

# 查看数据库状态
npx prisma studio
```

### 7. 检查环境变量加载

```bash
# 检查环境变量是否已加载
node -e "console.log(process.env.DATABASE_URL ? '已设置' : '未设置')"

# 查看连接字符串（隐藏密码）
node -e "const url = process.env.DATABASE_URL; console.log(url ? url.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@') : '未设置')"
```

### 8. 临时解决方案

如果无法立即解决连接问题，可以考虑：

1. **使用本地数据库进行开发**
   ```bash
   # 安装 PostgreSQL（如果还没有）
   # macOS: brew install postgresql
   # 启动本地数据库
   brew services start postgresql
   
   # 更新 .env.local
   DATABASE_URL="postgresql://postgres:password@localhost:5432/dawnTimer"
   ```

2. **使用 Docker 运行本地数据库**
   ```bash
   docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
   ```

## 联系支持

如果以上步骤都无法解决问题：

1. **Railway 支持**
   - 检查 Railway 状态页面：https://status.railway.app
   - 联系 Railway 支持团队

2. **检查项目日志**
   - 查看 Railway 项目日志
   - 检查是否有相关错误信息

3. **社区支持**
   - Prisma Discord: https://pris.ly/discord
   - Railway Discord: https://discord.gg/railway

